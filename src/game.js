import * as THREE from 'three';
import { isPressed, wasJustPressed, clearJustPressed } from './input.js';
import { createPlayer, updatePlayer } from './player.js';
import { createWorld, updateWorld } from './world.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 4, 8);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(5, 10, 5);
scene.add(dir);

const world = createWorld(scene);

const player = createPlayer();
scene.add(player.mesh);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let lastTime = performance.now();

function loop() {
  requestAnimationFrame(loop);
  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  updateWorld(world, dt);
  updatePlayer(player, { wasJustPressed, isPressed }, dt);

  for (const c of world.coins) {
    if (!c.visible) continue;
    const dx = c.position.x - player.mesh.position.x;
    const dy = c.position.y - (player.mesh.position.y + 0.8);
    const dz = c.position.z - player.mesh.position.z;
    if (dx * dx + dy * dy + dz * dz < 0.8 * 0.8) {
      c.visible = false;
    }
  }

  clearJustPressed();
  renderer.render(scene, camera);
}
loop();
