import * as THREE from 'three';
import { isPressed, wasJustPressed, clearJustPressed } from './input.js';
import { createPlayer, updatePlayer, getPlayerBox } from './player.js';
import { createWorld, updateWorld, getSupportHeight, trainSurfaceHeight } from './world.js';
import { createSky, updateSky } from './sky.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 4, 8);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff, 0.75);
scene.add(ambient);
const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(5, 10, 5);
scene.add(dir);

const world = createWorld(scene);
const sky = createSky(scene);

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
const MAX_SPEED = 30;
const SPEED_RAMP_SECONDS = 40;
const HIGH_KEY = 'poki_high_score';
let highScore = Number(localStorage.getItem(HIGH_KEY) || 0);
const highScoreEl = document.getElementById('high-score');
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
    const t = Math.min(elapsed / SPEED_RAMP_SECONDS, 1);
    world.speed = BASE_SPEED + (MAX_SPEED - BASE_SPEED) * t;
    score += dt;
    updateWorld(world, dt);
    const groundY = getSupportHeight(world, player.mesh.position.x, player.mesh.position.z);
    updatePlayer(player, { wasJustPressed, isPressed }, dt, groundY);

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
      // 계단/지붕 표면 위에 올라타 있는 동안은 정지 기차와 충돌하지 않는다
      if (o.userData.type === 'static_train') {
        const surface = trainSurfaceHeight(o, player.mesh.position.z);
        if (surface > 0 && player.mesh.position.y >= surface - 0.01) continue;
      }
      if (boxOverlap(pb, getObstacleBox(o))) {
        triggerGameOver();
        break;
      }
    }

    scoreEl.textContent = Math.floor(score);
  }

  updateSky(sky, dt);

  if (gameOver && wasJustPressed('KeyR')) {
    resetGame();
  }

  clearJustPressed();
  renderer.render(scene, camera);
}

function triggerGameOver() {
  gameOver = true;
  const finalScore = Math.floor(score);
  const isNewRecord = finalScore > highScore;
  if (isNewRecord) {
    highScore = finalScore;
    localStorage.setItem(HIGH_KEY, String(highScore));
  }
  finalScoreEl.textContent = `점수: ${finalScore}` + (isNewRecord ? '  🎉 신기록!' : '');
  highScoreEl.textContent = `최고 점수: ${highScore}`;
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
