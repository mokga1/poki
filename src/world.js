import * as THREE from 'three';

export const LANE_WIDTH = 2;
const TRACK_WIDTH = LANE_WIDTH * 3;
const SEGMENT_LENGTH = 20;
const NUM_SEGMENTS = 12;
const SPAWN_DISTANCE = -180;
const DESPAWN_Z = 15;

export function createWorld(scene) {
  const segments = [];
  for (let i = 0; i < NUM_SEGMENTS; i++) {
    const seg = makeGroundSegment(i);
    segments.push(seg);
    scene.add(seg);
  }
  return {
    scene,
    segments,
    obstacles: [],
    coins: [],
    speed: 12,
    distanceSinceSpawn: 0,
  };
}

function makeGroundSegment(index) {
  const group = new THREE.Group();
  group.position.z = -index * SEGMENT_LENGTH + 10;

  const color = index % 2 === 0 ? 0x555555 : 0x4a4a4a;
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(TRACK_WIDTH, SEGMENT_LENGTH),
    new THREE.MeshLambertMaterial({ color }),
  );
  ground.rotation.x = -Math.PI / 2;
  group.add(ground);

  for (let i = -1; i <= 1; i += 2) {
    const line = new THREE.Mesh(
      new THREE.PlaneGeometry(0.1, SEGMENT_LENGTH),
      new THREE.MeshBasicMaterial({ color: 0xffff00 }),
    );
    line.rotation.x = -Math.PI / 2;
    line.position.set(i * LANE_WIDTH / 2, 0.01, 0);
    group.add(line);
  }
  return group;
}

export function updateWorld(world, dt) {
  const dz = world.speed * dt;

  for (const seg of world.segments) {
    seg.position.z += dz;
    if (seg.position.z > SEGMENT_LENGTH + 10) {
      const minZ = Math.min(...world.segments.map(s => s.position.z));
      seg.position.z = minZ - SEGMENT_LENGTH;
    }
  }

  for (const o of world.obstacles) {
    let move = dz;
    if (o.userData.type === 'moving_train') {
      move += o.userData.extraSpeed * dt;
    }
    o.position.z += move;
  }
  world.obstacles = world.obstacles.filter(o => {
    if (o.position.z > DESPAWN_Z) {
      world.scene.remove(o);
      return false;
    }
    return true;
  });

  world.distanceSinceSpawn += dz;
  if (world.distanceSinceSpawn >= 25) {
    world.distanceSinceSpawn = 0;
    const lane = Math.floor(Math.random() * 3);
    const roll = Math.random();
    let obstacle;
    if (roll < 0.35) obstacle = makeStaticTrain(lane);
    else if (roll < 0.6) obstacle = makeMovingTrain(lane);
    else if (roll < 0.8) obstacle = makeBarricade(lane);
    else obstacle = makeSign(lane);
    world.obstacles.push(obstacle);
    world.scene.add(obstacle);
  }
}

export function makeMovingTrain(lane) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 2, 6),
    new THREE.MeshLambertMaterial({ color: 0xcc2222 }),
  );
  body.position.y = 1;
  group.add(body);

  group.position.x = (lane - 1) * LANE_WIDTH;
  group.position.z = SPAWN_DISTANCE;

  group.userData = {
    type: 'moving_train',
    lane,
    width: 1.6, height: 2, depth: 6,
    extraSpeed: 4,
  };
  return group;
}

export function makeBarricade(lane) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.6, 0.6),
    new THREE.MeshLambertMaterial({ color: 0xff7700 }),
  );
  mesh.position.set((lane - 1) * LANE_WIDTH, 0.3, SPAWN_DISTANCE);
  mesh.userData = { type: 'barricade', lane, width: 1.6, height: 0.6, depth: 0.6 };
  return mesh;
}

export function makeSign(lane) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.4, 0.4),
    new THREE.MeshLambertMaterial({ color: 0x4488ff }),
  );
  mesh.position.set((lane - 1) * LANE_WIDTH, 2, SPAWN_DISTANCE);
  mesh.userData = { type: 'sign', lane, width: 1.8, height: 0.4, depth: 0.4 };
  return mesh;
}

export function makeStaticTrain(lane) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 2, 6),
    new THREE.MeshLambertMaterial({ color: 0x888888 }),
  );
  body.position.y = 1;
  group.add(body);

  const stairs = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 1, 1.5),
    new THREE.MeshLambertMaterial({ color: 0xffaa00 }),
  );
  stairs.position.set(0, 0.5, 3 + 0.75);
  group.add(stairs);

  group.position.x = (lane - 1) * LANE_WIDTH;
  group.position.z = SPAWN_DISTANCE;

  group.userData = {
    type: 'static_train',
    lane,
    width: 1.6, height: 2, depth: 6,
    stairsDepth: 1.5,
  };
  return group;
}
