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
