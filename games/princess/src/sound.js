// 웹오디오 음악·효과음. 외부 파일 없이 코드로 만든다.
// 브라우저 정책상 AudioContext 는 사용자가 한 번 누른 뒤에만 소리를 낼 수 있다.
const MUTE_KEY = 'princess-mute';
let ctx = null, master = null, musicGain = null, sfxGain = null;
let muted = false;
try { muted = localStorage.getItem(MUTE_KEY) === '1'; } catch { /* 무시 */ }

let mode = null, wanted = 'home', timer = null, nextTime = 0, step = 0;
const _ = null;

// 곡: 8분음표 단위 멜로디(MIDI 번호, _ = 쉼표), bass 는 같은 박자로 반복
const SONGS = {
  home: { bpm: 104, wave: 'triangle', vol: 0.22, bassWave: 'sine',
    melody: [72, _, 76, _, 79, _, 76, _, 74, _, 77, _, 81, _, 79, _, 76, _, 79, _, 84, _, 83, 81, 79, _, _, _, 77, _, 76, _,
      72, _, 76, _, 79, _, 81, _, 79, _, 77, _, 76, _, 74, _, 72, _, 74, _, 76, _, 79, 77, 76, _, 74, _, 72, _, _, _],
    bass: [48, _, 55, _, 52, _, 55, _, 50, _, 57, _, 53, _, 57, _, 48, _, 55, _, 52, _, 55, _, 43, _, 50, _, 47, _, 50, _] },
  adventure: { bpm: 136, wave: 'square', vol: 0.12, bassWave: 'triangle',
    melody: [67, _, 72, 74, 76, _, 74, 72, 74, _, 71, 67, 69, 71, 72, _, 67, _, 72, 74, 76, 79, 77, 76, 74, 72, 71, 74, 72, _, _, _],
    bass: [48, _, 55, _, 48, _, 55, _, 43, _, 50, _, 43, _, 50, _, 45, _, 52, _, 41, _, 48, _, 43, _, 50, _, 48, _, 55, _] },
  battle: { bpm: 168, wave: 'square', vol: 0.11, bassWave: 'square',
    melody: [64, 67, 71, 67, 64, 67, 72, 71, 69, 72, 76, 72, 69, 71, 72, 74, 76, 74, 72, 71, 69, 67, 69, 71, 72, 71, 69, 67, 64, _, 67, _],
    bass: [40, 40, 52, 40, 40, 40, 52, 40, 45, 45, 57, 45, 45, 45, 57, 45, 41, 41, 53, 41, 43, 43, 55, 43, 40, 40, 52, 40, 47, 47, 59, 47] },
  boss: { bpm: 150, wave: 'sawtooth', vol: 0.07, bassWave: 'square',
    melody: [57, 60, 64, 60, 57, 60, 65, 64, 62, 65, 69, 65, 62, 64, 65, 67, 69, 67, 65, 64, 62, 60, 62, 64, 65, 64, 62, 60, 57, _, 56, _],
    bass: [45, 45, 57, 45, 45, 45, 57, 45, 41, 41, 53, 41, 41, 41, 53, 41, 43, 43, 55, 43, 43, 43, 55, 43, 40, 40, 52, 40, 40, 40, 52, 40] },
  ending: { bpm: 132, wave: 'triangle', vol: 0.24, bassWave: 'sine',
    melody: [72, _, 76, _, 79, _, 84, _, _, _, 79, _, 77, _, 81, _, 84, _, 83, _, _, _, 79, _, 76, _, 79, _, 84, _, 88, _, _, _, 84, _,
      83, _, 79, _, 81, _, 84, _, _, _, _, _],
    bass: [48, _, 55, _, 55, _, 48, _, 55, _, 55, _, 53, _, 57, _, 57, _, 55, _, 59, _, 59, _] },
};

const hz = (m) => 440 * 2 ** ((m - 69) / 12);

function tone(freq, time, dur, { type = 'sine', vol = 0.3, dest, slide } = {}) {
  if (!ctx || !freq) return;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, time);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, time + dur);
  g.gain.setValueAtTime(0.0001, time);
  g.gain.exponentialRampToValueAtTime(vol, time + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  o.connect(g); g.connect(dest || sfxGain);
  o.start(time); o.stop(time + dur + 0.03);
}

function schedule() {
  const song = SONGS[mode];
  if (!song) return;
  const eighth = 60 / song.bpm / 2;
  while (nextTime < ctx.currentTime + 0.15) {
    const m = song.melody[step % song.melody.length];
    const b = song.bass[step % song.bass.length];
    if (m) tone(hz(m), nextTime, eighth * 1.6, { type: song.wave, vol: song.vol, dest: musicGain });
    if (b) tone(hz(b), nextTime, eighth * 1.8, { type: song.bassWave, vol: song.vol * 0.8, dest: musicGain });
    nextTime += eighth;
    step += 1;
  }
}

