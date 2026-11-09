import { useEffect, useRef, useState, type Dispatch, type SetStateAction, type MouseEvent, type PointerEvent } from 'react';
import { Box, Cable, CircleDashed, Clock3, Hand, LoaderCircle, MousePointer2, Power, Server, Trash2, TriangleAlert, Play, Type, Globe, Grip, ZoomIn, ZoomOut } from 'lucide-react';
import { STATUS_STYLE, type Device, type Kind, type Topology } from '@/lib/topologyData';
import { boundsOf, snappedMovement, WORLD, zoomAtPoint, type Guide, type Position } from '@/lib/topologyGeometry';

type Camera = { x: number; y: number; zoom: number };
type Gesture =
  | { type: 'pan'; x: number; y: number; camera: Camera }
  | { type: 'box'; x: number; y: number; additive: string[] }
  | { type: 'devices'; x: number; y: number; nodes: Position[]; anchorId: string; moved: boolean };
const button = 'px-3 py-2 rounded border border-neutral-200 bg-white text-neutral-600 hover:text-[#fa541c] hover:border-orange-200 cursor-pointer disabled:text-[#ffbb96] disabled:cursor-not-allowed text-xs';
const statusIcons = { 未初始化: CircleDashed, 关机: Power, 启动异常: TriangleAlert, 正在运行: Play, 排队初始化: Clock3, 正在初始化: LoaderCircle, 排队删除: Trash2 };
const size = (node: Device) => ({ width: node.kind === 'rectangle' ? 128 : 112, height: 92 });
const editableTarget = (target: EventTarget | null) => target instanceof Element && !!target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"], [role="alertdialog"]');

