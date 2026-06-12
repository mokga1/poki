import * as THREE from 'three';
import { isPressed, wasJustPressed, clearJustPressed } from './input.js';
import { createPlayer, updatePlayer, getPlayerBox } from './player.js';
import { createWorld, updateWorld, getSupportHeight, trainSurfaceHeight } from './world.js';
import { createSky, updateSky } from './sky.js';
import { initSound, playCoin, playJump, playSlide, playGameOver, playPowerup, startBgm, toggleMute } from './sound.js';

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
initSound();

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
let started = false;
const startEl = document.getElementById('startscreen');
// 시작 화면에서 제자리 달리기용: 아무 입력도 없는 더미 입력
const IDLE_INPUT = { wasJustPressed: () => false, isPressed: () => false };
let elapsed = 0;
const BASE_SPEED = 12;
const MAX_SPEED = 30;
const SPEED_RAMP_SECONDS = 40;
// 파워업 효과 남은 시간 (초). 0이면 비활성.
const effects = { magnet: 0, star: 0, double: 0 };
const POWERUP_DURATION = { magnet: 6, star: 5, double: 6 };
let starTint = 0; // 무적 중 무지개 색 순환용
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

  if (!started) {
    // 시작 화면: 세상은 멈춰 있고 캐릭터만 제자리 달리기
    updatePlayer(player, IDLE_INPUT, dt, 0);
    if (wasJustPressed('Space') || wasJustPressed('Tap')) {
      started = true;
      startEl.classList.add('hide');
    }
  } else if (!gameOver) {
    elapsed += dt;
    const t = Math.min(elapsed / SPEED_RAMP_SECONDS, 1);
    world.speed = BASE_SPEED + (MAX_SPEED - BASE_SPEED) * t;
    for (const k in effects) effects[k] = Math.max(0, effects[k] - dt);
    const scoreMult = effects.double > 0 ? 2 : 1;
    score += dt * scoreMult;
    updateWorld(world, dt);

    // 자석: 근처 코인을 플레이어 쪽으로 끌어온다
    if (effects.magnet > 0) {
      for (const c of world.coins) {
        if (!c.visible) continue;
        const dx = player.mesh.position.x - c.position.x;
        const dy = (player.mesh.position.y + 0.8) - c.position.y;
        const dzc = player.mesh.position.z - c.position.z;
        if (dx * dx + dy * dy + dzc * dzc < 6 * 6) {
          const pull = Math.min(dt * 10, 1);
          c.position.x += dx * pull;
          c.position.y += dy * pull;
          c.position.z += dzc * pull;
        }
      }
    }

    const groundY = getSupportHeight(world, player.mesh.position.x, player.mesh.position.z);
    const wasJumping = player.jumping;
    const wasSliding = player.sliding;
    updatePlayer(player, { wasJustPressed, isPressed }, dt, groundY);
    if (player.jumping && !wasJumping) playJump();
    if (player.sliding && !wasSliding) playSlide();

    for (const c of world.coins) {
      if (!c.visible) continue;
      const dx = c.position.x - player.mesh.position.x;
      const dy = c.position.y - (player.mesh.position.y + 0.8);
      const dz = c.position.z - player.mesh.position.z;
      if (dx * dx + dy * dy + dz * dz < 0.8 * 0.8) {
        c.visible = false;
        score += 10 * scoreMult;
        playCoin();
      }
    }

    for (const p of world.powerups) {
      if (!p.visible) continue;
      const dx = p.position.x - player.mesh.position.x;
      const dy = p.position.y - (player.mesh.position.y + 0.8);
      const dzp = p.position.z - player.mesh.position.z;
      if (dx * dx + dy * dy + dzp * dzp < 0.9 * 0.9) {
        p.visible = false;
        effects[p.userData.kind] = POWERUP_DURATION[p.userData.kind];
        playPowerup();
      }
    }

    // 무적별 효과 중에는 충돌하지 않고 캐릭터가 무지개색으로 반짝인다
    if (effects.star > 0) {
      starTint = (starTint + dt * 1.5) % 1;
      const tint = new THREE.Color().setHSL(starTint, 1, 0.55);
      player.mesh.traverse(o => { if (o.isMesh) o.material.emissive.copy(tint); });
    } else {
      if (starTint !== 0) {
        starTint = 0;
        player.mesh.traverse(o => { if (o.isMesh) o.material.emissive.setHex(0x000000); });
      }
      const pb = getPlayerBox(player);
      for (const o of world.obstacles) {
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
    }

    let badges = '';
    if (effects.magnet > 0) badges += ' 🧲';
    if (effects.star > 0) badges += ' ⭐';
    if (effects.double > 0) badges += ' x2';
    scoreEl.textContent = Math.floor(score) + badges;
  }

  updateSky(sky, dt);

  if (wasJustPressed('KeyM')) {
    toggleMute();
  }

  if (gameOver && (wasJustPressed('KeyR') || wasJustPressed('Tap'))) {
    resetGame();
  }

  clearJustPressed();
  renderer.render(scene, camera);
}

function triggerGameOver() {
  gameOver = true;
  playGameOver();
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
  for (const p of world.powerups) scene.remove(p);
  world.obstacles = [];
  world.coins = [];
  world.powerups = [];
  world.distanceSinceSpawn = 0;
  world.distanceSinceCoin = 0;
  world.distanceSincePowerup = 0;
  world.speed = BASE_SPEED;

  effects.magnet = 0;
  effects.star = 0;
  effects.double = 0;
  starTint = 0;
  player.mesh.traverse(o => { if (o.isMesh) o.material.emissive.setHex(0x000000); });

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
  startBgm();
}

// 테스트/디버깅용 훅 (콘솔에서 게임 상태 접근)
window.__game = {
  world,
  player,
  get gameOver() { return gameOver; },
  reset: resetGame,
};

loop();
