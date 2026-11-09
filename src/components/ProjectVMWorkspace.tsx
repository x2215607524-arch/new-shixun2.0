import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Monitor, Maximize2, RefreshCw, Layers, X, CheckSquare, Info, KeyRound, Power, Eye, EyeOff } from 'lucide-react';
import ProjectWorkspaceChecks from './ProjectWorkspaceChecks';

export interface ProjectVirtualMachine {
  id: string; name?: string; type?: string; image?: string; resourcePool?: string;
  username?: string; password?: string; demoCredentials?: boolean;
}

export default function ProjectVMWorkspace({ title, machines, canEdit, onBack }: {
  title: string; machines: ProjectVirtualMachine[]; canEdit: boolean; onBack: () => void;
}) {
  const [activeId, setActiveId] = useState(machines[0]?.id || '');
  const machine = machines.find(item => item.id === activeId) || machines[0];
  const { image, resourcePool } = machine || {};
  const machineLabel = (item: ProjectVirtualMachine) => item.name || `虚机 ${machines.indexOf(item) + 1}`;
  const [credentialsId, setCredentialsId] = useState<string | null>(null);
  const [restartId, setRestartId] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [busy, setBusy] = useState<Record<string, string>>({});
  const [connections, setConnections] = useState<Record<string, number>>({});
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const credentialsMachine = machines.find(item => item.id === credentialsId);
  const restartMachine = machines.find(item => item.id === restartId);
  const runOperation = (item: ProjectVirtualMachine, operation: '重新连接' | '重启') => {
    if (busy[item.id]) return;
    setBusy(previous => ({ ...previous, [item.id]: operation === '重启' ? '重启中' : '连接中' }));
    timers.current.push(setTimeout(() => {
      setBusy(previous => ({ ...previous, [item.id]: '' }));
      setConnections(previous => ({ ...previous, [item.id]: (previous[item.id] || 0) + 1 }));
      setNotice(`${machineLabel(item)}：${operation}流程演示结束，尚未接入虚机服务，未执行真实${operation}。`);
    }, 1200));
  };
  const screen = useRef<HTMLDivElement>(null);
  const [showChecks, setShowChecks] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [imageName, setImageName] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  return <div className="fixed inset-0 z-50 bg-white flex flex-col text-[13px]">
    <header className="min-h-12 border-b border-neutral-200 bg-[#fafafa] px-4 py-2 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-4 min-w-0"><button onClick={onBack} className="flex items-center gap-1 text-neutral-600 hover:text-[#fa541c] cursor-pointer shrink-0"><ArrowLeft size={17} />返回</button><span className="h-4 w-px bg-neutral-200" /><h1 title={title} className="font-semibold truncate max-w-[50vw]">{title}</h1><span className="text-purple-600 bg-purple-50 border border-purple-200 rounded px-2 py-0.5 shrink-0">虚机</span></div>
      <button disabled={!canEdit} onClick={() => { setImageName(''); setError(''); setShowUpdate(true); }} className="flex items-center gap-1.5 bg-[#fa541c] hover:bg-[#e84a15] text-white px-3 py-2 rounded cursor-pointer disabled:bg-[#ffbb96] disabled:cursor-not-allowed"><Layers size={15} />更新项目镜像</button>
    </header>
    {notice && <div role="status" className="bg-orange-50 text-orange-700 px-4 py-2 flex items-center justify-between gap-3">{notice}<button aria-label="关闭提示" onClick={() => setNotice('')} className="cursor-pointer"><X size={15} /></button></div>}
    <div className="flex flex-1 min-h-0">
      <nav className="w-16 shrink-0 bg-[#fafafa] border-r border-neutral-200 py-4 flex flex-col gap-6">
        <button onClick={() => setShowChecks(false)} className={`flex flex-col items-center gap-1 cursor-pointer ${!showChecks ? 'text-[#fa541c]' : 'text-neutral-500'}`}><Monitor size={20} /><span className="text-[10px]">虚机桌面</span></button>
        <button onClick={() => setShowChecks(!showChecks)} className={`flex flex-col items-center gap-1 cursor-pointer ${showChecks ? 'text-[#fa541c]' : 'text-neutral-500'}`}><CheckSquare size={20} /><span className="text-[10px]">检查项</span></button>
      </nav>
      <aside hidden={!showChecks} className="w-72 border-r border-neutral-200 overflow-y-auto shrink-0"><ProjectWorkspaceChecks /></aside>
      <main className="flex-1 min-w-0 flex flex-col bg-[#f5f6f8]">
        <div role="tablist" aria-label="项目虚机" className="flex overflow-x-auto shrink-0 gap-1 px-4 pt-2 bg-[#fafafa] border-b border-neutral-200">
          {machines.map(item => <button key={item.id} role="tab" aria-selected={machine?.id === item.id} onClick={() => { setActiveId(item.id); setShowUpdate(false); }} className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap cursor-pointer ${machine?.id === item.id ? 'border-[#fa541c] text-[#fa541c] bg-white font-medium' : 'border-transparent text-neutral-500 hover:bg-white'}`}><Monitor size={15} />{machineLabel(item)}{busy[item.id] && <span className="text-xs">{busy[item.id]}</span>}</button>)}
        </div>
        <div className="bg-white px-4 py-3 border-b border-neutral-200 flex flex-wrap justify-between gap-3 items-center">
          <div className="flex items-center gap-2"><Monitor size={16} className="text-neutral-500" /><span className="font-medium">{machine ? machineLabel(machine) : '虚机'} · noVNC</span><span className="text-neutral-400 text-xs">{busy[activeId] || '未连接'}</span></div>
          <div className="flex flex-wrap items-center gap-4 text-neutral-500">
            <button onClick={() => { setPasswordVisible(false); setCredentialsId(machine.id); }} className="flex items-center gap-1 hover:text-[#fa541c] cursor-pointer"><KeyRound size={14} />登录账号密码</button>
            <button disabled={!!busy[activeId]} onClick={() => runOperation(machine, '重新连接')} className="flex items-center gap-1 hover:text-[#fa541c] cursor-pointer disabled:text-[#ffbb96] disabled:cursor-not-allowed"><RefreshCw size={14} className={busy[activeId] === '连接中' ? 'animate-spin' : ''} />重新连接</button>
            <button disabled={!canEdit || !!busy[activeId]} onClick={() => setRestartId(machine.id)} className="flex items-center gap-1 hover:text-[#fa541c] cursor-pointer disabled:text-[#ffbb96] disabled:cursor-not-allowed"><Power size={14} />重启</button>
            <button onClick={() => screen.current?.requestFullscreen().catch(() => setNotice('浏览器暂不支持全屏显示。'))} className="flex items-center gap-1 hover:text-[#fa541c] cursor-pointer"><Maximize2 size={14} />全屏</button>
          </div>
        </div>
        <div ref={screen} key={`${activeId}-${connections[activeId] || 0}`} className="flex-1 min-h-0 bg-[#20242c] flex items-center justify-center p-8 text-center">
          <div className="max-w-md"><Monitor size={52} className="mx-auto text-neutral-500 mb-5" /><h2 className="text-lg font-medium text-white">{busy[activeId] || '等待连接虚机桌面'}</h2><p className="text-neutral-300 mt-3">{machine && machineLabel(machine)}</p><p className="text-neutral-400 mt-3 leading-6">当前为 noVNC 页面演示，尚未接入虚机控制台服务。</p><p className="text-neutral-500 mt-2 text-xs">接入后可在此操作虚机，完成在线出题和环境配置。</p></div>
        </div>
        <footer className="bg-white border-t border-neutral-200 px-4 py-2 text-xs text-neutral-500 flex flex-wrap gap-x-6 gap-y-1"><span>资源池：{resourcePool || '--'}</span><span className="break-all">当前镜像：{image || '--'}</span><span>控制台：noVNC</span></footer>
      </main>
    </div>
    {credentialsMachine && <div className="fixed inset-0 z-[100] bg-black/45 flex items-center justify-center p-4" onClick={() => setCredentialsId(null)}>
      <section role="dialog" aria-modal="true" aria-labelledby="vm-login-title" className="w-full max-w-[460px] bg-white rounded-lg shadow-xl" onClick={event => event.stopPropagation()}>
        <header className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center"><h2 id="vm-login-title" className="font-semibold text-base">登录账号密码</h2><button aria-label="关闭" onClick={() => setCredentialsId(null)} className="cursor-pointer text-neutral-400"><X size={18} /></button></header>
        <div className="p-6 space-y-4"><p className="text-neutral-500">{machineLabel(credentialsMachine)}</p>{credentialsMachine.demoCredentials && <p className="bg-orange-50 p-3 rounded text-orange-700">以下为演示账号密码，仅用于页面效果展示。</p>}<div className="flex gap-4"><span className="w-14 text-neutral-500 shrink-0">账号</span><span className="font-mono break-all">{credentialsMachine.username || '暂未提供'}</span></div><div className="flex gap-4 items-center"><span className="w-14 text-neutral-500 shrink-0">密码</span><span className="font-mono break-all flex-1">{credentialsMachine.password ? passwordVisible ? credentialsMachine.password : '••••••••' : '暂未提供'}</span>{credentialsMachine.password && <button aria-label={passwordVisible ? '隐藏密码' : '显示密码'} onClick={() => setPasswordVisible(!passwordVisible)} className="cursor-pointer text-neutral-500">{passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}</button>}</div></div>
        <footer className="border-t border-neutral-100 px-6 py-4 flex justify-end"><button onClick={() => setCredentialsId(null)} className="border border-neutral-200 rounded px-4 py-2 cursor-pointer">关闭</button></footer>
      </section>
    </div>}
    {restartMachine && <div className="fixed inset-0 z-[100] bg-black/45 flex items-center justify-center p-4" onClick={() => setRestartId(null)}>
      <section role="alertdialog" aria-modal="true" aria-labelledby="vm-restart-title" className="bg-white rounded-lg shadow-xl p-6 w-full max-w-[440px]" onClick={event => event.stopPropagation()}><h2 id="vm-restart-title" className="font-semibold text-base flex items-center gap-2"><Power size={18} className="text-[#fa541c]" />重启虚机</h2><p className="text-neutral-600 mt-4 leading-6">确认重启“{machineLabel(restartMachine)}”吗？重启会中断当前连接，请先保存工作。</p><p className="mt-2 text-xs text-neutral-400">当前为演示流程，不会实际重启虚机。</p><footer className="mt-6 flex justify-end gap-3"><button onClick={() => setRestartId(null)} className="border border-neutral-200 rounded px-4 py-2 cursor-pointer">取消</button><button onClick={() => { if (!canEdit) return; runOperation(restartMachine, '重启'); setRestartId(null); }} className="bg-[#fa541c] text-white rounded px-4 py-2 cursor-pointer">确认重启</button></footer></section>
    </div>}
    {showUpdate && <div className="fixed inset-0 z-[100] bg-black/45 flex items-center justify-center p-4" onClick={() => setShowUpdate(false)}>
      <section role="dialog" aria-modal="true" aria-labelledby="update-project-image-title" className="bg-white rounded-lg shadow-xl w-full max-w-[520px]" onClick={event => event.stopPropagation()}>
        <header className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center"><h2 id="update-project-image-title" className="font-semibold text-base">更新项目镜像</h2><button aria-label="关闭" onClick={() => setShowUpdate(false)} className="text-neutral-400 cursor-pointer"><X size={18} /></button></header>
        <form onSubmit={event => { event.preventDefault(); if (!canEdit) return; if (!imageName.trim()) { setError('请输入镜像名称'); return; } setShowUpdate(false); setNotice(`镜像“${imageName.trim()}”的更新流程已演示完成，尚未接入镜像制作接口，当前项目镜像未变更。`); }}>
          <div className="p-6 space-y-5"><div className="bg-orange-50 text-orange-700 rounded p-3 flex gap-2 leading-6"><Info size={17} className="shrink-0 mt-1" /><p>将当前虚机的环境配置制作成项目镜像，用于后续启动项目。请先保存虚机中的工作。当前仅演示操作流程。</p></div><p className="text-neutral-500 break-all">目标虚机：{machine && machineLabel(machine)}<br />当前镜像：{image || '--'}</p><div><label htmlFor="project-vm-image-name" className="block mb-2 text-neutral-700">镜像名称 <span className="text-[#fa541c]">*</span></label><input autoFocus id="project-vm-image-name" maxLength={100} value={imageName} onChange={event => { setImageName(event.target.value); setError(''); }} placeholder="请输入更新后的镜像名称" className="border border-neutral-200 rounded w-full px-3 py-2 focus:outline-none focus:border-[#fa541c]" />{error && <p role="alert" className="text-red-500 mt-2">{error}</p>}</div></div>
          <footer className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3"><button type="button" onClick={() => setShowUpdate(false)} className="border border-neutral-200 rounded px-4 py-2 cursor-pointer">取消</button><button type="submit" className="bg-[#fa541c] hover:bg-[#e84a15] text-white rounded px-4 py-2 cursor-pointer">确认更新</button></footer>
        </form>
      </section>
    </div>}
  </div>;
}
