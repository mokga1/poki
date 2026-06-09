# 포키 (Poki) 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Three.js 기반 3차선 무한 러너 게임 "포키"를 웹 브라우저에서 동작하도록 구현한다.

**Architecture:** 단일 HTML 페이지 + ES 모듈 4개 (input, player, world, game). Three.js는 CDN으로 로드. 빌드 도구 없음. 각 모듈은 한 가지 책임만 가짐.

**Tech Stack:** HTML5, JavaScript (ES Modules), Three.js (CDN), localStorage

**검증 방식:** 시각적 게임이므로 각 태스크마다 `index.html`을 브라우저에서 열어 동작을 직접 확인한다. 단위 테스트 프레임워크는 사용하지 않는다.

**참고 문서:** `docs/superpowers/specs/2026-06-09-poki-running-game-design.md`

---

## 파일 구조

| 파일 | 책임 |
|------|------|
| `index.html` | 진입점. Three.js CDN, 캔버스, HUD overlay, 게임오버 overlay, 모듈 로드 |
| `src/input.js` | 키보드 상태 (눌림/뗌) 관리. `isPressed(key)`, `wasJustPressed(key)` 노출 |
| `src/player.js` | 플레이어 메쉬 생성, 차선/점프/슬라이드 상태, 매 프레임 업데이트 |
| `src/world.js` | 지면, 장애물, 코인 스폰/이동/제거, 충돌 후보 노출 |
| `src/game.js` | Three.js 씬/렌더러/카메라, 메인 루프, 점수, 게임오버, 재시작 |

---

## Task 1: 프로젝트 초기 설정 및 빈 Three.js 씬

**Files:**
- Create: `index.html`
- Create: `src/game.js`
- Create: `.gitignore`

- [ ] **Step 1: git 저장소 초기화**

```bash
cd D:/AI/Hwarang
git init
git add docs
git commit -m "docs: add design and implementation plan for Poki"
```

- [ ] **Step 2: `.gitignore` 작성**

```
node_modules/
.DS_Store
Thumbs.db
*.log
```

- [ ] **Step 3: `index.html` 작성**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>포키</title>
  <style>
    body { margin: 0; overflow: hidden; background: #87CEEB; font-family: sans-serif; }
    canvas { display: block; }
    #score {
      position: absolute; top: 20px; left: 20px;
      font-size: 32px; font-weight: bold; color: white;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
      z-index: 10;
    }
    #gameover {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.7); color: white;
      display: none; flex-direction: column; justify-content: center; align-items: center;
      font-size: 28px; z-index: 20;
    }
    #gameover.show { display: flex; }
    #gameover h1 { font-size: 64px; margin: 0 0 20px; }
    #gameover .hint { font-size: 20px; margin-top: 30px; opacity: 0.8; }
  </style>
  <script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.160.0/build/three.module.js"
    }
  }
  </script>
</head>
<body>
  <div id="score">0</div>
  <div id="gameover">
    <h1>GAME OVER</h1>
    <div id="final-score">점수: 0</div>
    <div id="high-score">최고 점수: 0</div>
    <div class="hint">Press R to Restart</div>
  </div>
  <script type="module" src="./src/game.js"></script>
</body>
</html>
```

- [ ] **Step 4: `src/game.js` 작성 (빈 씬)**

```javascript
import * as THREE from 'three';

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

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function loop() {
  requestAnimationFrame(loop);
  renderer.render(scene, camera);
}
loop();
```

- [ ] **Step 5: 브라우저에서 확인**

`index.html`을 로컬 웹 서버로 띄워서 (ES 모듈 때문에 `file://`은 안 됨) 브라우저로 연다. 간단한 방법:

```bash
cd D:/AI/Hwarang
python -m http.server 8000
```

브라우저에서 `http://localhost:8000` 열기.
Expected: 하늘색 화면. 좌측 상단에 흰색 "0" 점수 표시.

- [ ] **Step 6: 커밋**

```bash
git add index.html src/game.js .gitignore
git commit -m "feat: bootstrap Three.js scene with HUD"
```

