import * as THREE from 'three';

export const LANE_WIDTH = 2;
export const PLAYER_HEIGHT = 1.6;

export function createPlayer() {
  const group = new THREE.Group();

  const skin = new THREE.MeshLambertMaterial({ color: 0xffd1a8 });
  const hair = new THREE.MeshLambertMaterial({ color: 0xff8fc0 });
  const dress = new THREE.MeshLambertMaterial({ color: 0xff69b4 });
  const accent = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const shoeMat = new THREE.MeshLambertMaterial({ color: 0xe0408a });

  // 큰 머리 = 치비(2등신) 느낌
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), skin);
  head.position.y = 1.38;
  group.add(head);

  // 머리카락: 머리를 덮는 캡 + 흔들리는 포니테일 (이름으로 찾아 애니메이션)
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 16), hair);
  hairCap.position.set(0, 1.44, -0.06);
  group.add(hairCap);

  const ponytail = new THREE.Group();
  ponytail.name = 'ponytail';
  ponytail.position.set(0, 1.5, -0.3);
  const tailSizes = [[0, -0.02, -0.06, 0.14], [0, -0.24, -0.13, 0.12], [0, -0.46, -0.18, 0.1]];
  for (const [x, y, z, r] of tailSizes) {
    const lump = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 10), hair);
    lump.position.set(x, y, z);
    ponytail.add(lump);
  }

  // 포니테일 묶는 자리에 큰 리본 🎀 (가운데 매듭 + 양쪽 날개)
  const bowMat = new THREE.MeshLambertMaterial({ color: 0xff4f9e });
  const bowKnot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), bowMat);
  bowKnot.position.set(0, 0.08, -0.02);
  ponytail.add(bowKnot);
  for (let side = -1; side <= 1; side += 2) {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.06), bowMat);
    wing.position.set(side * 0.13, 0.12, -0.02);
    wing.rotation.z = side * 0.5;
    ponytail.add(wing);
  }
  group.add(ponytail);

  // 원피스: 몸통 + 퍼지는 치마
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.3), dress);
  torso.position.y = 1.0;
  group.add(torso);

  const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.48, 0.35, 12), dress);
  skirt.position.y = 0.62;
  group.add(skirt);

  // 치마 밑단 흰 프릴
  const frill = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.52, 0.08, 12), accent);
  frill.position.y = 0.45;
  group.add(frill);

  // 팔: 살구색 + 어깨 퍼프 소매 (팔에 붙여서 같이 흔들리게)
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.12), skin);
  armL.position.set(-0.32, 0.9, 0);
  armL.name = 'armL';
  const sleeveL = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), dress);
  sleeveL.position.set(0, 0.22, 0);
  armL.add(sleeveL);
  group.add(armL);

  const armR = armL.clone(true);
  armR.position.x = 0.32;
  armR.name = 'armR';
  group.add(armR);

  // 다리: 살구색 + 분홍 신발 (다리에 붙여서 같이 흔들리게)
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.6, 0.18), skin);
  legL.position.set(-0.12, 0.3, 0);
  legL.name = 'legL';
  const sockL = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.14, 0.19), accent);
  sockL.position.set(0, -0.16, 0);
  legL.add(sockL);
  const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.28), shoeMat);
  shoeL.position.set(0, -0.27, 0.05);
  legL.add(shoeL);
  group.add(legL);

  const legR = legL.clone(true);
  legR.position.x = 0.12;
  legR.name = 'legR';
  group.add(legR);

  return {
    mesh: group,
    lane: 1,
    jumping: false,
    jumpTime: 0,
    sliding: false,
  };
}

export function getPlayerBox(player) {
  const x = player.mesh.position.x;
  const y = player.mesh.position.y;
  const z = player.mesh.position.z;
  const h = player.sliding ? 0.8 : 1.6;
  return {
    minX: x - 0.3, maxX: x + 0.3,
    minY: y,       maxY: y + h,
    minZ: z - 0.3, maxZ: z + 0.3,
  };
}

const LANE_SWITCH_SPEED = 10;
const JUMP_DURATION = 0.6;
const JUMP_HEIGHT = 2;
const FALL_SPEED = 10;

// groundY: 발밑 지지 높이 (평지 0, 기차 지붕 2, 계단 경사는 그 사이)
export function updatePlayer(player, input, dt, groundY = 0) {
  if (input.wasJustPressed('ArrowLeft') && player.lane > 0) {
    player.lane -= 1;
  }
  if (input.wasJustPressed('ArrowRight') && player.lane < 2) {
    player.lane += 1;
  }

  const targetX = (player.lane - 1) * LANE_WIDTH;
  const dx = targetX - player.mesh.position.x;
  const step = LANE_SWITCH_SPEED * dt;
  if (Math.abs(dx) < step) {
    player.mesh.position.x = targetX;
  } else {
    player.mesh.position.x += Math.sign(dx) * step;
  }

  if (input.wasJustPressed('ArrowUp') && !player.jumping) {
    player.jumping = true;
    player.jumpTime = 0;
  }

  if (player.jumping) {
    player.jumpTime += dt;
    const t = player.jumpTime / JUMP_DURATION;
    if (t >= 1) {
      player.jumping = false;
      player.mesh.position.y = groundY;
    } else {
      player.mesh.position.y = groundY + JUMP_HEIGHT * 4 * t * (1 - t);
    }
  } else {
    const y = player.mesh.position.y;
    if (y > groundY) {
      // 지지면이 사라지면 (기차 끝) 아래로 떨어진다
      player.mesh.position.y = Math.max(groundY, y - FALL_SPEED * dt);
    } else {
      // 계단 경사를 따라 올라가거나 지면에 붙는다
      player.mesh.position.y = groundY;
    }
  }

  const wantSlide = input.isPressed('ArrowDown') && !player.jumping;
  if (wantSlide !== player.sliding) {
    player.sliding = wantSlide;
    player.mesh.scale.y = wantSlide ? 0.5 : 1;
  }

  if (!player.runTime) player.runTime = 0;
  player.runTime += dt * 8;
  const swing = Math.sin(player.runTime) * 0.4;
  const armL = player.mesh.getObjectByName('armL');
  const armR = player.mesh.getObjectByName('armR');
  const legL = player.mesh.getObjectByName('legL');
  const legR = player.mesh.getObjectByName('legR');
  if (armL) armL.rotation.x = swing;
  if (armR) armR.rotation.x = -swing;
  if (legL) legL.rotation.x = -swing;
  if (legR) legR.rotation.x = swing;

  // 포니테일은 절반 박자로 살랑살랑
  const ponytail = player.mesh.getObjectByName('ponytail');
  if (ponytail) {
    ponytail.rotation.x = 0.15 + Math.sin(player.runTime * 0.5) * 0.18;
    ponytail.rotation.z = Math.sin(player.runTime * 0.7) * 0.1;
  }
}
