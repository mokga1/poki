// 엔딩 배경 + 별빛 축제 밤 배경
import { wrap, cloud, castle, castleDefs } from './scenes.js';
import { activityScene } from './activityScenes.js';

const firework = (x, y, r, c) => `<g transform="translate(${x} ${y})">${Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  return `<path d="M${(Math.cos(a) * r * 0.3).toFixed(1)} ${(Math.sin(a) * r * 0.3).toFixed(1)} L${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}" stroke="${c}" stroke-width="5" stroke-linecap="round"/><circle cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(Math.sin(a) * r).toFixed(1)}" r="5" fill="#fff"/>`;
}).join('')}</g>`;
const stars = (n, h = 500) => Array.from({ length: n }, (_, i) => `<circle cx="${(i * 137) % 1600}" cy="${(i * 61) % h}" r="${1.5 + (i % 3)}" fill="#fff" opacity=".85"/>`).join('');
const flowers = (list) => list.map(([x, y, c]) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((d) =>
  `<circle cx="${(Math.cos((d * Math.PI) / 180) * 9).toFixed(1)}" cy="${(Math.sin((d * Math.PI) / 180) * 9).toFixed(1)}" r="8" fill="${c}"/>`).join('')}<circle r="6" fill="#ffd36e"/></g>`).join('');
const meadowFlowers = flowers(Array.from({ length: 18 }, (_, i) => [60 + i * 90, 700 + ((i * 53) % 160), ['#fff', '#ffb6d3', '#ffd36e', '#c9a8ff'][i % 4]]));

export function festivalBg(lit) {
  return wrap(`<rect width="1600" height="900" fill="url(#fz)"/>${stars(60)}
    ${lit ? `${firework(300, 200, 90, '#ff8fc4')}${firework(1250, 160, 110, '#ffd36e')}${firework(820, 110, 70, '#9fdcff')}${firework(560, 300, 60, '#c9a8ff')}` : `${cloud(400, 160, 1.2, 0.5)}${cloud(1200, 200, 1.4, 0.5)}`}
    <g opacity="${lit ? 1 : 0.7}">${castle(800, 720, 0.9)}</g>
    <path d="M0 700 Q400 650 800 690 T1600 680 L1600 900 L0 900Z" fill="#6a4aa8"/>
    <path d="M0 640 Q800 560 1600 640" stroke="#ffd36e" stroke-width="3" fill="none"/>
    ${Array.from({ length: 12 }, (_, i) => `<g transform="translate(${70 + i * 132} ${612 - Math.sin((i / 11) * Math.PI) * 50})"><ellipse rx="16" ry="20" fill="${['#ff8fc4', '#ffd36e', '#9fdcff'][i % 3]}"/><ellipse rx="16" ry="20" fill="#fff" opacity=".3"/></g>`).join('')}`,
  `${castleDefs}<linearGradient id="fz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lit ? '#2a1a6a' : '#4a4a6a'}"/><stop offset="1" stop-color="${lit ? '#d06fb0' : '#9a8aa8'}"/></linearGradient>`);
}