---

## Task 2: 지면 (3차선 트랙)

**Files:**
- Modify: `src/game.js`

- [ ] **Step 1: 지면 추가 (game.js 상단에 light 추가 이후, loop 호출 이전 위치에 삽입)**

```javascript
const LANE_WIDTH = 2;
const TRACK_LENGTH = 200;

const groundGeo = new THREE.PlaneGeometry(LANE_WIDTH * 3, TRACK_LENGTH);
const groundMat = new THREE.MeshLambertMaterial({ color: 0x555555 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.z = -TRACK_LENGTH / 2 + 10;
scene.add(ground);

for (let i = -1; i <= 1; i += 2) {
  const lineGeo = new THREE.PlaneGeometry(0.1, TRACK_LENGTH);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const line = new THREE.Mesh(lineGeo, lineMat);
  line.rotation.x = -Math.PI / 2;
  line.position.set(i * LANE_WIDTH / 2, 0.01, -TRACK_LENGTH / 2 + 10);
  scene.add(line);
}
```

- [ ] **Step 2: 브라우저에서 확인**

새로고침. Expected: 회색 트랙이 화면 안쪽으로 길게 뻗어 있고, 노란 차선 선 두 개가 트랙을 3등분.

- [ ] **Step 3: 커밋**

```bash
git add src/game.js
git commit -m "feat: add 3-lane ground track"
```

---

## Task 3: 입력 모듈

**Files:**
- Create: `src/input.js`

- [ ] **Step 1: `src/input.js` 작성**

```javascript
const pressed = new Set();
const justPressed = new Set();

window.addEventListener('keydown', (e) => {
  if (!pressed.has(e.code)) {
    justPressed.add(e.code);
  }
  pressed.add(e.code);
});

window.addEventListener('keyup', (e) => {
  pressed.delete(e.code);
});

export function isPressed(code) {
  return pressed.has(code);
}

export function wasJustPressed(code) {
  return justPressed.has(code);
}

export function clearJustPressed() {
  justPressed.clear();
}
```

