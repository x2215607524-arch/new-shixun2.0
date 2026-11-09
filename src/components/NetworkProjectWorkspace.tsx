import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { ArrowLeft, Box, Cable, ChevronDown, Globe, Grip, MousePointer2, Plus, Save, Server, Shield, Type, X, ZoomIn, ZoomOut } from 'lucide-react';
import ProjectVMWorkspace from './ProjectVMWorkspace';
import TopologyCanvas from './TopologyCanvas';
import { initialTopology, readTopology, withStatusExamples, type Device, type Kind, type Topology } from '@/lib/topologyData';
import { uniqueDeviceName } from '@/lib/topologyGeometry';

const palette: { title: string; items: { name: string; kind: Kind }[] }[] = [
  { title: '节点', items: [{ name: 'Windows 1', kind: 'vm' }, { name: 'Windows 2', kind: 'vm' }, { name: 'Ubuntu', kind: 'vm' }, { name: 'GPU 节点', kind: 'vm' }] },
  { title: '网络', items: [{ name: '简单交换机', kind: 'switch' }, { name: '物理网桥', kind: 'bridge' }] },
  { title: '其他', items: [{ name: '文本框', kind: 'text' }, { name: '矩形框', kind: 'rectangle' }, { name: '线段', kind: 'line' }, { name: '虚线', kind: 'dashed' }] },
];
const control = 'px-3 py-2 rounded border border-neutral-200 bg-white text-neutral-600 hover:text-[#fa541c] hover:border-orange-200 cursor-pointer disabled:text-[#ffbb96] disabled:cursor-not-allowed text-xs';
function DeviceIcon({ kind, size = 34 }: { kind: Kind; size?: number }) {
  const Icon = kind === 'line' || kind === 'dashed' ? Cable : kind === 'vm' ? Server : kind === 'switch' ? Box : kind === 'bridge' ? Globe : kind === 'text' ? Type : Grip;
  return <Icon size={size} strokeWidth={1.4} />;
}

