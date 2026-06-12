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
    powerups: [],
    speed: 12,
    distanceSinceSpawn: 0,
    distanceSinceCoin: 0,
    distanceSincePowerup: 0,
  };
}

const GRASS_WIDTH = 9;
const BLOSSOM_COLORS = [0xf8a8cc, 0xffb7d9, 0xff8fc0];
const FLOWER_COLORS = [0xff7eb6, 0xffffff, 0xffe066, 0xc59fff];
const BUILDING_COLORS = [0xaee8d8, 0xffd3a8, 0xd9c2f0, 0xa8d8ff, 0xffc2cc];

function makeGroundSegment(index) {
  const group = new THREE.Group();
  group.position.z = -index * SEGMENT_LENGTH + 10;

  const color = index % 2 === 0 ? 0xc9a6e8 : 0xbf99e2;
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(TRACK_WIDTH, SEGMENT_LENGTH),
    new THREE.MeshLambertMaterial({ color }),
  );
  ground.rotation.x = -Math.PI / 2;
  group.add(ground);

  for (let i = -1; i <= 1; i += 2) {
    const line = new THREE.Mesh(
      new THREE.PlaneGeometry(0.1, SEGMENT_LENGTH),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    );
    line.rotation.x = -Math.PI / 2;
    line.position.set(i * LANE_WIDTH / 2, 0.01, 0);
    group.add(line);
  }

  // 길 양옆 잔디밭 + 장식 (세그먼트와 함께 재활용되어 같이 흘러간다)
  for (let side = -1; side <= 1; side += 2) {
    const grass = new THREE.Mesh(
      new THREE.PlaneGeometry(GRASS_WIDTH, SEGMENT_LENGTH),
      new THREE.MeshLambertMaterial({ color: index % 2 === 0 ? 0xa5dba5 : 0x99d499 }),
    );
    grass.rotation.x = -Math.PI / 2;
    grass.position.set(side * (TRACK_WIDTH / 2 + GRASS_WIDTH / 2), -0.01, 0);
    group.add(grass);

    addSideDecorations(group, side);
  }
  return group;
}

function addSideDecorations(group, side) {
  const treeCount = 1 + Math.floor(Math.random() * 2);
  for (let i = 0; i < treeCount; i++) {
    const tree = makeBlossomTree();
    tree.position.set(
      side * (4.5 + Math.random() * 4),
      0,
      -SEGMENT_LENGTH / 2 + Math.random() * SEGMENT_LENGTH,
    );
    group.add(tree);
  }

  const flowerCount = 3 + Math.floor(Math.random() * 4);
  for (let i = 0; i < flowerCount; i++) {
    const flower = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 6, 6),
      new THREE.MeshLambertMaterial({
        color: FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)],
      }),
    );
    flower.position.set(
      side * (3.6 + Math.random() * 5),
      0.12,
      -SEGMENT_LENGTH / 2 + Math.random() * SEGMENT_LENGTH,
    );
    group.add(flower);
  }

  if (Math.random() < 0.5) {
    const h = 3 + Math.random() * 4;
    const building = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, h, 2.5),
      new THREE.MeshLambertMaterial({
        color: BUILDING_COLORS[Math.floor(Math.random() * BUILDING_COLORS.length)],
      }),
    );
    building.position.set(
      side * (10 + Math.random() * 2),
      h / 2,
      -SEGMENT_LENGTH / 2 + Math.random() * SEGMENT_LENGTH,
    );
    group.add(building);
  }
}

function makeBlossomTree() {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.18, 1, 8),
    new THREE.MeshLambertMaterial({ color: 0x8d6e63 }),
  );
  trunk.position.y = 0.5;
  tree.add(trunk);

  const color = BLOSSOM_COLORS[Math.floor(Math.random() * BLOSSOM_COLORS.length)];
  const blossomMat = new THREE.MeshLambertMaterial({ color });
  const lumps = [
    [0, 1.5, 0, 0.7], [-0.5, 1.2, 0.1, 0.45], [0.5, 1.25, -0.1, 0.45], [0, 1.1, 0.45, 0.4],
  ];
  for (const [x, y, z, r] of lumps) {
    const lump = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 8), blossomMat);
    lump.position.set(x, y, z);
    tree.add(lump);
  }
  return tree;
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

  for (const p of world.powerups) {
    p.position.z += dz;
    p.rotation.y += dt * 2.5;
  }
  world.powerups = world.powerups.filter(p => {
    if (p.position.z > DESPAWN_Z || !p.visible) {
      world.scene.remove(p);
      return false;
    }
    return true;
  });

  world.distanceSincePowerup += dz;
  if (world.distanceSincePowerup >= 140) {
    world.distanceSincePowerup = 0;
    const kinds = ['magnet', 'star', 'double'];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    const powerup = makePowerup(kind, Math.floor(Math.random() * 3));
    world.powerups.push(powerup);
    world.scene.add(powerup);
  }

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