설계 의도: `wasJustPressed`는 "이 프레임에 새로 눌렸는가"를 알려준다. game.js가 매 프레임 끝에 `clearJustPressed()`를 호출한다. 키 코드는 `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `KeyR` 사용.

- [ ] **Step 2: game.js에서 확인용 import + 콘솔 출력**

`src/game.js` 상단의 import 라인 바로 아래에 추가:

```javascript
import { isPressed, wasJustPressed, clearJustPressed } from './input.js';
```

`loop` 함수를 수정:

```javascript
function loop() {
  requestAnimationFrame(loop);
  if (wasJustPressed('ArrowLeft')) console.log('LEFT');
  if (wasJustPressed('ArrowRight')) console.log('RIGHT');
  if (wasJustPressed('ArrowUp')) console.log('UP');
  if (isPressed('ArrowDown')) console.log('DOWN (held)');
  clearJustPressed();
  renderer.render(scene, camera);
}
```

- [ ] **Step 3: 브라우저에서 확인**

새로고침 후 DevTools 콘솔 열고 화살표 키 눌러본다.
Expected:
- ← / → / ↑ 누를 때마다 각각 "LEFT", "RIGHT", "UP" 한 번씩 출력
- ↓ 누르고 있으면 "DOWN (held)" 가 매 프레임 반복 출력

- [ ] **Step 4: 확인용 콘솔 출력 제거**

`loop` 함수에서 if/console.log 3줄 + DOWN 줄 모두 삭제. `clearJustPressed()` 호출은 남긴다.

- [ ] **Step 5: 커밋**

```bash
git add src/input.js src/game.js
git commit -m "feat: add keyboard input module"
```

---

## Task 4: 플레이어 캐릭터 (단순 도형, 정지 상태)

**Files:**
- Create: `src/player.js`
- Modify: `src/game.js`

- [ ] **Step 1: `src/player.js` 작성**

```javascript
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
    lane: 1,          // 0 = left, 1 = center, 2 = right
    jumping: false,
    jumpTime: 0,
    sliding: false,
  };
}
```

설명: `lane` 값 0/1/2 가 x 위치 `-LANE_WIDTH`, `0`, `+LANE_WIDTH` 에 대응. 이번 태스크에서는 가만히 가운데 차선에 세워둠.

- [ ] **Step 2: `src/game.js` 에서 플레이어 추가**

`src/game.js`의 import 영역에 추가:

```javascript
import { createPlayer } from './player.js';
```

지면을 추가한 부분 다음에 삽입:

```javascript
const player = createPlayer();
scene.add(player.mesh);
```

- [ ] **Step 3: 브라우저에서 확인**

새로고침. Expected: 트랙 가운데에 분홍 티셔츠 + 보라 바지 + 살구색 머리 + 뒤에 분홍 포니테일 박스가 붙은 캐릭터가 보임. 카메라가 약간 위쪽 뒤에서 보고 있음.

- [ ] **Step 4: 커밋**

```bash
git add src/player.js src/game.js
git commit -m "feat: add player character (simple geometry)"
```

---

## Task 5: 차선 이동 (좌/우 화살표)

**Files:**
- Modify: `src/player.js`
- Modify: `src/game.js`

- [ ] **Step 1: `src/player.js`에 update 함수 추가**

파일 끝에 추가:

```javascript
const LANE_SWITCH_SPEED = 10; // 초당 단위

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
}
```

`input`은 `{ wasJustPressed, isPressed }` 형태로 game.js가 주입한다.

- [ ] **Step 2: `src/game.js`에서 매 프레임 호출**

`updatePlayer` import 추가:

```javascript
import { createPlayer, updatePlayer } from './player.js';
```

`loop` 함수 위에 시간 관리 추가:

```javascript
let lastTime = performance.now();
```

`loop` 함수를 다음과 같이 수정:

```javascript
function loop() {
  requestAnimationFrame(loop);
  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  updatePlayer(player, { wasJustPressed, isPressed }, dt);

  clearJustPressed();
  renderer.render(scene, camera);
}
```

- [ ] **Step 3: 브라우저에서 확인**

새로고침 후 ←, → 키 눌러본다.
Expected:
- ← 한 번: 캐릭터가 왼쪽 차선으로 부드럽게(약 0.2초) 이동
- → 한 번: 다시 가운데로
- → 한 번 더: 오른쪽 차선으로
- → 한 번 더: 더 이상 이동 안 함 (이미 끝)
- ← 두 번: 가운데 거쳐 왼쪽 끝까지

- [ ] **Step 4: 커밋**

```bash
git add src/player.js src/game.js
git commit -m "feat: lane switching with left/right keys"
```

---

## Task 6: 점프 (위 화살표)

**Files:**
- Modify: `src/player.js`

- [ ] **Step 1: 점프 로직 추가**

`src/player.js`의 `updatePlayer` 함수를 수정 (lane 처리 다음, mesh.position.x 처리 이후에 점프 처리 추가):

```javascript
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
}
```

설명: 포물선 `4 * t * (1 - t)` 는 `t = 0.5`에서 최대 1, 양 끝에서 0. JUMP_HEIGHT를 곱해 최대 높이 2.

- [ ] **Step 2: 브라우저에서 확인**

새로고침. ↑ 눌러본다.
Expected:
- 캐릭터가 약 0.6초 동안 위로 올라갔다가 내려와 착지
- 공중에서 ↑ 다시 눌러도 무시됨
- 점프 중에도 ←/→ 로 차선 이동 가능

- [ ] **Step 3: 커밋**

```bash
git add src/player.js
git commit -m "feat: jump action with up arrow"
```

---

## Task 7: 슬라이드 (아래 화살표 길게)

**Files:**
- Modify: `src/player.js`

- [ ] **Step 1: 슬라이드 처리 추가**

`src/player.js`의 `updatePlayer` 함수 끝부분(점프 처리 이후)에 추가:

```javascript
  const wantSlide = input.isPressed('ArrowDown') && !player.jumping;
  if (wantSlide !== player.sliding) {
    player.sliding = wantSlide;
    player.mesh.scale.y = wantSlide ? 0.5 : 1;
    player.mesh.position.y = wantSlide ? 0 : player.mesh.position.y;
  }
