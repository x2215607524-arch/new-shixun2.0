import test from 'node:test';
import assert from 'node:assert/strict';
import { snappedMovement, uniqueDeviceName, zoomAtPoint } from './topologyGeometry';
import { initialTopology, NODE_STATUSES, readTopology } from './topologyData';

test('zoom keeps the world point under the cursor fixed and respects limits', () => {
  const before = { x: -100, y: 50, zoom: .8 };
  const after = zoomAtPoint(before, 400, 300, 1.6);
  assert.equal((400 - after.x) / after.zoom, (400 - before.x) / before.zoom);
  assert.equal((300 - after.y) / after.zoom, (300 - before.y) / before.zoom);
  assert.equal(zoomAtPoint(before, 100, 100, 10).zoom, 2);
  assert.equal(zoomAtPoint(before, 100, 100, .01).zoom, .25);
});

test('centre and edge snapping respects screen-space tolerance', () => {
  const moving = [{ id: 'a', x: 200, y: 200 }];
  const target = [{ id: 'b', x: 500, y: 500 }];
  const snapped = snappedMovement(moving, target, 295, 0, 1);
  assert.equal(snapped.dx, 300);
  assert.ok(snapped.guides.some(guide => guide.x1 === 500 && guide.x2 === 500));
  // At 2x zoom, a five-world-unit gap is beyond the eight-pixel threshold.
  const unsnapped = snappedMovement(moving, target, 295, 0, 2);
  assert.equal(unsnapped.dx, 295);
});

test('diagonal snapping aligns device centres', () => {
  const result = snappedMovement([{ id: 'a', x: 200, y: 200 }], [{ id: 'b', x: 500, y: 500 }], 100, 106, 1);
  assert.equal(result.dy, 100);
  assert.ok(result.guides.some(guide => guide.x1 !== guide.x2 && guide.y1 !== guide.y2));
});

test('batch movement uses one delta and clamps the entire selection together', () => {
  const nodes = [{ id: 'a', x: 100, y: 100 }, { id: 'b', x: 300, y: 200 }];
  const result = snappedMovement(nodes, [], -1000, -1000, 1);
  assert.equal(result.dx, -44);
  assert.equal(result.dy, -54);
  assert.equal((nodes[1].x + result.dx) - (nodes[0].x + result.dx), 200);
  assert.equal((nodes[1].y + result.dy) - (nodes[0].y + result.dy), 100);
});

test('random names use four lowercase/digit characters and are unique', () => {
  const names = new Set<string>();
  for (let index = 0; index < 2000; index++) {
    const name = uniqueDeviceName('Ubuntu', names);
    assert.match(name, /^Ubuntu[0-9a-z]{4}$/);
    assert.match(name.slice(-4), /[0-9]/);
    assert.match(name.slice(-4), /[a-z]/);
    assert.ok(!names.has(name)); names.add(name);
  }
});

test('naming collision fallback terminates when randomness repeats', context => {
  context.mock.method(globalThis.crypto, 'getRandomValues', (array: Uint32Array) => array.fill(0));
  assert.equal(uniqueDeviceName('Ubuntu', ['Ubuntu0a00']), 'Ubuntu000a');
});

test('initial canvas includes all seven statuses with globally unique names', () => {
  const topology = initialTopology();
  assert.deepEqual(new Set(topology.devices.filter(node => node.kind === 'vm').map(node => node.status)), new Set(NODE_STATUSES));
  assert.equal(new Set(topology.devices.map(node => node.name)).size, topology.devices.length);
});

test('legacy data migration normalizes statuses and repairs duplicate names', () => {
  const topology = readTopology({ devices: [
    { id: 'a', name: 'R1', x: 100, y: 100, kind: 'vm', status: '已关机' },
    { id: 'b', name: 'R1', x: 300, y: 100, kind: 'vm', status: '运行中' },
  ], links: [{ id: 'bad', from: 'a', to: 'missing' }] });
  assert.ok(topology);
  assert.equal(topology.devices[0].status, '关机');
  assert.equal(topology.devices[1].status, '正在运行');
  assert.notEqual(topology.devices[0].name, topology.devices[1].name);
  assert.equal(topology.links.length, 0);
});
