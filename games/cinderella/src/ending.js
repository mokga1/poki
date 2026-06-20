// 무도회 엔딩 연출: 배경 + 꾸민 신데렐라 + 왕자가 춤 + 꽃잎 + 왈츠
import { startMusic, playFanfare } from './sound.js';

const PRINCE_SVG = `
<svg viewBox="0 0 400 1020" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="coat" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3a5a9a"/><stop offset="1" stop-color="#26407a"/>
    </linearGradient>
  </defs>
  <!-- 다리/바지 -->
  <rect x="168" y="640" width="28" height="300" rx="12" fill="#1f2a44"/>
  <rect x="206" y="640" width="28" height="300" rx="12" fill="#26345a"/>
  <ellipse cx="180" cy="952" rx="30" ry="14" fill="#10131f"/>
  <ellipse cx="222" cy="952" rx="30" ry="14" fill="#10131f"/>
  <!-- 코트 -->
  <path d="M150 360 Q200 340 250 360 L286 700 Q200 730 114 700 Z" fill="url(#coat)"/>
  <path d="M200 360 L200 700" stroke="#1b2c52" stroke-width="3"/>
  <!-- 금장 단추 -->
  <circle cx="200" cy="430" r="6" fill="#ffd75e"/><circle cx="200" cy="470" r="6" fill="#ffd75e"/>
  <circle cx="200" cy="510" r="6" fill="#ffd75e"/><circle cx="200" cy="550" r="6" fill="#ffd75e"/>
  <!-- 어깨 견장 -->
  <rect x="138" y="372" width="40" height="20" rx="8" fill="#ffd75e"/>
  <rect x="222" y="372" width="40" height="20" rx="8" fill="#ffd75e"/>
  <!-- 사선 띠 -->
  <path d="M150 372 L262 470 L250 492 L138 394 Z" fill="#c0364f" opacity="0.9"/>
  <!-- 팔 -->
  <path d="M150 380 Q110 470 130 560" stroke="#2c4684" stroke-width="30" fill="none" stroke-linecap="round"/>
  <path d="M250 380 Q300 460 286 540" stroke="#2c4684" stroke-width="30" fill="none" stroke-linecap="round"/>
  <circle cx="132" cy="566" r="17" fill="#f2c9a6"/>
  <circle cx="288" cy="544" r="17" fill="#f2c9a6"/>
  <!-- 목 -->
  <rect x="186" y="320" width="28" height="50" fill="#f2c9a6"/>
  <!-- 얼굴 -->
  <circle cx="200" cy="280" r="74" fill="#f7d2b0"/>
  <!-- 머리 -->
  <path d="M128 270 Q120 180 200 168 Q280 180 272 270 Q258 232 240 226 Q220 250 200 234 Q180 250 160 226 Q142 232 128 270 Z" fill="#5a3b22"/>
  <!-- 눈 -->
  <ellipse cx="176" cy="284" rx="8" ry="11" fill="#3a2a1c"/>
  <ellipse cx="224" cy="284" rx="8" ry="11" fill="#3a2a1c"/>
  <circle cx="178" cy="280" r="3" fill="#fff"/><circle cx="226" cy="280" r="3" fill="#fff"/>
  <!-- 눈썹 -->
  <path d="M164 264 Q176 258 188 264" stroke="#4a3320" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M212 264 Q224 258 236 264" stroke="#4a3320" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- 미소 -->
  <path d="M182 312 Q200 326 218 312" stroke="#b5654a" stroke-width="4" fill="none" stroke-linecap="round"/>
  <!-- 왕관 -->
  <path d="M158 176 L168 150 L182 174 L200 142 L218 174 L232 150 L242 176 Z" fill="#ffd75e" stroke="#d9a514" stroke-width="3"/>
</svg>`;