```

설명: ↓가 눌려있는 동안 캐릭터 y스케일을 0.5로 줄여서 키가 절반이 된 모습을 보여준다. 점프 중에는 슬라이드 불가.

- [ ] **Step 2: 브라우저에서 확인**

새로고침. ↓ 키 눌러본다.
Expected:
- ↓ 누르면 캐릭터 키가 절반으로 줄어듦 (납작해진 모습)
- ↓ 떼면 원래 키로 돌아옴
- 점프 중에는 ↓ 눌러도 변화 없음

- [ ] **Step 3: 커밋**

```bash
git add src/player.js
git commit -m "feat: slide action with down arrow"
```

---

## Task 8: 월드 모듈 + 지면 무한 스크롤

**Files:**
- Create: `src/world.js`
- Modify: `src/game.js`

- [ ] **Step 1: `src/world.js` 작성**

```javascript
import * as THREE from 'three';

export const LANE_WIDTH = 2;
const TRACK_WIDTH = LANE_WIDTH * 3;
const SEGMENT_LENGTH = 20;
const NUM_SEGMENTS = 12;

export function createWorld(scene) {
  const segments = [];
  for (let i = 0; i < NUM_SEGMENTS; i++) {
    const seg = makeGroundSegment(i);
    segments.push(seg);
    scene.add(seg);
  }
  return {
    segments,
    speed: 12,             // world units per second moving toward camera
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
}
```

설명: 12개 지면 세그먼트가 카메라 쪽으로 다가오면서, 카메라를 지나친 세그먼트는 다시 가장 먼 쪽으로 보낸다 (재활용).

- [ ] **Step 2: `src/game.js`에서 기존 지면 코드 제거하고 world 사용**

기존에 추가했던 ground / lineGeo 관련 블록을 모두 삭제하고, import에 추가:

```javascript
import { createWorld, updateWorld } from './world.js';
```

플레이어 추가 코드 위쪽에 삽입:

```javascript
const world = createWorld(scene);
```

`loop` 함수에서 `updatePlayer` 호출 위에 추가:

```javascript
updateWorld(world, dt);
```

- [ ] **Step 3: 브라우저에서 확인**

새로고침.
Expected: 트랙이 카메라 쪽으로 무한히 흘러옴. 회색 톤 두 가지가 번갈아 보여서 움직임이 확실히 느껴짐. 캐릭터는 제자리에서 달리는 것처럼 보임.

- [ ] **Step 4: 커밋**

```bash
git add src/world.js src/game.js
git commit -m "feat: scrolling ground via world module"
```

---

## Task 9: 정지 기차 장애물 + 계단

**Files:**
- Modify: `src/world.js`
- Modify: `src/game.js`

- [ ] **Step 1: `src/world.js`에 장애물 관리 추가**

파일 상단(import 아래)에 추가:

```javascript
const SPAWN_INTERVAL = 8;   // 초당 1대꼴, 속도와 무관하게 거리 기준 사용
const SPAWN_DISTANCE = -180; // 멀리서 등장
const DESPAWN_Z = 15;       // 카메라 뒤쪽
```

`createWorld` 함수 안에서 return 직전에 새 필드 추가하도록 수정:

```javascript
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
```

파일 끝에 장애물 생성 함수 추가:

```javascript
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
```

`updateWorld` 함수를 다음으로 교체:

```javascript
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
    o.position.z += dz;
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
    const train = makeStaticTrain(lane);
    world.obstacles.push(train);
    world.scene.add(train);
  }
}
```

- [ ] **Step 2: 브라우저에서 확인**

새로고침.
Expected: 트랙 위에 회색 기차들이 멀리서 등장해서 다가오고, 카메라를 지나면 사라짐. 기차마다 뒤쪽에 노란 계단 박스가 붙어 있음. 랜덤한 차선에 등장.

- [ ] **Step 3: 커밋**

```bash
git add src/world.js
git commit -m "feat: spawn static train obstacles with stairs"
```

---

## Task 10: 움직이는 기차 + 낮은/높은 장애물 다양화

**Files:**
- Modify: `src/world.js`

- [ ] **Step 1: 추가 장애물 생성 함수**

`src/world.js` 끝에 추가:

```javascript
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
```

- [ ] **Step 2: 스폰 로직에 랜덤 종류 추가**

`updateWorld` 안의 스폰 블록을 다음으로 교체:

```javascript
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
```

- [ ] **Step 3: 움직이는 기차의 추가 이동 처리**

`updateWorld`의 obstacle z 업데이트 루프를 다음으로 교체:

```javascript
  for (const o of world.obstacles) {
    let move = dz;
    if (o.userData.type === 'moving_train') {
      move += o.userData.extraSpeed * dt;
    }
    o.position.z += move;
  }
