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

// --- 터치/마우스 스와이프 조작 ---
// 옆으로 밀기 = 차선 이동, 위로 밀기 = 점프, 아래로 밀기 = 잠깐 슬라이드,
// 탭 = 점프 (+ 'Tap' 가상 키: 시작/재시작용). 기존 키 코드로 변환해서 흘려보낸다.

const SWIPE_MIN = 24;        // 이보다 작게 움직이면 탭으로 간주 (px)
const TOUCH_SLIDE_MS = 700;  // 아래로 밀었을 때 슬라이드 유지 시간

let pointerStart = null;
let slideTimer = null;

window.addEventListener('pointerdown', (e) => {
  pointerStart = { x: e.clientX, y: e.clientY };
});

window.addEventListener('pointerup', (e) => {
  if (!pointerStart) return;
  const dx = e.clientX - pointerStart.x;
  const dy = e.clientY - pointerStart.y;
  pointerStart = null;

  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  if (absX < SWIPE_MIN && absY < SWIPE_MIN) {
    justPressed.add('Tap');
    justPressed.add('ArrowUp');
  } else if (absX > absY) {
    justPressed.add(dx > 0 ? 'ArrowRight' : 'ArrowLeft');
  } else if (dy < 0) {
    justPressed.add('ArrowUp');
  } else {
    pressed.add('ArrowDown');
    clearTimeout(slideTimer);
    slideTimer = setTimeout(() => pressed.delete('ArrowDown'), TOUCH_SLIDE_MS);
  }
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
