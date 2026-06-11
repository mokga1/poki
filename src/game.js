import * as THREE from 'three';
import { isPressed, wasJustPressed, clearJustPressed } from './input.js';
import { createPlayer, updatePlayer, getPlayerBox } from './player.js';
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
let score = 0;
const scoreEl = document.getElementById('score');
let gameOver = false;
let elapsed = 0;
const BASE_SPEED = 12;
const MAX_SPEED = 24;
const gameOverEl = document.getElementById('gameover');
const finalScoreEl = document.getElementById('final-score');

function getObstacleBox(o) {
  const ud = o.userData;
  const x = o.position.x;
  const z = o.position.z;
  let minY = 0, maxY = ud.height;
  if (ud.type === 'sign') {
    minY = o.position.y - ud.height / 2;
    maxY = o.position.y + ud.height / 2;
  }
  return {
    minX: x - ud.width / 2, maxX: x + ud.width / 2,
    minY, maxY,
    minZ: z - ud.depth / 2, maxZ: z + ud.depth / 2,
  };
}

function boxOverlap(a, b) {
  return a.minX < b.maxX && a.maxX > b.minX
      && a.minY < b.maxY && a.maxY > b.minY
      && a.minZ < b.maxZ && a.maxZ > b.minZ;
}

function loop() {
  requestAnimationFrame(loop);
  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  if (!gameOver) {
    elapsed += dt;
    const t = Math.min(elapsed / 60, 1);
    world.speed = BASE_SPEED + (MAX_SPEED - BASE_SPEED) * t;
    score += dt;
    updateWorld(world, dt);
    updatePlayer(player, { wasJustPressed, isPressed }, dt);

    for (const c of world.coins) {
      if (!c.visible) continue;
      const dx = c.position.x - player.mesh.position.x;
      const dy = c.position.y - (player.mesh.position.y + 0.8);
      const dz = c.position.z - player.mesh.position.z;
      if (dx * dx + dy * dy + dz * dz < 0.8 * 0.8) {
        c.visible = false;
        score += 10;
      }
    }

    const pb = getPlayerBox(player);
    for (const o of world.obstacles) {
      if (o.userData.type === 'barricade' && player.sliding) continue;
      if (boxOverlap(pb, getObstacleBox(o))) {
        triggerGameOver();
        break;
      }
    }

    scoreEl.textContent = Math.floor(score);
  }

  if (gameOver && wasJustPressed('KeyR')) {
    resetGame();
  }

  clearJustPressed();
  renderer.render(scene, camera);
}

function triggerGameOver() {
  gameOver = true;
  finalScoreEl.textContent = `점수: ${Math.floor(score)}`;
  gameOverEl.classList.add('show');
}

function resetGame() {
  for (const o of world.obstacles) scene.remove(o);
  for (const c of world.coins) scene.remove(c);
  world.obstacles = [];
  world.coins = [];
  world.distanceSinceSpawn = 0;
  world.distanceSinceCoin = 0;
  world.speed = BASE_SPEED;

  player.lane = 1;
  player.jumping = false;
  player.jumpTime = 0;
  player.sliding = false;
  player.mesh.position.set(0, 0, 0);
  player.mesh.scale.y = 1;

  score = 0;
  elapsed = 0;
  gameOver = false;
  gameOverEl.classList.remove('show');
}

// 테스트/디버깅용 훅 (콘솔에서 게임 상태 접근)
window.__game = {
  world,
  player,
  get gameOver() { return gameOver; },
  reset: resetGame,
};

loop();