```

- [ ] **Step 4: 브라우저에서 확인**

새로고침.
Expected:
- 회색 정지 기차 (계단 있음)
- 빨간 기차 (계단 없음, 속도가 약간 더 빠르게 다가옴)
- 주황색 낮은 박스 (바닥에 깔림)
- 파란 박스 (공중에 떠 있음)
가 랜덤 차선/랜덤 종류로 번갈아 등장.

- [ ] **Step 5: 커밋**

```bash
git add src/world.js
git commit -m "feat: add moving train, barricade, and sign obstacles"
```

---

## Task 11: 코인 스폰 + 수집

**Files:**
- Modify: `src/world.js`
- Modify: `src/game.js`

- [ ] **Step 1: `src/world.js`에 코인 추가**

파일 끝에 추가:

```javascript
function makeCoin(lane, z, y = 0.8) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 12, 12),
    new THREE.MeshLambertMaterial({ color: 0xffd700, emissive: 0x665500 }),
  );
  mesh.position.set((lane - 1) * LANE_WIDTH, y, z);
  mesh.userData = { type: 'coin', lane };
  return mesh;
}
```

`createWorld`의 return 객체에 새 필드:

```javascript
    distanceSinceCoin: 0,
```

`updateWorld`에 코인 처리 추가 (장애물 처리 다음에):

```javascript
  for (const c of world.coins) {
    c.position.z += dz;
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
```

코인 회전 애니메이션도 추가 (지면 루프 이후, 코인 처리 이전 어디든):

```javascript
  for (const c of world.coins) {
    c.rotation.y += dt * 4;
  }
```

(주의: c.position.z 업데이트 루프와 별개로 추가하거나, 한 루프 안에 둘 다 처리해도 됨. 위 코드를 그대로 두 곳에 두는 대신 한 루프로 합쳐도 무방.)

- [ ] **Step 2: 코인 수집 판정 (game.js)**

`src/game.js`의 `loop` 안 `updateWorld` 호출 다음에 추가:

```javascript
  for (const c of world.coins) {
    if (!c.visible) continue;
    const dx = c.position.x - player.mesh.position.x;
    const dy = c.position.y - (player.mesh.position.y + 0.8);
    const dz = c.position.z - player.mesh.position.z;
    if (dx * dx + dy * dy + dz * dz < 0.8 * 0.8) {
      c.visible = false;
      // score 처리는 다음 태스크에서
    }
  }
```

- [ ] **Step 3: 브라우저에서 확인**

새로고침.
Expected: 노란 코인들이 줄지어 나타나면서 다가옴. 캐릭터를 그 차선에 두면 코인이 닿는 순간 사라짐.

- [ ] **Step 4: 커밋**

```bash
git add src/world.js src/game.js
git commit -m "feat: spawn and collect coins"
```

---

## Task 12: 점수 표시 (거리 + 코인)

**Files:**
- Modify: `src/game.js`

- [ ] **Step 1: 점수 상태 추가**

`src/game.js`의 `let lastTime = ...` 줄 아래에 추가:

```javascript
let score = 0;
const scoreEl = document.getElementById('score');
```

`loop`에서 dt 계산 다음에 추가:

```javascript
score += dt; // 1초당 1점
```

- [ ] **Step 2: 코인 수집 시 +10**

코인 수집 블록에서 `c.visible = false;` 다음 줄을 채움:

```javascript
      c.visible = false;
      score += 10;
```

- [ ] **Step 3: HUD 업데이트**

`loop` 끝(렌더 호출 직전)에:

```javascript
  scoreEl.textContent = Math.floor(score);
```

- [ ] **Step 4: 브라우저에서 확인**

새로고침.
Expected: 좌상단 점수가 1초에 1씩 증가. 코인 먹으면 한 번에 10씩 점프. 표시는 정수.

- [ ] **Step 5: 커밋**

```bash
git add src/game.js
git commit -m "feat: live score display"
```

---

## Task 13: 충돌 판정 + 게임 오버

**Files:**
- Modify: `src/game.js`
- Modify: `src/player.js`

- [ ] **Step 1: 플레이어 AABB 헬퍼**

`src/player.js` 끝에 추가:

```javascript
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
```

- [ ] **Step 2: 게임 상태 + 충돌 검사**

`src/game.js` import에 추가:

```javascript
import { createPlayer, updatePlayer, getPlayerBox } from './player.js';
```

`let score = 0;` 아래에 추가:

```javascript
let gameOver = false;
const gameOverEl = document.getElementById('gameover');
const finalScoreEl = document.getElementById('final-score');
```

장애물 AABB 헬퍼를 game.js에 함수로 추가 (loop 위에 두기):

```javascript
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
```

`loop` 함수를 다음으로 교체:

```javascript
function loop() {
  requestAnimationFrame(loop);
  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  if (!gameOver) {
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
      if (boxOverlap(pb, getObstacleBox(o))) {
        triggerGameOver();
        break;
      }
    }

    scoreEl.textContent = Math.floor(score);
  }

  clearJustPressed();
  renderer.render(scene, camera);
}