// 기차 몸체 + 지붕 + 창문 + 바퀴 공통 조립 (충돌 박스 1.6 x 2 x 6 과 동일 부피)
function makeTrainBody(bodyColor, windowColor) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 2, 6),
    new THREE.MeshLambertMaterial({ color: bodyColor }),
  );
  body.position.y = 1;
  group.add(body);

  // 지붕 판: 윗면이 정확히 충돌 높이(2)와 같아서 지붕 위를 달릴 때 발이 안 묻힌다
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.15, 6.2),
    new THREE.MeshLambertMaterial({ color: 0xffffff }),
  );
  roof.position.y = 2 - 0.075;
  group.add(roof);

  const windowMat = new THREE.MeshLambertMaterial({ color: windowColor });
  for (let side = -1; side <= 1; side += 2) {
    for (const z of [-1.8, 0, 1.8]) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.7, 1), windowMat);
      win.position.set(side * 0.81, 1.3, z);
      group.add(win);
    }
  }

  const wheelMat = new THREE.MeshLambertMaterial({ color: 0x4a4a4a });
  for (let side = -1; side <= 1; side += 2) {
    for (const z of [-2, -0.7, 0.7, 2]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.15, 12), wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(side * 0.75, 0.3, z);
      group.add(wheel);
    }
  }
  return group;
}

export function makeMovingTrain(lane) {
  const group = makeTrainBody(0xff6b6b, 0x5a2a2a);

  // 플레이어 쪽(+z)을 바라보는 화난 얼굴 — "위험!" 신호
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
  for (let side = -1; side <= 1; side += 2) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), eyeMat);
    eye.position.set(side * 0.4, 1.45, 3.02);
    group.add(eye);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), pupilMat);
    pupil.position.set(side * 0.4, 1.45, 3.18);
    group.add(pupil);
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.07, 0.05), pupilMat);
    brow.position.set(side * 0.4, 1.72, 3.05);
    brow.rotation.z = side * -0.45;
    group.add(brow);
  }
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.05), pupilMat);
  mouth.position.set(0, 1.0, 3.05);
  group.add(mouth);

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
  // 점프 전용 울타리: 슬라이드(높이 0.8)로는 못 지나가고 점프로만 넘는다.
  // 분홍-흰색 가로 줄무늬 3단 (전체 부피는 충돌 박스 1.6 x 0.6 x 0.6 그대로)
  const group = new THREE.Group();
  const stripeColors = [0xff7eb6, 0xffffff, 0xff7eb6];
  stripeColors.forEach((color, i) => {
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.2, 0.6),
      new THREE.MeshLambertMaterial({ color }),
    );
    stripe.position.y = 0.1 + i * 0.2;
    group.add(stripe);
  });

  // 앞면에 ▲ 화살표: "점프로 넘어요"
  const icon = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.5),
    new THREE.MeshBasicMaterial({ map: makeIconTexture('▲', '#e0408a') }),
  );
  icon.position.set(0, 0.3, 0.31);
  group.add(icon);

  group.position.set((lane - 1) * LANE_WIDTH, 0, SPAWN_DISTANCE);
  group.userData = { type: 'barricade', lane, width: 1.6, height: 0.6, depth: 0.6 };
  return group;
}

// 장애물 통과 방법 안내용 화살표 아이콘 텍스처 (▲ = 점프, ▼ = 슬라이드)
function makeIconTexture(symbol, bg) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const c2d = canvas.getContext('2d');
  c2d.fillStyle = bg;
  c2d.fillRect(0, 0, 64, 64);
  c2d.font = 'bold 44px sans-serif';
  c2d.textAlign = 'center';
  c2d.textBaseline = 'middle';
  c2d.fillStyle = '#ffffff';
  c2d.fillText(symbol, 32, 36);
  return new THREE.CanvasTexture(canvas);
}

