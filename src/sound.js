// Web Audio 기반 사운드: 외부 파일 없이 코드로 8비트풍 소리를 만든다.
// 브라우저 정책상 AudioContext 는 사용자 입력(키/클릭) 후에만 소리를 낼 수 있어서
// 첫 입력 때 초기화한다.

let ctx = null;
let masterGain = null;
let bgmGain = null;
let muted = false;
let bgmTimer = null;

export function initSound() {
  const resume = () => {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = 1;
      masterGain.connect(ctx.destination);
      bgmGain = ctx.createGain();
      bgmGain.gain.value = 0.12;
      bgmGain.connect(masterGain);
      startBgm();
    }
    if (ctx.state === 'suspended') ctx.resume();
  };
  window.addEventListener('keydown', resume);
  window.addEventListener('pointerdown', resume);
}

export function toggleMute() {
  muted = !muted;
  if (masterGain) masterGain.gain.value = muted ? 0 : 1;
  return muted;
}

// 짧은 효과음 하나: 주파수에서 시작해 슬라이드하며 사라지는 톤
function blip(freq, time, dur, type = 'square', vol = 0.25, slideTo = null) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, time);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, time + dur);
  gain.gain.setValueAtTime(vol, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(time);
  osc.stop(time + dur);
}

export function playCoin() {
  if (!ctx) return;
  const t = ctx.currentTime;
  blip(988, t, 0.08, 'square', 0.18);        // B5
  blip(1319, t + 0.08, 0.14, 'square', 0.18); // E6
}

export function playJump() {
  if (!ctx) return;
  blip(300, ctx.currentTime, 0.18, 'sine', 0.3, 700);
}

export function playSlide() {
  if (!ctx) return;
  blip(500, ctx.currentTime, 0.15, 'sawtooth', 0.12, 180);
}

export function playPowerup() {
  if (!ctx) return;
  const t = ctx.currentTime;
  const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6 상승 아르페지오
  notes.forEach((f, i) => blip(f, t + i * 0.07, 0.12, 'square', 0.22));
}

export function playGameOver() {
  if (!ctx) return;
  const t = ctx.currentTime;
  const notes = [523, 392, 330, 262]; // C5 G4 E4 C4 하강
  notes.forEach((f, i) => blip(f, t + i * 0.18, 0.3, 'triangle', 0.3));
  stopBgm();
}

// --- 배경음악: 16개 8분음표 멜로디를 계속 루프 ---

const MELODY = [
  523, 659, 784, 1047, 880, 784, 659, 784,
  587, 659, 784, 880, 784, 659, 523, 0,
]; // C5 E5 G5 C6 A5 G5 E5 G5 / D5 E5 G5 A5 G5 E5 C5 쉼
const EIGHTH = 0.22; // 8분음표 길이(초)

let nextNoteTime = 0;
let noteIndex = 0;

export function startBgm() {
  if (!ctx || bgmTimer) return;
  nextNoteTime = ctx.currentTime + 0.1;
  noteIndex = 0;
  // 100ms 마다 앞으로 300ms 분량의 음표를 미리 예약하는 스케줄러
  bgmTimer = setInterval(() => {
    while (nextNoteTime < ctx.currentTime + 0.3) {
      const freq = MELODY[noteIndex % MELODY.length];
      if (freq > 0) {
        bgmNote(freq, nextNoteTime, EIGHTH * 0.9, 'square', 0.3);
        if (noteIndex % 4 === 0) {
          bgmNote(freq / 4, nextNoteTime, EIGHTH * 1.8, 'triangle', 0.5); // 베이스
        }
      }
      nextNoteTime += EIGHTH;
      noteIndex++;
    }
  }, 100);
}

export function stopBgm() {
  if (bgmTimer) {
    clearInterval(bgmTimer);
    bgmTimer = null;
  }
}

function bgmNote(freq, time, dur, type, vol) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
  osc.connect(gain);
  gain.connect(bgmGain);
  osc.start(time);
  osc.stop(time + dur);
}