function triggerGameOver() {
  gameOver = true;
  finalScoreEl.textContent = `점수: ${Math.floor(score)}`;
  gameOverEl.classList.add('show');
}
```

- [ ] **Step 3: 브라우저에서 확인**

새로고침.
Expected:
- 회색/빨간 기차 정면에 부딪히면 게임오버 화면 ("GAME OVER", 점수, "Press R to Restart")
- 주황 바리케이드에 슬라이드 없이 부딪히면 게임오버
- 슬라이드 (↓ 누른 채) 로 바리케이드 통과하면 안 죽음
- 파란 간판은 점프하지 않으면 게임오버, 점프하면 통과
- 게임오버 이후엔 트랙이 멈추고 더 이상 점수가 안 오름

- [ ] **Step 4: 커밋**

```bash
git add src/game.js src/player.js
git commit -m "feat: AABB collision detection and game over"
```

---

## Task 14: 재시작 (R 키)

**Files:**
- Modify: `src/game.js`

- [ ] **Step 1: 리셋 함수**

`triggerGameOver` 다음에 추가:

```javascript
function resetGame() {
  for (const o of world.obstacles) scene.remove(o);
  for (const c of world.coins) scene.remove(c);
  world.obstacles = [];
  world.coins = [];
  world.distanceSinceSpawn = 0;
  world.distanceSinceCoin = 0;
  world.speed = 12;

  player.lane = 1;
  player.jumping = false;
  player.jumpTime = 0;
  player.sliding = false;
  player.mesh.position.set(0, 0, 0);
  player.mesh.scale.y = 1;

  score = 0;
  gameOver = false;
  gameOverEl.classList.remove('show');
}
```

`loop` 함수 안 `if (!gameOver) {` 블록 바깥(아래)에 추가:

```javascript
  if (gameOver && wasJustPressed('KeyR')) {
    resetGame();
  }
```

- [ ] **Step 2: 브라우저에서 확인**

게임오버 후 R 키 누른다.
Expected: 화면 어두움 사라지고, 캐릭터가 가운데 차선 0,0,0 위치로 돌아오고, 점수 0부터 다시 시작. 기존 장애물/코인 모두 사라지고 새로 스폰됨.

- [ ] **Step 3: 커밋**

```bash
git add src/game.js
git commit -m "feat: restart with R key"
```

---

## Task 15: 속도 점점 증가

**Files:**
- Modify: `src/game.js`

- [ ] **Step 1: 시간 누적 + 속도 증가**

`let gameOver = false;` 아래에 추가:

```javascript
let elapsed = 0;
const BASE_SPEED = 12;
const MAX_SPEED = 24;
```

`if (!gameOver) {` 블록 첫 줄(score 누적 위)에 추가:

```javascript
    elapsed += dt;
    const t = Math.min(elapsed / 60, 1); // 60초 걸쳐 두 배
    world.speed = BASE_SPEED + (MAX_SPEED - BASE_SPEED) * t;
```

`resetGame` 함수에 추가:

```javascript
  elapsed = 0;
```

- [ ] **Step 2: 브라우저에서 확인**

새로고침. 1분 이상 살아남아 본다 (혹은 BASE_SPEED를 일시적으로 22로 올려서 빨리 확인).
Expected: 시간이 갈수록 트랙과 장애물이 더 빠르게 다가옴. 약 1분 후 시작 속도의 2배.

- [ ] **Step 3: 커밋**

```bash
git add src/game.js
git commit -m "feat: gradual speed increase over time"
```

---

## Task 16: 최고 점수 (localStorage)

**Files:**
- Modify: `src/game.js`

- [ ] **Step 1: 최고 점수 로드 및 표시**

`let elapsed = 0;` 아래에 추가:

```javascript
const HIGH_KEY = 'poki_high_score';
let highScore = Number(localStorage.getItem(HIGH_KEY) || 0);
const highScoreEl = document.getElementById('high-score');
```

`triggerGameOver` 를 다음으로 교체:

```javascript
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
```

- [ ] **Step 2: 브라우저에서 확인**

새로고침. 죽을 때까지 플레이.
Expected:
- 첫 죽음: "최고 점수: <첫 점수>" + "🎉 신기록!"
- 재시작 후 더 낮은 점수로 죽으면: 신기록 표시 없음, 최고 점수는 이전 기록 유지
- 페이지를 닫고 다시 열어도 최고 점수 유지

- [ ] **Step 3: 커밋**

```bash
git add src/game.js
git commit -m "feat: persist high score in localStorage"
```

---

## Task 17: 달리기 애니메이션 + 마무리

**Files:**
- Modify: `src/player.js`

- [ ] **Step 1: 팔/다리 좌우 흔들기**

`src/player.js`의 `updatePlayer` 함수 최하단에 추가:

```javascript
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
```

- [ ] **Step 2: 브라우저에서 확인**

새로고침.
Expected: 캐릭터의 팔과 다리가 좌우(앞뒤) 로 번갈아 흔들려서 달리는 느낌이 남.

- [ ] **Step 3: 전체 플레이 테스트**

5분 정도 플레이하면서 다음을 확인:
- 차선 이동, 점프, 슬라이드 모두 부드럽게 동작
- 4종 장애물 다 등장하고 각자 정확한 회피법으로 통과 가능
- 코인 수집/점수 누적 정상
- 게임오버 → R로 재시작 정상
- 시간 지날수록 명백히 빨라짐
- 최고 점수가 페이지 새로고침 후에도 남아 있음

- [ ] **Step 4: 커밋**

```bash
git add src/player.js
git commit -m "feat: simple running animation for arms and legs"
```

---

## 완료 후 정리

- 모든 태스크 완료 후 README는 별도 요청 없으면 만들지 않음 (기본 정책)
- 추후 확장 후보 (이번 범위 밖):
  - 사운드/음악
  - 캐릭터를 3D 모델로 교체 (디자인 문서 B/C안)
  - 모바일 터치 조작
  - 파워업 아이템
  - 배경 테마 (도시/숲/사막)