export function music(name) {
  wanted = name;
  if (!ctx || mode === name) return;
  mode = name;
  step = 0;
  nextTime = ctx.currentTime + 0.1;
  clearInterval(timer);
  timer = setInterval(schedule, 40);
}

export function initSound() {
  const start = () => {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 1;
      master.connect(ctx.destination);
      musicGain = ctx.createGain(); musicGain.gain.value = 0.5; musicGain.connect(master);
      sfxGain = ctx.createGain(); sfxGain.gain.value = 0.7; sfxGain.connect(master);
      music(wanted);
    }
    if (ctx.state === 'suspended') ctx.resume();
  };
  window.addEventListener('pointerdown', start);
  window.addEventListener('keydown', start);
}

export function toggleMute() {
  muted = !muted;
  try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch { /* 무시 */ }
  if (master) master.gain.value = muted ? 0 : 1;
  return muted;
}
export const isMuted = () => muted;

// 효과음
const SFX = {
  click: (t) => tone(hz(84), t, 0.06, { type: 'triangle', vol: 0.15 }),
  blip: (t) => tone(hz(88 + Math.floor(Math.random() * 3)), t, 0.03, { type: 'square', vol: 0.03 }),
  tick: (t) => tone(hz(79), t, 0.08, { type: 'triangle', vol: 0.15 }),
  step: (t) => { tone(hz(67), t, 0.07, { type: 'triangle', vol: 0.15 }); tone(hz(72), t + 0.12, 0.07, { type: 'triangle', vol: 0.15 }); },
  up: (t) => [72, 76, 79, 84].forEach((m, i) => tone(hz(m), t + i * 0.07, 0.12, { type: 'triangle', vol: 0.18 })),
  down: (t) => [67, 64, 60].forEach((m, i) => tone(hz(m), t + i * 0.1, 0.15, { type: 'triangle', vol: 0.15 })),
  coin: (t) => { tone(hz(88), t, 0.08, { type: 'square', vol: 0.08 }); tone(hz(93), t + 0.08, 0.25, { type: 'square', vol: 0.08 }); },
  chest: (t) => [72, 76, 79, 84, 88].forEach((m, i) => tone(hz(m), t + i * 0.06, 0.2, { type: 'triangle', vol: 0.16 })),
  swing: (t) => tone(900, t, 0.12, { type: 'sawtooth', vol: 0.05, slide: 200 }),
  hit: (t) => { tone(220, t, 0.12, { type: 'square', vol: 0.12, slide: 80 }); tone(hz(76), t, 0.05, { type: 'triangle', vol: 0.1 }); },
  crit: (t) => { tone(300, t, 0.18, { type: 'square', vol: 0.14, slide: 60 }); [84, 88, 91].forEach((m, i) => tone(hz(m), t + 0.05 + i * 0.05, 0.1, { type: 'triangle', vol: 0.12 })); },
  hurt: (t) => tone(260, t, 0.2, { type: 'sawtooth', vol: 0.08, slide: 110 }),
  magic: (t) => [79, 84, 88, 91, 96].forEach((m, i) => tone(hz(m), t + i * 0.05, 0.25, { type: 'sine', vol: 0.12 })),
  heal: (t) => [72, 79, 84, 91].forEach((m, i) => tone(hz(m), t + i * 0.08, 0.3, { type: 'sine', vol: 0.14 })),
  win: (t) => [72, 76, 79, 84, 79, 84].forEach((m, i) => tone(hz(m), t + i * 0.1, i === 5 ? 0.5 : 0.12, { type: 'square', vol: 0.08 })),
  levelup: (t) => [72, 76, 79, 84, 88, 91, 96].forEach((m, i) => tone(hz(m), t + i * 0.07, i === 6 ? 0.6 : 0.12, { type: 'triangle', vol: 0.18 })),
  lose: (t) => [67, 66, 65, 64].forEach((m, i) => tone(hz(m), t + i * 0.2, 0.3, { type: 'triangle', vol: 0.15 })),
  boss: (t) => [45, 44, 45, 44].forEach((m, i) => tone(hz(m), t + i * 0.18, 0.2, { type: 'sawtooth', vol: 0.1 })),
  fanfare: (t) => [[72, 0], [72, 0.15], [72, 0.3], [76, 0.45], [79, 0.9], [84, 1.2]].forEach(([m, d]) => tone(hz(m), t + d, d >= 1.2 ? 0.9 : 0.25, { type: 'square', vol: 0.08 })),
};

export function sfx(name) {
  if (!ctx || muted || !SFX[name]) return;
  SFX[name](ctx.currentTime + 0.01);
}
