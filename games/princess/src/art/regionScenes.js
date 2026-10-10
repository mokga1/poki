// 무사수행 지역 배경 4곳 (숲 / 수정 동굴 / 얼음 성 / 마왕의 탑)
import { wrap, cloud } from './scenes.js';

const tree = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-10" y="-20" width="20" height="90" rx="6" fill="#c08a64"/><circle cy="-60" r="62" fill="#7fd08e"/><circle cx="-38" cy="-30" r="44" fill="#6cc485"/><circle cx="40" cy="-34" r="46" fill="#8ad99a"/><circle cx="-20" cy="-86" r="10" fill="#ffb3cf"/><circle cx="24" cy="-48" r="9" fill="#fff"/><circle cx="-40" cy="-40" r="8" fill="#ffd36e"/></g>`;
const flower = (x, y) => `<g transform="translate(${x} ${y})"><circle r="7" cy="-8" fill="#fff"/><circle r="7" cx="8" fill="#fff"/><circle r="7" cy="8" fill="#fff"/><circle r="7" cx="-8" fill="#fff"/><circle r="5" fill="#ffd36e"/></g>`;
const crystal = (x, y, s, c1, c2) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 L-24 -40 L-10 -120 L14 -140 L30 -50 L20 0Z" fill="${c1}"/><path d="M-10 -120 L14 -140 L6 -30 L0 0 L-24 -40Z" fill="${c2}" opacity=".7"/><path d="M-4 -110 L6 -126" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>`;
const icicle = (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s})" d="M-20 0 L0 120 L20 0Z" fill="#e9f7ff" stroke="#bfe3ff" stroke-width="3"/>`;

