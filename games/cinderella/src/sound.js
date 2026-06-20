// Web Audio 음악: 외부 파일 없이 코드로 부드러운 음악을 만든다.
// 꾸미는 중에는 잔잔한 멜로디, 엔딩에서는 왈츠.
// 브라우저 정책상 AudioContext 는 사용자 입력 후에만 소리를 낼 수 있다.

let ctx = null;
let master = null;
let musicGain = null;
let muted = false;
let timer = null;
let mode = 'calm'; // 'calm' | 'waltz'

let nextTime = 0;
let step = 0;

export function initSound() {
  const resume = () => {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 1;
      master.connect(ctx.destination);
      musicGain = ctx.createGain();
      musicGain.gain.value = 0.18;
      musicGain.connect(master);
      startMusic('calm');
    }
    if (ctx.state === 'suspended') ctx.resume();
  };
  window.addEventListener('keydown', resume);
  window.addEventListener('pointerdown', resume);
}

export function toggleMute() {
  muted = !muted;
  if (master) master.gain.value = muted ? 0 : 1;
  return muted;
}

export function isMuted() {
  return muted;
}

function note(freq, time, dur, type = 'sine', vol = 0.3, dest = musicGain) {
  if (!ctx || freq <= 0) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(vol, time + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(time);
  osc.stop(time + dur + 0.02);
}

// 아이템 선택 시 반짝 효과음
export function playSelect() {
  if (!ctx) return;
  const t = ctx.currentTime;
  note(1047, t, 0.12, 'sine', 0.25, master);       // C6
  note(1568, t + 0.06, 0.18, 'sine', 0.18, master); // G6
}

// 엔딩 등장 효과음 (상승 아르페지오)
export function playFanfare() {
  if (!ctx) return;
  const t = ctx.currentTime;
  [523, 659, 784, 1047, 1319].forEach((f, i) =>
    note(f, t + i * 0.1, 0.4, 'triangle', 0.3, master)
  );
}

// --- 잔잔한 멜로디 (꾸미는 중) ---
const CALM = [
  784, 0, 880, 0, 988, 0, 880, 0,
  784, 0, 659, 0, 523, 0, 587, 0,
]; // G5 A5 B5 A5 / G5 E5 C5 D5 (사이사이 쉼)
const CALM_STEP = 0.34;

// --- 왈츠 (엔딩) : 3/4 박, oom-pah-pah ---
// 각 마디 = 베이스음 + 코드 화음, 그리고 멜로디
const WALTZ_BASS = [262, 196, 220, 196]; // C4 G3 A3 G3 (마디별 근음)
const WALTZ_CHORD = [
  [330, 392], // C: E G
  [294, 392], // G: D G
  [277, 349], // A: C# F (살짝 화사)
  [294, 392], // G
];
const WALTZ_MELODY = [
  523, 659, 784, 880, 784, 659, // 마디1~2 멜로디 조각
  587, 698, 880, 988, 880, 698,
];
const BEAT = 0.34; // 4분음표(왈츠 한 박)

export function startMusic(which) {
  if (!ctx) return;
  stopMusic();
  mode = which;
  nextTime = ctx.currentTime + 0.1;
  step = 0;
  timer = setInterval(scheduler, 90);
}

export function stopMusic() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function scheduler() {
  if (!ctx) return;
  const ahead = ctx.currentTime + 0.4;
  while (nextTime < ahead) {
    if (mode === 'calm') {
      const f = CALM[step % CALM.length];
      if (f > 0) {
        note(f, nextTime, CALM_STEP * 1.6, 'sine', 0.22);
        note(f / 2, nextTime, CALM_STEP * 2, 'triangle', 0.12);
      }
      nextTime += CALM_STEP;
      step++;
    } else {
      // 왈츠: 3박 단위
      const bar = Math.floor(step / 3) % WALTZ_BASS.length;
      const beat = step % 3;
      if (beat === 0) {
        note(WALTZ_BASS[bar], nextTime, BEAT * 0.9, 'triangle', 0.35); // oom (근음)
        const mel = WALTZ_MELODY[(Math.floor(step / 3)) % WALTZ_MELODY.length];
        note(mel, nextTime, BEAT * 2.6, 'sine', 0.26); // 멜로디
      } else {
        // pah (화음)
        WALTZ_CHORD[bar].forEach((f) => note(f, nextTime, BEAT * 0.6, 'sine', 0.16));
      }
      nextTime += BEAT;
      step++;
    }
  }
}
