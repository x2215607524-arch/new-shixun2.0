import { uniqueDeviceName } from './topologyGeometry';

export type Kind = 'vm' | 'switch' | 'bridge' | 'text' | 'rectangle' | 'line' | 'dashed';
export const NODE_STATUSES = ['未初始化', '关机', '启动异常', '正在运行', '排队初始化', '正在初始化', '排队删除'] as const;
export type NodeStatus = typeof NODE_STATUSES[number];
export type Device = { id: string; name: string; kind: Kind; x: number; y: number; bridge: string; status: NodeStatus; image: string; ports?: string[] };
export type Link = { id: string; from: string; to: string; fromPort?: string; toPort?: string };
export type Topology = { devices: Device[]; links: Link[]; version?: number };
export const STATUS_STYLE: Record<NodeStatus, { dot: string; badge: string }> = {
  未初始化: { dot: 'bg-neutral-400', badge: 'text-neutral-500 bg-neutral-100' },
  关机: { dot: 'bg-slate-500', badge: 'text-slate-600 bg-slate-100' },
  启动异常: { dot: 'bg-red-500', badge: 'text-red-600 bg-red-50' },
  正在运行: { dot: 'bg-emerald-500', badge: 'text-emerald-600 bg-emerald-50' },
  排队初始化: { dot: 'bg-amber-500', badge: 'text-amber-700 bg-amber-50' },
  正在初始化: { dot: 'bg-blue-500 animate-pulse', badge: 'text-blue-600 bg-blue-50' },
  排队删除: { dot: 'bg-rose-500', badge: 'text-rose-600 bg-rose-50' },
};

export function portsOf(device: Device): string[] {
  return device.ports || Array.from({ length: device.kind === 'vm' ? 4 : device.kind === 'switch' ? 8 : device.kind === 'bridge' ? 1 : 0 }, (_, index) => `eth${index}`);
}
export function freePorts(topology: Topology, id: string): string[] {
  const device = topology.devices.find(item => item.id === id);
  if (!device) return [];
  const used = new Set(topology.links.flatMap(link => [link.from === id ? link.fromPort : undefined, link.to === id ? link.toPort : undefined]));
  return portsOf(device).filter(port => !used.has(port));
}
export function connectPorts(topology: Topology, link: Link): Topology {
  if (link.from === link.to || !link.fromPort || !link.toPort || !freePorts(topology, link.from).includes(link.fromPort) || !freePorts(topology, link.to).includes(link.toPort)) return topology;
  return { ...topology, links: [...topology.links, link] };
}
export function assignLegacyPorts(topology: Topology): Topology {
  let result = { ...topology, links: [] as Link[] };
  for (const link of topology.links) {
    const fromPort = link.fromPort || freePorts(result, link.from)[0];
    const toPort = link.toPort || freePorts(result, link.to)[0];
    result = connectPorts(result, { ...link, fromPort, toPort });
  }
  return result;
}

export function withStatusExamples(topology: Topology): Topology {
  const devices = [...topology.devices];
  for (const [index, status] of NODE_STATUSES.entries()) {
    if (devices.some(item => item.kind === 'vm' && item.status === status)) continue;
    const x = 120 + index % 4 * 190;
    let y = 160 + Math.floor(index / 4) * 210;
    while (devices.some(item => Math.abs(item.x - x) < 120 && Math.abs(item.y - y) < 100)) y += 110;
    devices.push({ id: `status-${crypto.randomUUID()}`, name: uniqueDeviceName('Ubuntu', devices.map(item => item.name)), kind: 'vm', x, y, bridge: 'vmbr0', status, image: 'Ubuntu 22.04' });
  }
  return { ...topology, devices, version: 2 };
}

export function initialTopology(): Topology {
  const topology = withStatusExamples({ devices: [], links: [] });
  topology.devices.push({ id: 'sw1', name: '交换机0a1b', kind: 'switch', x: 690, y: 370, bridge: 'vmbr0', status: '正在运行', image: '' });
  topology.links = [
    { id: 'l1', from: topology.devices[0].id, to: 'sw1' },
    { id: 'l2', from: topology.devices[3].id, to: 'sw1' },
  ];
  return assignLegacyPorts(topology);
}

export function readTopology(value: unknown): Topology | null {
  if (!value || typeof value !== 'object') return null;
  const saved = value as Topology;
  if (!Array.isArray(saved.devices) || !Array.isArray(saved.links)) return null;
  const names = new Set<string>();
  const ids = new Set<string>();
  const devices: Device[] = [];
  for (const item of saved.devices) {
    if (!item || typeof item.id !== 'string' || ids.has(item.id) || typeof item.name !== 'string' || !Number.isFinite(item.x) || !Number.isFinite(item.y)) continue;
    if (!['vm', 'switch', 'bridge', 'text', 'rectangle', 'line', 'dashed'].includes(item.kind)) continue;
    const legacyStatus = String(item.status);
    const status = legacyStatus === '已关机' ? '关机' : legacyStatus === '运行中' ? '正在运行' : NODE_STATUSES.includes(item.status) ? item.status : '未初始化';
    const name = names.has(item.name) ? uniqueDeviceName(item.name, names) : item.name;
    names.add(name); ids.add(item.id); devices.push({ ...item, name, status });
  }
  return assignLegacyPorts({ devices, version: saved.version, links: saved.links.filter(link => link && typeof link.id === 'string' && ids.has(link.from) && ids.has(link.to)) });
}