const REGION_ART = {
  forest: () => wrap(`<rect width="1600" height="900" fill="url(#rg)"/>
    ${cloud(300, 140, 1)}${cloud(1240, 180, 0.9)}
    <path d="M0 520 Q 300 420 600 500 T 1200 470 T 1600 500 L1600 900 L0 900 Z" fill="#b6ebb4"/>
    ${tree(120, 520, 1.1)}${tree(1480, 500, 1.2)}${tree(1290, 520, 0.8)}${tree(330, 500, 0.75)}${tree(760, 470, 0.6)}
    <path d="M0 620 Q 400 560 800 610 T 1600 600 L1600 900 L0 900 Z" fill="#8fd59a"/>
    ${[[80, 700], [700, 760], [900, 690], [1500, 740], [1000, 800], [250, 820], [450, 680], [1250, 820]].map(([x, y]) => flower(x, y)).join('')}`,
  `<linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe6ff"/><stop offset=".6" stop-color="#e9f7ff"/><stop offset="1" stop-color="#fff2f8"/></linearGradient>`),

  cave: () => wrap(`<rect width="1600" height="900" fill="url(#rg)"/>
    <path d="M0 0 H1600 V120 Q1500 200 1380 140 Q1260 220 1120 150 Q980 230 840 150 Q700 220 560 140 Q420 230 280 150 Q140 210 0 140Z" fill="#2a1f52"/>
    ${[[160, 130, 0.6], [480, 140, 0.5], [1000, 140, 0.55], [1360, 130, 0.6]].map(([x, y, s]) => `<path transform="translate(${x} ${y}) scale(${s})" d="M-30 0 L0 90 L30 0Z" fill="#3a2f72"/>`).join('')}
    <path d="M0 600 Q 400 540 800 590 T 1600 580 L1600 900 L0 900 Z" fill="#4a3a8a"/>
    ${crystal(140, 640, 1.4, '#c9a8ff', '#ffffff')}${crystal(300, 600, 0.8, '#9fdcff', '#fff')}${crystal(1440, 620, 1.6, '#ffb6e0', '#fff')}${crystal(1300, 590, 0.9, '#c9a8ff', '#fff')}${crystal(820, 580, 0.6, '#9fdcff', '#fff')}
    <path d="M0 720 Q 400 680 800 710 T 1600 700 L1600 900 L0 900 Z" fill="#5a4aa0"/>
    ${Array.from({ length: 24 }, (_, i) => `<circle cx="${(i * 173) % 1600}" cy="${200 + ((i * 97) % 420)}" r="${3 + (i % 3)}" fill="#fff6a8" opacity=".8"/><circle cx="${(i * 173) % 1600}" cy="${200 + ((i * 97) % 420)}" r="${12 + (i % 3) * 3}" fill="#fff6a8" opacity=".15"/>`).join('')}`,
  `<linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2f72"/><stop offset="1" stop-color="#8a6ad0"/></linearGradient>`),

  ice: () => wrap(`<rect width="1600" height="900" fill="url(#rg)"/>
    <g opacity=".7" fill="#e9f7ff">
      <rect x="640" y="200" width="320" height="300"/><rect x="600" y="140" width="70" height="360"/><rect x="930" y="140" width="70" height="360"/>
      <polygon points="600,140 635,50 670,140"/><polygon points="930,140 965,50 1000,140"/><rect x="760" y="120" width="80" height="120"/><polygon points="750,120 800,20 850,120"/>
    </g>
    ${icicle(80, 0, 1.2)}${icicle(170, 0, 0.8)}${icicle(260, 0, 1)}${icicle(1340, 0, 1)}${icicle(1430, 0, 1.3)}${icicle(1520, 0, 0.8)}
    <path d="M0 520 Q 400 440 800 500 T 1600 480 L1600 900 L0 900 Z" fill="#dff2ff"/>
    ${[[120, 560, 1.2], [1460, 540, 1.4], [340, 520, 0.7]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 L-40 -10 L-20 -150 L10 -180 L40 -40 L30 0Z" fill="#bfe3ff" stroke="#fff" stroke-width="4"/></g>`).join('')}
    <path d="M0 640 Q 400 590 800 630 T 1600 620 L1600 900 L0 900 Z" fill="#fff"/>
    ${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 131) % 1600}" cy="${(i * 71) % 620}" r="${2 + (i % 4)}" fill="#fff" opacity=".9"/>`).join('')}`,
  `<linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fc8ff"/><stop offset="1" stop-color="#e9f7ff"/></linearGradient>`),

  tower: () => wrap(`<rect width="1600" height="900" fill="url(#rg)"/>
    ${Array.from({ length: 50 }, (_, i) => `<circle cx="${(i * 137) % 1600}" cy="${(i * 53) % 500}" r="${1.5 + (i % 3)}" fill="#fff" opacity=".85"/>`).join('')}
    <circle cx="1300" cy="150" r="70" fill="#fff6c8"/><circle cx="1330" cy="130" r="64" fill="#5a3a8a"/>
    ${[120, 1480].map((x) => `<rect x="${x - 40}" y="160" width="80" height="480" fill="#8a6ad0"/><rect x="${x - 54}" y="140" width="108" height="30" rx="6" fill="#a98bff"/><rect x="${x - 54}" y="620" width="108" height="30" rx="6" fill="#a98bff"/>`).join('')}
    <path d="M200 180 Q800 80 1400 180" stroke="#ff8fc4" stroke-width="10" fill="none"/>
    ${[350, 560, 800, 1040, 1250].map((x, i) => `<path d="M${x} ${150 - Math.sin(((i + 0.5) / 5) * Math.PI) * 60} v40" stroke="#ff8fc4" stroke-width="4"/><path d="M${x - 14} ${190 - Math.sin(((i + 0.5) / 5) * Math.PI) * 60} h28 l-14 22Z" fill="#ffd36e"/>`).join('')}
    <rect y="640" width="1600" height="260" fill="#6a4aa8"/>
    <g opacity=".5">${Array.from({ length: 16 }, (_, i) => Array.from({ length: 4 }, (_, j) => ((i + j) % 2 ? `<rect x="${i * 100}" y="${640 + j * 65}" width="100" height="65" fill="#ff8fc4"/>` : '')).join('')).join('')}</g>
    ${cloud(260, 640, 1.2, 0.85)}${cloud(1340, 660, 1.3, 0.85)}`,
  `<linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1a5a"/><stop offset=".7" stop-color="#a86ad0"/><stop offset="1" stop-color="#ffb6d3"/></linearGradient>`),
};

export const regionBg = (id) => REGION_ART[id]();
