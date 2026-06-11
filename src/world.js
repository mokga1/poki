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
    distanceSinceCoin: 0,
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

  for (const c of world.coins) {
    c.position.z += dz;
    c.rotation.y += dt * 4;
  }
  world.coins = world.coins.filter(c => {
    if (c.position.z > DESPAWN_Z || !c.visible) {
      world.scene.remove(c);
      return false;
    }
    return true;
  });

  world.distanceSinceCoin += dz;
  if (world.distanceSinceCoin >= 6) {
    world.distanceSinceCoin = 0;
    const lane = Math.floor(Math.random() * 3);
    const count = 1 + Math.floor(Math.random() * 6);
    for (let i = 0; i < count; i++) {
      const coin = makeCoin(lane, SPAWN_DISTANCE - i * 1.5);
      world.coins.push(coin);
      world.scene.add(coin);
    }
  }

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

    // 정지 기차의 절반 정도는 지붕 위에 코인을 얹는다.
    // 정지 기차와 코인은 같은 속도로 흐르므로 위치가 계속 맞는다.
    if (obstacle.userData.type === 'static_train' && Math.random() < 0.5) {
      for (let i = -1; i <= 1; i++) {
        const coin = makeCoin(lane, SPAWN_DISTANCE + i * 2, TRAIN_HEIGHT + 0.8);
        world.coins.push(coin);
        world.scene.add(coin);
      }
    }
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
  // y 0.9~1.2 구간: 서면 부딪히고, 슬라이드(높이 0.8)와 점프 둘 다로 통과 가능.
  // 슬라이드 머리(0.8)와 간판 아래면 사이에 0.1 여유를 둬서 부동소수점 경계 문제를 피한다.
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.3, 0.4),
    new THREE.MeshLambertMaterial({ color: 0x4488ff }),
  );
  mesh.position.set((lane - 1) * LANE_WIDTH, 1.05, SPAWN_DISTANCE);
  mesh.userData = { type: 'sign', lane, width: 1.8, height: 0.3, depth: 0.4 };
  return mesh;
}

function makeCoin(lane, z, y = 0.8) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 12, 12),
    new THREE.MeshLambertMaterial({ color: 0xffd700, emissive: 0x665500 }),
  );
  mesh.position.set((lane - 1) * LANE_WIDTH, y, z);
  mesh.userData = { type: 'coin', lane };
  return mesh;
}

const TRAIN_HALF_DEPTH = 3;
const TRAIN_HEIGHT = 2;
const STAIRS_DEPTH = 1.5;

// 특정 z 위치에서 기차 표면(지붕/계단 경사)의 높이.
// 몸체 구간은 지붕 높이 2, 계단 구간은 0→2로 올라가는 경사, 그 외는 0.
// 지붕 구간을 꼬리쪽으로 0.4 연장: 플레이어(두께 0.3)가 몸체 충돌 범위를
// 완전히 벗어난 뒤에 떨어지기 시작해야 낙하 중 꼬리에 부딪히지 않는다.
export function trainSurfaceHeight(train, worldZ) {
  const local = worldZ - train.position.z;
  if (local >= -(TRAIN_HALF_DEPTH + 0.4) && local <= TRAIN_HALF_DEPTH) return TRAIN_HEIGHT;
  if (local > TRAIN_HALF_DEPTH && local <= TRAIN_HALF_DEPTH + STAIRS_DEPTH) {
    return TRAIN_HEIGHT * (TRAIN_HALF_DEPTH + STAIRS_DEPTH - local) / STAIRS_DEPTH;
  }
  return 0;
}

// 플레이어 발밑 지지 높이. x 허용 범위 1.1은 충돌 판정(몸체 0.8 + 플레이어 0.3)과
// 일치시켜서, 지붕 위에서 차선을 바꿀 때 몸체와 겹친 채 떨어지는 일이 없게 한다.
export function getSupportHeight(world, x, z) {
  let h = 0;
  for (const o of world.obstacles) {
    if (o.userData.type !== 'static_train') continue;
    if (Math.abs(o.position.x - x) > 1.1) continue;
    h = Math.max(h, trainSurfaceHeight(o, z));
  }
  return h;
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