export default function TopologyCanvas({ topology, setTopology, selected, choose, canEdit, mode, setMode, source, setSource, showPorts, setShowPorts, add, menu }: {
  topology: Topology; setTopology: Dispatch<SetStateAction<Topology>>; selected: string[]; choose: (ids: string[]) => void; canEdit: boolean;
  mode: 'select' | 'connect'; setMode: (mode: 'select' | 'connect') => void; source: string | null; setSource: (id: string | null) => void;
  showPorts: boolean; setShowPorts: (show: boolean) => void;
  add: (name: string, kind: Kind, point?: { x: number; y: number }) => void; menu: (event: MouseEvent, ids: string[]) => void;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const [camera, setCamera] = useState<Camera>({ x: 30, y: 10, zoom: 1 });
  const cameraRef = useRef(camera);
  const [space, setSpace] = useState(false);
  const spaceRef = useRef(false);
  const gesture = useRef<Gesture | null>(null);
  const [panning, setPanning] = useState(false);
  const [marquee, setMarquee] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const marqueeRef = useRef(marquee);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [snap, setSnap] = useState(true);
  const updateCamera = (next: Camera) => { cameraRef.current = next; setCamera(next); };
  const position = (event: { clientX: number; clientY: number }) => {
    const rect = viewport.current!.getBoundingClientRect(); const view = cameraRef.current;
    return { x: (event.clientX - rect.left - view.x) / view.zoom, y: (event.clientY - rect.top - view.y) / view.zoom };
  };
  const zoom = (value: number) => {
    const rect = viewport.current!.getBoundingClientRect();
    updateCamera(zoomAtPoint(cameraRef.current, rect.width / 2, rect.height / 2, value));
  };
  useEffect(() => {
    const element = viewport.current!;
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      if (gesture.current) return;
      const rect = element.getBoundingClientRect();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rect.height : 1);
      updateCamera(zoomAtPoint(cameraRef.current, event.clientX - rect.left, event.clientY - rect.top, cameraRef.current.zoom * Math.exp(-delta * .002)));
    };
    const keyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || editableTarget(event.target)) return;
      event.preventDefault(); spaceRef.current = true; setSpace(true);
    };
    const keyUp = (event: KeyboardEvent) => { if (event.code === 'Space') { spaceRef.current = false; setSpace(false); } };
    const reset = () => { spaceRef.current = false; setSpace(false); gesture.current = null; setPanning(false); setMarquee(null); marqueeRef.current = null; setGuides([]); };
    element.addEventListener('wheel', wheel, { passive: false });
    window.addEventListener('keydown', keyDown); window.addEventListener('keyup', keyUp); window.addEventListener('blur', reset);
    return () => { element.removeEventListener('wheel', wheel); window.removeEventListener('keydown', keyDown); window.removeEventListener('keyup', keyUp); window.removeEventListener('blur', reset); };
  }, []);
  const capture = (event: PointerEvent) => viewport.current?.setPointerCapture(event.pointerId);
  const beginPan = (event: PointerEvent) => {
    if (event.button !== 0 || !spaceRef.current) return;
    event.preventDefault(); event.stopPropagation();
    gesture.current = { type: 'pan', x: event.clientX, y: event.clientY, camera: { ...cameraRef.current } }; setPanning(true); capture(event);
  };
  const beginDevice = (event: PointerEvent, node: Device) => {
    if (event.button !== 0 || spaceRef.current) return;
    event.stopPropagation(); event.preventDefault();
    if (mode === 'connect') {
      if (!canEdit || !['vm', 'switch', 'bridge'].includes(node.kind)) return;
      if (!source) setSource(node.id);
      else if (source !== node.id) {
        setTopology(previous => previous.links.some(link => link.from === source && link.to === node.id || link.to === source && link.from === node.id) ? previous : { ...previous, links: [...previous.links, { id: crypto.randomUUID(), from: source, to: node.id }] }); setSource(null);
      }
      return;
    }
    const ids = event.shiftKey ? selected.includes(node.id) ? selected.filter(id => id !== node.id) : [...selected, node.id] : selected.includes(node.id) ? selected : [node.id];
    choose(ids);
    if (!canEdit || event.shiftKey) return;
    const point = position(event);
    gesture.current = { type: 'devices', ...point, nodes: topology.devices.filter(item => ids.includes(item.id)).map(item => ({ id: item.id, x: item.x, y: item.y, ...size(item) })), anchorId: node.id, moved: false };
    capture(event);
  };
  const move = (event: PointerEvent) => {
    const current = gesture.current; if (!current) return;
    if (current.type === 'pan') {
      updateCamera({ ...current.camera, x: current.camera.x + event.clientX - current.x, y: current.camera.y + event.clientY - current.y }); return;
    }
    const point = position(event);
    if (current.type === 'box') {
      const rect = { x: Math.min(point.x, current.x), y: Math.min(point.y, current.y), w: Math.abs(point.x - current.x), h: Math.abs(point.y - current.y) };
      marqueeRef.current = rect; setMarquee(rect); return;
    }
    const dx = point.x - current.x; const dy = point.y - current.y;
    if (!current.moved && Math.hypot(dx, dy) * cameraRef.current.zoom < 3) return;
    current.moved = true;
    const movingIds = new Set(current.nodes.map(item => item.id));
    const stationary = topology.devices.filter(item => !movingIds.has(item.id)).map(item => ({ ...item, ...size(item) }));
    const movement = snappedMovement(current.nodes, snap ? stationary : [], dx, dy, cameraRef.current.zoom);
    setGuides(snap ? movement.guides : []);
    const origins = new Map<string, Position>(current.nodes.map(item => [item.id, item]));
    setTopology(previous => ({ ...previous, devices: previous.devices.map(item => { const origin = origins.get(item.id); return origin ? { ...item, x: origin.x + movement.dx, y: origin.y + movement.dy } : item; }) }));
  };
  const finish = (event: PointerEvent, cancelled = false) => {
    const current = gesture.current;
    if (!cancelled && current?.type === 'box') {
      const rect = marqueeRef.current;
      choose(rect ? [...new Set([...current.additive, ...topology.devices.filter(item => { const b = boundsOf([{ ...item, ...size(item) }]); return b.right >= rect.x && b.left <= rect.x + rect.w && b.bottom >= rect.y && b.top <= rect.y + rect.h; }).map(item => item.id)])] : current.additive);
    }
    if (!cancelled && current?.type === 'devices' && !current.moved) choose([current.anchorId]);
    gesture.current = null; setPanning(false); setGuides([]); setMarquee(null); marqueeRef.current = null;
    if (viewport.current?.hasPointerCapture(event.pointerId)) viewport.current.releasePointerCapture(event.pointerId);
  };
  return <main className="flex-1 min-w-0 flex flex-col min-h-0">
    <div className="bg-white border-b border-neutral-200 p-2 flex flex-wrap gap-2 items-center shrink-0">
      <button className={button} onClick={() => { setMode('select'); setSource(null); }}><MousePointer2 size={14} className="inline mr-1" />选择</button>
      <button disabled={!canEdit} className={`${button} ${mode === 'connect' ? 'text-[#fa541c] border-orange-300' : ''}`} onClick={() => { setMode('connect'); setSource(null); }}><Cable size={14} className="inline mr-1" />连线模式</button>
      <button className={button} aria-pressed={snap} onClick={() => setSnap(!snap)}>自动吸附：{snap ? '开' : '关'}</button>
      <button className={button} onClick={() => setShowPorts(!showPorts)}>显示/隐藏端口</button>
      <span className="flex-1 text-xs text-neutral-400 whitespace-nowrap">{mode === 'connect' ? source ? '请选择目标设备' : '请选择起始设备' : `已选 ${selected.length} 个节点`}</span>
      <button aria-label="缩小" className={button} onClick={() => zoom(camera.zoom - .1)}><ZoomOut size={14} /></button><span className="text-xs w-10 text-center">{Math.round(camera.zoom * 100)}%</span><button aria-label="放大" className={button} onClick={() => zoom(camera.zoom + .1)}><ZoomIn size={14} /></button><button className={button} onClick={() => updateCamera({ x: 30, y: 10, zoom: 1 })}>重置视图</button>
    </div>
    <div ref={viewport} data-testid="topology-viewport" className="flex-1 min-h-0 relative overflow-hidden bg-[#fcfcfd] select-none outline-none" tabIndex={0} aria-label="拓扑画布" style={{ touchAction: 'none', cursor: panning ? 'grabbing' : space ? 'grab' : mode === 'connect' ? 'crosshair' : 'default', backgroundImage: 'radial-gradient(#dce0e5 1px, transparent 1px)', backgroundSize: `${16 * camera.zoom}px ${16 * camera.zoom}px`, backgroundPosition: `${camera.x}px ${camera.y}px` }} onPointerDownCapture={beginPan} onPointerDown={event => { if (event.button !== 0 || spaceRef.current || (event.target as Element).closest('[data-device-id]')) return; event.preventDefault(); const point = position(event); gesture.current = { type: 'box', ...point, additive: event.shiftKey ? selected : [] }; if (!event.shiftKey) choose([]); capture(event); }} onPointerMove={move} onPointerUp={event => finish(event)} onPointerCancel={event => finish(event, true)} onContextMenu={event => menu(event, selected)} onDragOver={event => { event.preventDefault(); event.dataTransfer.dropEffect = canEdit ? 'copy' : 'none'; }} onDrop={event => {
      event.preventDefault(); if (!canEdit) return;
      try { const item = JSON.parse(event.dataTransfer.getData('application/topology-node')); if (!['vm', 'switch', 'bridge', 'text', 'rectangle', 'line', 'dashed'].includes(item.kind) || typeof item.name !== 'string') return; const point = position(event); add(item.name, item.kind, { x: Math.max(64, Math.min(WORLD.width - 64, point.x)), y: Math.max(46, Math.min(WORLD.height - 46, point.y)) }); } catch { /* Ignore non-palette drag data. */ }
    }}>
      <div data-testid="topology-world" className="absolute left-0 top-0" style={{ width: WORLD.width, height: WORLD.height, transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`, transformOrigin: '0 0', pointerEvents: 'none' }}>
        <svg width={WORLD.width} height={WORLD.height} className="absolute inset-0 pointer-events-none overflow-visible">
          {topology.links.map(link => { const from = topology.devices.find(item => item.id === link.from); const to = topology.devices.find(item => item.id === link.to); return from && to ? <g key={link.id}><line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#6da8e8" strokeWidth="2" /><line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="transparent" strokeWidth="16" className="pointer-events-auto cursor-pointer" onDoubleClick={event => { event.stopPropagation(); if (canEdit) setTopology(previous => ({ ...previous, links: previous.links.filter(item => item.id !== link.id) })); }}><title>双击删除连线</title></line>{showPorts && <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 8} fontSize="11" fill="#64748b">eth0 ↔ eth1</text>}</g> : null; })}
          {guides.map((guide, index) => <line key={index} data-testid="snap-guide" {...guide} stroke="#fa541c" strokeWidth={1 / camera.zoom} strokeDasharray="5 4" />)}
        </svg>
        {topology.devices.map(item => {
          const { width, height } = size(item); const Icon = item.kind === 'vm' ? Server : item.kind === 'switch' ? Box : item.kind === 'bridge' ? Globe : item.kind === 'text' ? Type : item.kind === 'rectangle' ? Grip : Cable;
          const StatusIcon = statusIcons[item.status]; const styles = STATUS_STYLE[item.status];
          return <button key={item.id} data-device-id={item.id} aria-pressed={selected.includes(item.id)} onContextMenu={event => menu(event, selected.includes(item.id) ? selected : [item.id])} onPointerDown={event => beginDevice(event, item)} style={{ left: item.x - width / 2, top: item.y - height / 2, width, height, pointerEvents: 'auto', cursor: space ? 'grab' : mode === 'connect' ? 'crosshair' : 'move' }} className={`absolute flex flex-col items-center justify-center gap-1 rounded p-2 border ${selected.includes(item.id) || source === item.id ? 'border-blue-500 bg-blue-50/95 ring-1 ring-blue-300' : 'border-transparent bg-white/85'} ${item.kind === 'rectangle' ? 'border-neutral-400 bg-transparent' : ''}`}>
            <span className={item.kind === 'vm' ? 'text-blue-500' : 'text-cyan-600'}>{item.kind === 'line' || item.kind === 'dashed' ? <span className={`block w-20 border-t-2 border-neutral-500 ${item.kind === 'dashed' ? 'border-dashed' : ''}`} /> : item.kind !== 'text' && <Icon size={30} strokeWidth={1.4} />}</span>
            <span className="text-[11px] w-full truncate" title={item.name}>{item.name}</span>
            {item.kind === 'vm' && <span className={`text-[10px] flex gap-1 items-center px-1.5 py-0.5 rounded ${styles.badge}`}><StatusIcon size={11} className={item.status === '正在初始化' ? 'animate-spin' : ''} />{item.status}</span>}
          </button>;
        })}
        {marquee && <div className="absolute bg-blue-100/40 border border-blue-400 pointer-events-none" style={{ left: marquee.x, top: marquee.y, width: marquee.w, height: marquee.h }} />}
      </div>
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] text-neutral-500 bg-white/95 border border-neutral-200 rounded px-2 py-1.5 pointer-events-none"><Hand size={12} />空格 + 左键平移 · Ctrl + 滚轮缩放 · 拖拽框选 · Shift 多选</div>
    </div>
  </main>;
}
