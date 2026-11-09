export type Bounds = { left: number; right: number; top: number; bottom: number };
export type Position = { id: string; x: number; y: number; width?: number; height?: number };
export type Guide = { x1: number; y1: number; x2: number; y2: number };
export const WORLD = { width: 2400, height: 1600 };

export function boundsOf(nodes: Position[]): Bounds {
  return {
    left: Math.min(...nodes.map(node => node.x - (node.width || 112) / 2)),
    right: Math.max(...nodes.map(node => node.x + (node.width || 112) / 2)),
    top: Math.min(...nodes.map(node => node.y - (node.height || 92) / 2)),
    bottom: Math.max(...nodes.map(node => node.y + (node.height || 92) / 2)),
  };
}

export function snappedMovement(moving: Position[], stationary: Position[], dx: number, dy: number, zoom: number) {
  const b = boundsOf(moving);
  const threshold = 8 / zoom;
  let bestX = threshold + 1;
  let bestY = threshold + 1;
  let correctionX = 0;
  let correctionY = 0;
  let guideX: number | undefined;
  let guideY: number | undefined;
  const guides: Guide[] = [];
  for (const target of stationary) {
    const t = boundsOf([target]);
    const xs = [(b.left + b.right) / 2 + dx, b.left + dx, b.right + dx];
    const ys = [(b.top + b.bottom) / 2 + dy, b.top + dy, b.bottom + dy];
    for (const x of xs) for (const tx of [target.x, t.left, t.right, t.left - 24, t.right + 24]) {
      const difference = tx - x;
      if (Math.abs(difference) <= threshold && Math.abs(difference) < bestX) {
        bestX = Math.abs(difference); correctionX = difference; guideX = tx;
      }
    }
    for (const y of ys) for (const ty of [target.y, t.top, t.bottom, t.top - 24, t.bottom + 24]) {
      const difference = ty - y;
      if (Math.abs(difference) <= threshold && Math.abs(difference) < bestY) {
        bestY = Math.abs(difference); correctionY = difference; guideY = ty;
      }
    }
  }
  // Diagonal alignment uses the same screen-space tolerance as edge/centre snapping.
  if (guideX === undefined && guideY === undefined) {
    const x = (b.left + b.right) / 2 + dx;
    const y = (b.top + b.bottom) / 2 + dy;
    for (const target of stationary) {
      for (const slope of [-1, 1]) {
        const alignedY = target.y + slope * (x - target.x);
        const difference = alignedY - y;
        if (Math.abs(difference) <= threshold && Math.abs(difference) < bestY) {
          bestY = Math.abs(difference); correctionY = difference;
          guides.splice(0, guides.length, { x1: target.x, y1: target.y, x2: x, y2: alignedY });
        }
      }
    }
  }
  if (guideX !== undefined) guides.push({ x1: guideX, y1: 0, x2: guideX, y2: WORLD.height });
  if (guideY !== undefined) guides.push({ x1: 0, y1: guideY, x2: WORLD.width, y2: guideY });
  return {
    dx: Math.max(-b.left, Math.min(WORLD.width - b.right, dx + correctionX)),
    dy: Math.max(-b.top, Math.min(WORLD.height - b.bottom, dy + correctionY)),
    guides,
  };
}

export function uniqueDeviceName(template: string, names: Iterable<string>) {
  const used = new Set(names);
  const prefix = template.slice(0, 124);
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
  const values = new Uint32Array(4);
  for (let attempt = 0; attempt < 100; attempt++) {
    crypto.getRandomValues(values);
    const suffix = `${values[0] % 10}${alphabet[10 + values[1] % 26]}${alphabet[values[2] % 36]}${alphabet[values[3] % 36]}`;
    if (!used.has(prefix + suffix)) return prefix + suffix;
  }
  // A deterministic fallback also guarantees termination if random output repeats.
  for (let number = 0; number < 36 ** 4; number++) {
    const suffix = number.toString(36).padStart(4, '0');
    if (!/[0-9]/.test(suffix) || !/[a-z]/.test(suffix)) continue;
    const candidate = prefix + suffix;
    if (!used.has(candidate)) return candidate;
  }
  throw new Error('该模板的设备名称已用尽，请更换模板名称');
}

export function zoomAtPoint(camera: { x: number; y: number; zoom: number }, x: number, y: number, zoom: number) {
  const next = Math.max(.25, Math.min(2, zoom));
  return { zoom: next, x: x - (x - camera.x) * next / camera.zoom, y: y - (y - camera.y) * next / camera.zoom };
}