export function startEnding({ dollStage, onBack }) {
  // 기존 엔딩 제거
  const old = document.getElementById('ending');
  if (old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = 'ending';

  overlay.innerHTML = `
    <div class="ball-bg">
      <svg class="ball-svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="800" fill="#2a2150"/>
        <rect width="1200" height="800" fill="url(#hall)"/>
        <defs>
          <linearGradient id="hall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#3a2f63"/><stop offset="0.6" stop-color="#4a3a78"/><stop offset="1" stop-color="#2b2150"/>
          </linearGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#6a5aa0"/><stop offset="1" stop-color="#3a2f63"/>
          </linearGradient>
        </defs>
        <!-- 창문 -->
        <g fill="#5a4a90" opacity="0.5">
          <rect x="120" y="120" width="120" height="300" rx="60"/>
          <rect x="540" y="100" width="120" height="320" rx="60"/>
          <rect x="960" y="120" width="120" height="300" rx="60"/>
        </g>
        <!-- 바닥 -->
        <path d="M0 560 L1200 560 L1200 800 L0 800 Z" fill="url(#floor)"/>
        <g stroke="#7a6ab0" stroke-width="2" opacity="0.4">
          <line x1="600" y1="560" x2="120" y2="800"/><line x1="600" y1="560" x2="420" y2="800"/>
          <line x1="600" y1="560" x2="780" y2="800"/><line x1="600" y1="560" x2="1080" y2="800"/>
          <line x1="0" y1="640" x2="1200" y2="640"/><line x1="0" y1="720" x2="1200" y2="720"/>
        </g>
        <!-- 샹들리에 -->
        <line x1="600" y1="0" x2="600" y2="70" stroke="#e9c44a" stroke-width="4"/>
        <ellipse cx="600" cy="110" rx="70" ry="40" fill="#ffe89a" opacity="0.9"/>
        <g fill="#fff6cf"><circle cx="560" cy="120" r="7"/><circle cx="600" cy="135" r="8"/><circle cx="640" cy="120" r="7"/><circle cx="580" cy="100" r="6"/><circle cx="620" cy="100" r="6"/></g>
        <!-- 하객 실루엣 -->
        <g fill="#241d44" opacity="0.85" class="crowd">
          <g><circle cx="120" cy="520" r="26"/><rect x="96" y="540" width="48" height="80" rx="20"/></g>
          <g><circle cx="200" cy="535" r="24"/><rect x="178" y="552" width="44" height="74" rx="18"/></g>
          <g><circle cx="1010" cy="525" r="26"/><rect x="986" y="544" width="48" height="78" rx="20"/></g>
          <g><circle cx="1090" cy="535" r="24"/><rect x="1068" y="552" width="44" height="74" rx="18"/></g>
        </g>
        <!-- 공주 실루엣 (드레스) -->
        <g opacity="0.9">
          <g fill="#d98fc0"><circle cx="300" cy="510" r="20"/><path d="M280 528 Q300 520 320 528 L338 622 Q300 636 262 622 Z"/></g>
          <g fill="#8fb6d9"><circle cx="900" cy="510" r="20"/><path d="M880 528 Q900 520 920 528 L938 622 Q900 636 862 622 Z"/></g>
        </g>
      </svg>
    </div>

    <div class="couple">
      <div class="prince sway-a">${PRINCE_SVG}</div>
      <div class="bride sway-b"></div>
    </div>

    <div class="ending-title">축하해요! 🎉</div>
    <div class="ending-sub">신데렐라가 왕자님과 춤을 춰요 💖</div>
    <button id="ending-back" class="ending-back">다시 꾸미기</button>
    <div class="petals"></div>
  `;

  document.body.appendChild(overlay);

  // 꾸민 신데렐라 복제해서 신부 자리에 넣기
  const brideHolder = overlay.querySelector('.bride');
  const clone = dollStage.cloneNode(true);
  clone.removeAttribute('id');
  clone.classList.add('doll-clone');
  brideHolder.appendChild(clone);

  // 꽃잎 생성
  const petals = overlay.querySelector('.petals');
  const EMOJIS = ['🌸', '✨', '💖', '🌟', '🦋'];
  for (let i = 0; i < 26; i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    p.textContent = EMOJIS[i % EMOJIS.length];
    p.style.left = Math.random() * 100 + '%';
    p.style.fontSize = 16 + Math.random() * 22 + 'px';
    p.style.animationDuration = 5 + Math.random() * 6 + 's';
    p.style.animationDelay = -Math.random() * 8 + 's';
    petals.appendChild(p);
  }

  // 음악 전환 + 팡파레
  playFanfare();
  startMusic('waltz');

  overlay.querySelector('#ending-back').addEventListener('click', () => {
    overlay.remove();
    startMusic('calm');
    onBack && onBack();
  });
}