export function makeSign(lane) {
  // 슬라이드 전용 관문: 아래 틈(y 0~0.9)으로만 지나갈 수 있다.
  // 막는 부분이 y 0.9~2.5로 점프 최고 높이(2)보다 높아서 점프로는 못 넘는다.
  // 슬라이드 머리(0.8)와 아래면(0.9) 사이 0.1 여유로 부동소수점 경계 문제도 없다.
  // 충돌 박스: 1.8 x 1.6 x 0.4, 중심 y 1.7 (게이트 기둥은 장식)
  const group = new THREE.Group();

  // 통과 기준선이 되는 무지개 아래 막대 (world y 0.9~1.2 = local -0.8~-0.5)
  const stripeColors = [0xff5e5e, 0xffa552, 0xffe04d, 0x7ed957, 0x5ec8ff, 0xb86aff];
  stripeColors.forEach((color, i) => {
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.4),
      new THREE.MeshLambertMaterial({ color }),
    );
    stripe.position.set(-0.75 + i * 0.3, -0.65, 0);
    group.add(stripe);
  });

  // 위쪽을 막는 패널 (world y 1.2~2.5 = local -0.5~0.8)
  const panel = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.3, 0.3),
    new THREE.MeshLambertMaterial({ color: 0xc59fff }),
  );
  panel.position.set(0, 0.15, 0);
  group.add(panel);

  // 패널 앞면에 ▼ 화살표: "슬라이드로 지나가요"
  const icon = new THREE.Mesh(
    new THREE.PlaneGeometry(0.8, 0.8),
    new THREE.MeshBasicMaterial({ map: makeIconTexture('▼', '#7a5ad6') }),
  );
  icon.position.set(0, 0.15, 0.16);
  group.add(icon);

  const postMat = new THREE.MeshLambertMaterial({ color: 0xcccccc });
  for (let side = -1; side <= 1; side += 2) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.5, 0.08), postMat);
    post.position.set(side * 0.86, -0.45, 0); // 지면(0)부터 꼭대기(2.5)까지
    group.add(post);
  }

  group.position.set((lane - 1) * LANE_WIDTH, 1.7, SPAWN_DISTANCE);
  group.userData = { type: 'sign', lane, width: 1.8, height: 1.6, depth: 0.4 };
  return group;
}

const POWERUP_STYLE = {
  magnet: { bg: '#ff8a9e', label: '🧲' },
  star:   { bg: '#ffe066', label: '⭐' },
  double: { bg: '#c59fff', label: 'x2' },
};

function makePowerup(kind, lane) {
  // 종류별 아이콘을 캔버스에 그려 상자 텍스처로 사용 (외부 이미지 불필요)
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const c2d = canvas.getContext('2d');
  const style = POWERUP_STYLE[kind];
  c2d.fillStyle = style.bg;
  c2d.fillRect(0, 0, 64, 64);
  c2d.font = 'bold 36px sans-serif';
  c2d.textAlign = 'center';
  c2d.textBaseline = 'middle';
  c2d.fillStyle = '#3a3a3a';
  c2d.fillText(style.label, 32, 35);

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.55, 0.55),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) }),
  );
  mesh.position.set((lane - 1) * LANE_WIDTH, 1.0, SPAWN_DISTANCE);
  mesh.userData = { type: 'powerup', kind, lane };
  return mesh;
}

function makeCoin(lane, z, y = 0.8) {
  // 세로로 세운 금화 디스크. 바깥 그룹이 y축으로 돌면 동전이 빙글빙글 도는 모양이 된다.
  const group = new THREE.Group();
  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 0.08, 20),
    new THREE.MeshLambertMaterial({ color: 0xffd700, emissive: 0x997700 }),
  );
  disc.rotation.x = Math.PI / 2;
  group.add(disc);
  group.position.set((lane - 1) * LANE_WIDTH, y, z);
  group.userData = { type: 'coin', lane };
  return group;
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
  const group = makeTrainBody(0x8fd4f0, 0xffffff);

  // 황금색 3단 계단 (실제 올라가는 경사는 trainSurfaceHeight 가 처리, 이건 모양)
  const stepMat = new THREE.MeshLambertMaterial({ color: 0xffc94d });
  for (let i = 0; i < 3; i++) {
    const h = 0.5 + i * 0.5;
    const step = new THREE.Mesh(new THREE.BoxGeometry(1.6, h, 0.5), stepMat);
    step.position.set(0, h / 2, 4.25 - i * 0.5);
    group.add(step);
  }

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
