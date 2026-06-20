// 초기화 및 연결
import { Doll } from './doll.js';
import * as D from './data.js';
import { buildUI } from './ui.js';
import { startEnding } from './ending.js';
import * as sound from './sound.js';

const stage = document.getElementById('doll');
const doll = new Doll(stage);

// --- 시작(누더기) 상태: 칙칙하고 단정치 못한 모습 ---
doll.set('dress', D.DRESSES[0]);
doll.setHair(D.HAIRS[0]);
doll.set('eyes', D.EYES[0]);
doll.set('eyebrows', D.EYEBROWS[0]);
doll.set('mouth', D.MOUTHS[0]);
doll.setHeadwear('none');

sound.initSound();

// --- 먼지/흐림 오버레이: 충분히 꾸미면 걷힌다 ---
const dust = document.getElementById('dust');
const changed = new Set();
const FACE = ['eyes', 'eyebrows', 'eyelashes', 'mouth', 'blush'];
const ACC = ['necklace', 'earrings', 'hands', 'headwear'];
let cleaned = false;

function onChange(slot) {
  changed.add(slot);
  if (cleaned) return;
  const hasFace = FACE.some((s) => changed.has(s));
  const hasAcc = ACC.some((s) => changed.has(s));
  if (changed.has('dress') && changed.has('hair') && hasFace && hasAcc) {
    cleaned = true;
    dust.classList.add('gone');
    showToast('와, 예뻐졌어요! 🤴 왕자 버튼을 눌러보세요 💖');
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4200);
}

buildUI({
  doll,
  sound,
  onChange,
  onPrince: () => startEnding({ dollStage: stage, onBack: () => {} }),
});

// --- 음소거 버튼 + M 키 ---
const muteBtn = document.getElementById('mute');
function refreshMute() {
  muteBtn.textContent = sound.isMuted() ? '🔇' : '🔊';
}
muteBtn.addEventListener('click', () => { sound.toggleMute(); refreshMute(); });
window.addEventListener('keydown', (e) => {
  if (e.key === 'm' || e.key === 'M') { sound.toggleMute(); refreshMute(); }
});
refreshMute();