const SCENES = {
  throne: () => wrap(`<rect width="1600" height="900" fill="url(#tz)"/>
    ${[200, 500, 1100, 1400].map((x) => `<rect x="${x - 40}" y="60" width="80" height="600" fill="#fff" opacity=".7"/><rect x="${x - 54}" y="40" width="108" height="30" rx="8" fill="#ffd864"/>`).join('')}
    <path d="M700 0 h200 v660 h-200Z" fill="#e8436f" opacity=".8"/><path d="M700 660 L800 700 L900 660" fill="#e8436f" opacity=".8"/>
    <g transform="translate(800 420)"><path d="M-110 240 v-260 q0 -90 110 -110 q110 20 110 110 v260Z" fill="#ffd864" stroke="#e6a92a" stroke-width="8"/>
      <path d="M-80 240 v-220 q0 -60 80 -80 q80 20 80 80 v220Z" fill="#ff8fc4"/><circle cy="-150" r="22" fill="#ff6fa5" stroke="#fff" stroke-width="5"/></g>
    <rect y="660" width="1600" height="240" fill="#f6c9e0"/><path d="M640 900 L760 660 H840 L960 900Z" fill="#e8436f"/>
    ${stars(20, 300)}`,
  `<linearGradient id="tz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe8f3"/><stop offset="1" stop-color="#ffc8e0"/></linearGradient>`),

  ballroom: () => wrap(`<rect width="1600" height="900" fill="url(#bz)"/>
    ${[160, 560, 1040, 1440].map((x) => `<g transform="translate(${x} 0)"><path d="M0 0 V70" stroke="#ffd864" stroke-width="4"/><path d="M-70 80 Q0 130 70 80" stroke="#ffd864" stroke-width="6" fill="none"/>
      <g fill="#fff6c8"><ellipse cx="-70" cy="70" rx="8" ry="14"/><ellipse cy="98" rx="8" ry="14"/><ellipse cx="70" cy="70" rx="8" ry="14"/></g><circle cy="110" r="60" fill="#fff6c8" opacity=".15"/></g>`).join('')}
    <rect y="620" width="1600" height="280" fill="url(#bf)"/>
    <g opacity=".35">${Array.from({ length: 16 }, (_, i) => Array.from({ length: 5 }, (_, j) => ((i + j) % 2 ? `<rect x="${i * 100}" y="${620 + j * 56}" width="100" height="56" fill="#fff"/>` : '')).join('')).join('')}</g>
    ${stars(30, 560)}`,
  `<linearGradient id="bz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a3d8a"/><stop offset="1" stop-color="#e88ac8"/></linearGradient>
   <linearGradient id="bf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2c4e0"/><stop offset="1" stop-color="#d88ab8"/></linearGradient>`),

  hero: () => wrap(`<rect width="1600" height="900" fill="url(#hz)"/>${cloud(300, 160, 1.2)}${cloud(1300, 120, 1)}
    <path d="M0 640 Q500 420 1000 560 T1600 520 L1600 900 L0 900Z" fill="#9fdc9a"/>
    <g transform="translate(1180 470)"><rect x="-5" y="-260" width="10" height="270" fill="#c08a64"/><path d="M5 -255 h150 l-30 45 l30 45 h-150Z" fill="#ff8fc4"/>
      <path d="M60 -230 c-6 -10 -20 -6 -16 4 c3 7 16 15 16 15 s13 -8 16 -15 c4 -10 -10 -14 -16 -4z" fill="#fff"/></g>
    <path d="M0 740 Q600 680 1600 740 L1600 900 L0 900Z" fill="#7fc88a"/>${meadowFlowers}`,
  `<linearGradient id="hz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd1a8"/><stop offset=".6" stop-color="#ffeedd"/><stop offset="1" stop-color="#fff8ee"/></linearGradient>`),

  peace: () => wrap(`<rect width="1600" height="900" fill="url(#pz)"/>
    <path d="M200 680 A600 600 0 0 1 1400 680" stroke="url(#prb)" stroke-width="50" fill="none" opacity=".5"/>
    ${cloud(260, 180, 1.1)}${cloud(1340, 220, 1.2)}
    <path d="M0 600 Q400 540 800 590 T1600 570 L1600 900 L0 900Z" fill="#b6ebb4"/>
    <path d="M0 720 Q500 670 1600 720 L1600 900 L0 900Z" fill="#9fdc9a"/>${meadowFlowers}`,
  `<linearGradient id="pz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9c4ff"/><stop offset="1" stop-color="#ffe6f1"/></linearGradient>
   <linearGradient id="prb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a9a"/><stop offset=".33" stop-color="#ffd36e"/><stop offset=".66" stop-color="#9fe0a0"/><stop offset="1" stop-color="#8fb8ff"/></linearGradient>`),

  field: () => wrap(`<rect width="1600" height="900" fill="url(#fdz)"/><circle cx="1300" cy="200" r="70" fill="#fff6c8"/>${cloud(300, 160)}${cloud(900, 120, 0.7)}
    <path d="M0 620 Q400 540 800 600 T1600 580 L1600 900 L0 900Z" fill="#b6ebb4"/>
    <path d="M0 730 Q600 680 1600 730 L1600 900 L0 900Z" fill="#9fdc9a"/>${meadowFlowers}`,
  `<linearGradient id="fdz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fdcff"/><stop offset="1" stop-color="#fff2f8"/></linearGradient>`),

  magic: () => activityScene('magic'),
  library: () => activityScene('library'),
  bakery: () => activityScene('bakery'),
  flower: () => activityScene('florist'),
};

export const endingBg = (scene) => SCENES[scene]();
