import * as THREE from 'three';

export const LANE_WIDTH = 2;
export const PLAYER_HEIGHT = 1.6;

export function createPlayer() {
  const group = new THREE.Group();

  const skin = new THREE.MeshLambertMaterial({ color: 0xffd1a8 });
  const shirt = new THREE.MeshLambertMaterial({ color: 0xff69b4 });
  const pants = new THREE.MeshLambertMaterial({ color: 0x8a2be2 });

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), skin);
  head.position.y = 1.4;
  group.add(head);

  const ponytail = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.4, 0.15), shirt);
  ponytail.position.set(0, 1.3, -0.25);
  group.add(ponytail);

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.3), shirt);
  torso.position.y = 0.9;
  group.add(torso);

  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.12), skin);
  armL.position.set(-0.32, 0.9, 0);
  armL.name = 'armL';
  group.add(armL);

  const armR = armL.clone();
  armR.position.x = 0.32;
  armR.name = 'armR';
  group.add(armR);

  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.6, 0.18), pants);
  legL.position.set(-0.12, 0.3, 0);
  legL.name = 'legL';
  group.add(legL);

  const legR = legL.clone();
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

const LANE_SWITCH_SPEED = 10;
const JUMP_DURATION = 0.6;
const JUMP_HEIGHT = 2;

export function updatePlayer(player, input, dt) {
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
      player.mesh.position.y = 0;
    } else {
      player.mesh.position.y = JUMP_HEIGHT * 4 * t * (1 - t);
    }
  }

  const wantSlide = input.isPressed('ArrowDown') && !player.jumping;
  if (wantSlide !== player.sliding) {
    player.sliding = wantSlide;
    player.mesh.scale.y = wantSlide ? 0.5 : 1;
    player.mesh.position.y = wantSlide ? 0 : player.mesh.position.y;
  }
}