export default function NetworkProjectWorkspace({ projectId, title, canEdit, onBack }: { projectId: number; title: string; canEdit: boolean; onBack: () => void }) {
  const storageKey = `network-project-topology-${projectId}`;
  const [topology, setTopology] = useState<Topology>(() => {
    try { const saved = readTopology(JSON.parse(localStorage.getItem(storageKey) || 'null')); if (saved) return saved.version === 2 ? saved : withStatusExamples(saved); } catch { /* Use the sample when no saved topology is available. */ }
    return initialTopology();
  });
  const [selected, setSelected] = useState<string[]>([]);
  const [tab, setTab] = useState('拓扑管理');
  const [mode, setMode] = useState<'select' | 'connect'>('select');
  const [source, setSource] = useState<string | null>(null);
  const [showPorts, setShowPorts] = useState(false);
  const [message, setMessage] = useState('');
  const [context, setContext] = useState<{ x: number; y: number; ids: string[] } | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftBridge, setDraftBridge] = useState('vmbr0');
  const [consoleIds, setConsoleIds] = useState<string[] | null>(null);
  const [confirm, setConfirm] = useState<{ action: '删除' | '强制关机'; ids: string[] } | null>(null);
  const [snapshotIds, setSnapshotIds] = useState<string[] | null>(null);
  const [snapshots, setSnapshots] = useState<{ id: string; name: string; data: Topology }[]>([]);
  const [role, setRole] = useState('仅教师可编辑');
  const operationTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const usedNames = useRef(new Set<string>());
  usedNames.current = new Set(topology.devices.map(item => item.name));
  useEffect(() => () => operationTimers.current.forEach(clearTimeout), []);
  const device = topology.devices.find(item => item.id === selected[0]);
  const choose = (ids: string[]) => {
    setSelected(ids); const item = topology.devices.find(node => node.id === ids[0]);
    if (item) { setDraftName(item.name); setDraftBridge(item.bridge); }
  };
  const add = (name: string, kind: Kind, point?: { x: number; y: number }) => {
    if (!canEdit) return;
    const generatedName = uniqueDeviceName(name, usedNames.current);
    usedNames.current.add(generatedName);
    const item: Device = { id: crypto.randomUUID(), name: generatedName, kind, x: point?.x ?? 180 + topology.devices.length % 5 * 140, y: point?.y ?? 150 + Math.floor(topology.devices.length / 5) * 120, bridge: 'vmbr0', status: '未初始化', image: kind === 'vm' ? name : '' };
    setTopology(previous => ({ ...previous, devices: [...previous.devices, item] })); setSelected([item.id]); setDraftName(item.name); setDraftBridge(item.bridge);
  };
  const action = (name: string, ids = selected) => {
    setContext(null); if (!canEdit && !['打开控制台', '快照列表', '同步状态'].includes(name)) return;
    if (name === '删除' || name === '强制关机') { setConfirm({ action: name, ids }); return; }
    if (name === '快照列表') { setSnapshotIds(ids); return; }
    if (name === '打开控制台') {
      const vms = ids.filter(id => topology.devices.find(item => item.id === id)?.kind === 'vm');
      if (vms.length) setConsoleIds(vms); else setMessage('请选择虚机节点打开控制台。'); return;
    }
    if (name === '同步状态') { setMessage('当前显示本地演示状态，真实设备状态需接入虚机服务。'); return; }
    if (name === '连线模式') { setMode('connect'); setSource(null); return; }
    if (name === '初始化' || name === '开机') {
      setTopology(previous => ({ ...previous, devices: previous.devices.map(item => ids.includes(item.id) && item.kind === 'vm' ? { ...item, status: name === '初始化' ? '排队初始化' : '正在运行' } : item) }));
      if (name === '初始化') {
        operationTimers.current.push(setTimeout(() => setTopology(previous => ({ ...previous, devices: previous.devices.map(item => ids.includes(item.id) && item.status === '排队初始化' ? { ...item, status: '正在初始化' } : item) })), 1200));
        operationTimers.current.push(setTimeout(() => setTopology(previous => ({ ...previous, devices: previous.devices.map(item => ids.includes(item.id) && item.status === '正在初始化' ? { ...item, status: '关机' } : item) })), 2800));
      }
      setMessage(`${name}流程已演示，未调用真实虚机服务。`);
    }
    if (name === '对齐') {
      const base = topology.devices.find(item => item.id === ids[0]);
      if (base) setTopology(previous => ({ ...previous, devices: previous.devices.map(item => ids.includes(item.id) ? { ...item, y: base.y } : item) }));
    }
  };
  const save = () => { try { localStorage.setItem(storageKey, JSON.stringify(topology)); setMessage('拓扑已保存到当前浏览器。'); } catch { setMessage('本地保存失败，请检查浏览器存储空间。'); } };
  const menu = (event: MouseEvent, ids: string[]) => { event.preventDefault(); event.stopPropagation(); choose(ids); setContext({ x: Math.min(event.clientX, window.innerWidth - 180), y: Math.max(60, Math.min(event.clientY, window.innerHeight - 370)), ids }); };
  if (consoleIds) return <ProjectVMWorkspace title={title} canEdit={canEdit} onBack={() => setConsoleIds(null)} machines={topology.devices.filter(item => consoleIds.includes(item.id)).map(item => ({ ...item, type: '虚机', resourcePool: '网络仿真资源池' }))} />;

  return <div className="fixed inset-0 z-50 flex flex-col bg-[#f5f6f8] text-[13px] text-neutral-700" onPointerDown={() => setContext(null)}>
    <header className="h-14 shrink-0 bg-white border-b border-neutral-200 flex justify-between items-center px-5 gap-4"><div className="flex gap-4 items-center min-w-0"><button onClick={onBack} className="flex gap-1 items-center hover:text-[#fa541c] cursor-pointer shrink-0"><ArrowLeft size={17} />返回</button><span className="h-4 w-px bg-neutral-200" /><h1 title={title} className="truncate font-semibold">{title}</h1><span className="shrink-0 bg-blue-50 text-blue-600 text-xs rounded px-2 py-1">网络仿真 · 在线出题</span></div><button disabled={!canEdit} onClick={save} className="bg-[#fa541c] text-white rounded px-4 py-2 flex items-center gap-2 cursor-pointer disabled:bg-[#ffbb96]"><Save size={15} />保存拓扑</button></header>
    <div className="bg-white px-5 flex justify-between gap-3 border-b border-neutral-200 shrink-0"><nav className="flex gap-6">{['设备管理', '拓扑管理', '权限管理'].map(name => <button key={name} onClick={() => { setTab(name); setContext(null); }} className={`py-3 border-b-2 cursor-pointer ${tab === name ? 'border-[#fa541c] text-[#fa541c] font-semibold' : 'border-transparent'}`}>{name}</button>)}</nav><span className="self-center text-xs text-neutral-400">虚机操作为演示 · 拓扑支持本地保存</span></div>
    {message && <div role="status" className="bg-orange-50 px-5 py-2 text-orange-700 flex justify-between">{message}<button aria-label="关闭提示" onClick={() => setMessage('')} className="cursor-pointer"><X size={15} /></button></div>}
    {tab === '权限管理' ? <main className="p-6 overflow-auto"><section className="bg-white rounded-lg border border-neutral-200 p-6 max-w-3xl"><h2 className="font-semibold text-base mb-5 flex items-center gap-2"><Shield size={18} />拓扑编辑权限</h2><label className="flex gap-4 items-center">编辑范围<select value={role} disabled={!canEdit} onChange={event => setRole(event.target.value)} className="border border-neutral-200 rounded p-2"><option>仅教师可编辑</option><option>学生可编辑副本</option><option>学生仅可查看</option></select></label><p className="text-neutral-400 text-xs mt-4">权限为本地配置演示，尚未接入服务端授权。</p></section></main> : tab === '设备管理' ? <main className="p-6 overflow-auto"><div className="flex flex-wrap gap-2 mb-4">{['初始化', '开机', '打开控制台', '强制关机', '快照列表', '删除'].map(name => <button key={name} disabled={!selected.length} className={control} onClick={() => action(name)}>批量{name}</button>)}</div><table className="w-full bg-white rounded-lg text-left"><thead className="bg-neutral-50"><tr>{['选择', '设备名称', '类型', '所属网桥', '状态', '操作'].map(name => <th key={name} className="p-4 font-medium">{name}</th>)}</tr></thead><tbody>{topology.devices.filter(item => item.kind === 'vm').map(item => <tr key={item.id} className="border-t border-neutral-100"><td className="p-4"><input aria-label={`选择${item.name}`} type="checkbox" checked={selected.includes(item.id)} onChange={() => choose(selected.includes(item.id) ? selected.filter(id => id !== item.id) : [...selected, item.id])} /></td><td className="p-4">{item.name}</td><td className="p-4">虚机</td><td className="p-4">{item.bridge}</td><td className="p-4">{item.status}</td><td className="p-4 flex gap-3">{['初始化', '开机', '打开控制台', '快照列表'].map(name => <button key={name} className="text-[#fa541c] cursor-pointer" onClick={() => action(name, [item.id])}>{name}</button>)}</td></tr>)}</tbody></table></main> : <div className="flex flex-1 min-h-0">
      <aside className="w-52 shrink-0 bg-[#222d32] overflow-y-auto p-3 space-y-3">{palette.map(group => <details key={group.title} open><summary className="text-white flex justify-between items-center cursor-pointer py-3"><span>{group.title}</span><ChevronDown size={15} /></summary><div className="grid grid-cols-2 gap-2 p-2 bg-white rounded">{group.items.map(item => <button disabled={!canEdit} key={item.name} draggable={canEdit} onDragStart={event => event.dataTransfer.setData('application/topology-node', JSON.stringify(item))} onClick={() => add(item.name, item.kind)} className="text-[11px] py-3 text-neutral-600 flex flex-col gap-2 items-center hover:bg-blue-50 cursor-grab"><span className="text-blue-500"><DeviceIcon kind={item.kind} /></span>{item.name}</button>)}</div></details>)}<p className="text-neutral-400 text-xs leading-5">拖拽设备至画布；Ctrl + 滚轮缩放；空格 + 左键平移；框选后可批量拖动；靠近设备自动吸附。</p></aside>
      <TopologyCanvas topology={topology} setTopology={setTopology} selected={selected} choose={choose} canEdit={canEdit} mode={mode} setMode={setMode} source={source} setSource={setSource} showPorts={showPorts} setShowPorts={setShowPorts} add={add} menu={menu} />
      <aside className="w-60 shrink-0 bg-[#222d32] text-neutral-200 p-4 flex flex-col"><h2 className="font-semibold pb-4 border-b border-neutral-600">设备属性</h2>{device ? <div className="mt-5 space-y-5"><div><label htmlFor="topology-device-name" className="block mb-2 text-xs">名称 <span className="text-orange-400">*</span></label><input id="topology-device-name" value={draftName} maxLength={128} disabled={!canEdit} onChange={event => setDraftName(event.target.value)} className="w-full bg-[#344249] border border-neutral-600 rounded px-2 py-2 text-white" /></div><div><label htmlFor="topology-device-bridge" className="block mb-2 text-xs">所属网桥</label><select id="topology-device-bridge" value={draftBridge} disabled={!canEdit} onChange={event => setDraftBridge(event.target.value)} className="w-full bg-[#344249] border border-neutral-600 rounded p-2">{['vmbr0', 'vmbr1', 'vmbr2', 'vmbr3', 'vmbr4'].map(name => <option key={name}>{name}</option>)}</select></div><p className="text-xs text-neutral-400">{device.kind === 'vm' ? `环境类型：虚机 · ${device.status}` : '拓扑辅助节点'}</p><div className="flex gap-2"><button className="px-4 py-2 border border-neutral-500 rounded cursor-pointer" onClick={() => choose(selected)}>取消</button><button disabled={!canEdit} className="px-4 py-2 bg-[#fa541c] text-white rounded cursor-pointer disabled:bg-[#ffbb96]" onClick={() => { if (!draftName.trim()) { setMessage('设备名称不能为空。'); return; } if (topology.devices.some(item => item.id !== device.id && item.name === draftName.trim())) { setMessage('设备名称已存在，请使用拓扑内唯一的名称。'); return; } setTopology(previous => ({ ...previous, devices: previous.devices.map(item => item.id === device.id ? { ...item, name: draftName.trim(), bridge: draftBridge } : item) })); setMessage('设备属性已更新，请保存拓扑。'); }}>保存</button></div></div> : <p className="text-neutral-400 text-xs mt-5">选择节点查看和编辑设备属性</p>}<div className="mt-auto text-xs text-neutral-400 leading-6 pt-6">节点 {topology.devices.length} · 连线 {topology.links.length}<br />双击连线可删除连线</div></aside>
    </div>}
    {context && <div onPointerDown={event => event.stopPropagation()} style={{ left: context.x, top: context.y }} className="fixed z-[80] bg-white shadow-xl border border-neutral-200 rounded py-1 min-w-40 text-xs">{(context.ids.length ? ['设备属性', '初始化', '同步状态', '开机', '打开控制台', '强制关机', '快照列表', ...(context.ids.length > 1 ? ['对齐'] : []), '删除', '连线模式'] : ['连线模式', '退出连线', '刷新', '显示/隐藏连线端口']).map(name => <button key={name} onClick={() => { if (name === '设备属性') { choose(context.ids); setContext(null); } else if (name === '退出连线') { setMode('select'); setSource(null); setContext(null); } else if (name === '刷新') { setMessage('画布已刷新。'); setContext(null); } else if (name === '显示/隐藏连线端口') { setShowPorts(!showPorts); setContext(null); } else action(name, context.ids); }} className="block text-left w-full px-4 py-2 hover:bg-orange-50 hover:text-[#fa541c] cursor-pointer">{context.ids.length > 1 && !['设备属性', '连线模式', '对齐'].includes(name) ? '批量' : ''}{name}</button>)}</div>}
    {confirm && <div className="fixed inset-0 z-[90] bg-black/45 flex items-center justify-center p-4"><section role="alertdialog" aria-modal="true" className="bg-white rounded-lg p-6 w-full max-w-md"><h2 className="font-semibold text-base">确认{confirm.action}</h2><p className="my-5 leading-6">确认对所选 {confirm.ids.length} 个节点执行{confirm.action}吗？{confirm.action === '删除' ? '关联连线也会被删除。' : '虚机未保存的工作可能丢失（当前为演示操作）。'}</p><div className="flex gap-3 justify-end"><button className={control} onClick={() => setConfirm(null)}>取消</button><button className="bg-[#fa541c] text-white rounded px-4 py-2 cursor-pointer" onClick={() => { if (!canEdit) return; setTopology(previous => confirm.action === '删除' ? { devices: previous.devices.filter(item => !confirm.ids.includes(item.id)), links: previous.links.filter(item => !confirm.ids.includes(item.from) && !confirm.ids.includes(item.to)) } : { ...previous, devices: previous.devices.map(item => confirm.ids.includes(item.id) && item.kind === 'vm' ? { ...item, status: '关机' } : item) }); setSelected([]); setConfirm(null); }}>确认</button></div></section></div>}
    {snapshotIds && <div className="fixed inset-0 z-[90] bg-black/45 flex items-center justify-center p-4"><section role="dialog" aria-modal="true" className="bg-white rounded-lg p-6 w-full max-w-lg"><h2 className="font-semibold text-base mb-4">快照列表 · 本地演示</h2><p className="text-xs text-neutral-400 mb-4">此处保存拓扑配置快照，不包含虚机磁盘数据。</p><button className={control} disabled={!canEdit} onClick={() => setSnapshots(previous => [...previous, { id: crypto.randomUUID(), name: `快照 ${previous.length + 1} · ${new Date().toLocaleTimeString()}`, data: structuredClone(topology) }])}><Plus size={13} className="inline mr-1" />创建快照</button><div className="my-4 max-h-64 overflow-auto">{snapshots.length ? snapshots.map(item => <div key={item.id} className="py-3 border-b border-neutral-100 flex justify-between gap-3"><span>{item.name}</span><button className="text-[#fa541c] cursor-pointer" disabled={!canEdit} onClick={() => { if (!canEdit) return; setTopology(structuredClone(item.data)); setSnapshotIds(null); setMessage('已恢复本地拓扑快照。'); }}>恢复拓扑</button></div>) : <p className="text-neutral-400 py-5 text-center">暂无快照</p>}</div><footer className="flex justify-end"><button className={control} onClick={() => setSnapshotIds(null)}>关闭</button></footer></section></div>}
  </div>;
}
