// 활동 장면 배경 (공부·알바·휴식 12종). 벽/바닥 색 + 소품
import { wrap, cloud } from './scenes.js';

const shelf = (x, y, cols) => `<rect x="${x}" y="${y}" width="230" height="300" rx="10" fill="#fff8f0" stroke="#d8a77c" stroke-width="6"/>
  ${[0, 1, 2].map((r) => `<rect x="${x + 6}" y="${y + 92 + r * 96}" width="218" height="8" fill="#d8a77c"/>
    ${Array.from({ length: 7 }, (_, i) => `<rect x="${x + 14 + i * 29}" y="${y + 22 + r * 96 + (i % 3) * 6}" width="22" height="${70 - (i % 3) * 6}" rx="3" fill="${cols[(i + r) % cols.length]}"/>`).join('')}`).join('')}`;
const bread = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="34" ry="20" fill="#e8a660"/><path d="M-20 -8 q6 10 0 18 M-4 -12 q6 12 0 22 M12 -10 q6 10 0 18" stroke="#fff3d6" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
const bloom = (x, y, c, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${[0, 72, 144, 216, 288].map((d) => `<circle cx="${(Math.cos((d * Math.PI) / 180) * 9).toFixed(1)}" cy="${(Math.sin((d * Math.PI) / 180) * 9).toFixed(1)}" r="8" fill="${c}"/>`).join('')}<circle r="6" fill="#ffd36e"/></g>`;
const tree = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-12" y="-10" width="24" height="110" rx="8" fill="#c08a64"/><circle cy="-60" r="70" fill="#7fd08e"/><circle cx="-44" cy="-26" r="48" fill="#6cc485"/><circle cx="46" cy="-30" r="50" fill="#8ad99a"/></g>`;
const sparkle = (x, y, c = '#fff6a8') => `<path d="M${x} ${y} l6 -16 l6 16 l16 6 l-16 6 l-6 16 l-6 -16 l-16 -6Z" fill="${c}" opacity=".85"/>`;

const SCENES = {
  sword: {
    wall: ['#bfe6ff', '#e9f7ff'], floor: '#9fdc9a',
    props: `${tree(1300, 520, 1.1)}${tree(220, 540, 0.9)}
      <path d="M0 600 H1600" stroke="#c08a64" stroke-width="10"/>${Array.from({ length: 16 }, (_, i) => `<rect x="${i * 100 + 20}" y="540" width="16" height="80" rx="4" fill="#d8a77c"/>`).join('')}
      <g transform="translate(1120 560)"><rect x="-6" y="0" width="12" height="160" fill="#a8704b"/><rect x="-70" y="30" width="140" height="12" rx="6" fill="#a8704b"/>
        <ellipse cy="60" rx="46" ry="70" fill="#f2d27a"/><circle cy="-30" r="40" fill="#f2d27a"/><circle cx="-12" cy="-34" r="5" fill="#7a4a36"/><circle cx="14" cy="-34" r="5" fill="#7a4a36"/>
        <path d="M-30 50 h60 M-30 80 h60" stroke="#d8a77c" stroke-width="5"/></g>`,
  },
  magic: {
    wall: ['#5a4aa8', '#9b84e8'], floor: '#7b62c8',
    props: `${shelf(1230, 260, ['#ffd36e', '#9fdcff', '#ffa7c9', '#b8f0c2'])}
      <ellipse cx="560" cy="780" rx="330" ry="70" fill="none" stroke="#fff6a8" stroke-width="6" opacity=".8"/>
      <ellipse cx="560" cy="780" rx="260" ry="52" fill="none" stroke="#fff6a8" stroke-width="3" stroke-dasharray="14 10" opacity=".7"/>
      ${Array.from({ length: 14 }, (_, i) => sparkle(120 + i * 105, 120 + (i % 4) * 70)).join('')}`,
  },
  manners: {
    wall: ['#ffe4f0', '#ffd3e6'], floor: '#f0b9d0',
    props: `<g transform="translate(1180 560)"><ellipse rx="190" ry="40" fill="#fff" stroke="#f3a9c9" stroke-width="5"/><rect x="-14" y="10" width="28" height="160" fill="#e9a3c6"/>
      <path d="M-60 -20 q0 -50 40 -50 q40 0 40 50Z" fill="#fff" stroke="#f3a9c9" stroke-width="4"/><path d="M20 -40 q30 -10 26 20" stroke="#f3a9c9" stroke-width="4" fill="none"/><circle cx="-20" cy="-74" r="8" fill="#ff8fb5"/>
      <path d="M60 -16 h50 v-26 h-50Z" fill="#fff" stroke="#f3a9c9" stroke-width="4"/><path d="M110 -34 q16 0 12 14" stroke="#f3a9c9" stroke-width="4" fill="none"/>
      <path d="M-150 -12 q30 -30 60 0Z" fill="#ffd36e"/><circle cx="-120" cy="-30" r="8" fill="#ff7fa8"/></g>`,
  },
  school: {
    wall: ['#fff3d6', '#ffe6b8'], floor: '#e8c49a',
    props: `<rect x="980" y="180" width="480" height="300" rx="14" fill="#3f7a5a" stroke="#a8704b" stroke-width="14"/>
      <text x="1040" y="290" font-family="Jua" font-size="64" fill="#fff">1 + 1 = 2</text><text x="1040" y="390" font-family="Jua" font-size="54" fill="#ffd36e">가 나 다 ★</text>
      <g transform="translate(1180 640)"><rect x="-150" y="0" width="300" height="20" rx="6" fill="#d8a77c"/><rect x="-140" y="20" width="14" height="120" fill="#a8704b"/><rect x="126" y="20" width="14" height="120" fill="#a8704b"/>
        <rect x="-80" y="-24" width="70" height="26" rx="3" fill="#9fdcff"/><rect x="10" y="-14" width="60" height="16" rx="3" fill="#ffa7c9"/></g>`,
  },
  dance: {
    wall: ['#7a3d8a', '#d06fb0'], floor: '#b98a5a',
    props: `<polygon points="360,0 760,0 900,900 220,900" fill="#fff6c8" opacity=".25"/>
      <path d="M0 0 Q160 300 60 900 L0 900Z M1600 0 Q1440 300 1540 900 L1600 900Z" fill="#e8436f"/>
      <path d="M0 0 H1600 V80 Q1200 140 800 90 Q400 140 0 80Z" fill="#c9305a"/>
      ${Array.from({ length: 9 }, (_, i) => `<circle cx="${240 + i * 140}" cy="840" r="${10 + (i % 3) * 3}" fill="${['#ff8fb5', '#ffd36e', '#9fdcff'][i % 3]}"/>`).join('')}`,
  },
  bakery: {
    wall: ['#ffe6c4', '#ffd8a8'], floor: '#c9905e',
    props: `<rect x="1060" y="200" width="420" height="380" rx="12" fill="#fff8f0" stroke="#c08a64" stroke-width="8"/>
      ${[300, 420, 540].map((y) => `<rect x="1068" y="${y}" width="404" height="10" fill="#c08a64"/>`).join('')}
      ${[[1130, 280], [1220, 280], [1310, 280], [1400, 280], [1150, 400], [1260, 400], [1370, 400], [1180, 520], [1320, 520]].map(([x, y]) => bread(x, y, 0.9)).join('')}
      <g transform="translate(1250 760)"><path d="M-200 -40 h400 v80 h-400Z" fill="#fff" stroke="#c08a64" stroke-width="5"/>${bread(-100, -50, 0.8)}${bread(20, -50, 0.8)}${bread(130, -50, 0.8)}</g>`,
  },
  florist: {
    wall: ['#e6fbea', '#c9f2c0'], floor: '#a8d89a',
    props: [[1080, 620], [1220, 640], [1360, 620], [1490, 640]].map(([x, y], i) =>
      `<path d="M${x - 50} ${y} h100 l-14 120 h-72Z" fill="${['#ffb6d3', '#9fdcff', '#ffd36e', '#d8b8ff'][i]}"/>
      ${[-30, 0, 30].map((dx, j) => `<path d="M${x + dx} ${y} v-80" stroke="#5fae5f" stroke-width="5"/>${bloom(x + dx, y - 90 - j * 8, ['#ff7fa8', '#fff', '#ffd36e', '#c9a8ff', '#ff9f5a'][(i + j) % 5], 1.1)}`).join('')}`).join('')
      + `${[[160, 300], [320, 220], [1300, 160]].map(([x, y]) => bloom(x, y, '#fff', 1.4)).join('')}`,
  },
  library: {
    wall: ['#f3e2c8', '#e8cfa8'], floor: '#b9875a',
    props: `${shelf(1000, 200, ['#ff9fc4', '#9fdcff', '#ffd36e', '#b8f0c2', '#d8b8ff'])}${shelf(1260, 200, ['#d8b8ff', '#ffd36e', '#ff9fc4', '#9fdcff'])}${shelf(60, 200, ['#9fdcff', '#ffd36e', '#ff9fc4'])}`,
  },
  cleaning: {
    wall: ['#eef0ff', '#dfe4ff'], floor: '#f4f4ff',
    props: `<g opacity=".5">${Array.from({ length: 12 }, (_, i) => Array.from({ length: 4 }, (_, j) => ((i + j) % 2 ? `<rect x="${i * 140}" y="${660 + j * 60}" width="140" height="60" fill="#c9cdf0"/>` : '')).join('')).join('')}</g>
      ${[200, 1400].map((x) => `<rect x="${x - 40}" y="80" width="80" height="560" fill="#fff" stroke="#c9cdf0" stroke-width="5"/>`).join('')}
      <g transform="translate(1150 640)"><path d="M-50 0 h100 l-12 90 h-76Z" fill="#7fb8ff"/><ellipse rx="50" ry="12" fill="#bfe3ff"/>
        <circle cx="-20" cy="-20" r="10" fill="#fff" opacity=".8"/><circle cx="10" cy="-34" r="7" fill="#fff" opacity=".8"/><circle cx="30" cy="-16" r="9" fill="#fff" opacity=".8"/></g>
      ${sparkle(900, 700, '#fff')}${sparkle(1300, 760, '#fff')}${sparkle(1000, 820, '#fff')}`,
  },
  hunter: {
    wall: ['#cdeccb', '#e9f7ff'], floor: '#8fd59a',
    props: `${tree(180, 560, 1.2)}${tree(1420, 540, 1.3)}${tree(1250, 600, 0.8)}
      <g transform="translate(1050 640)"><rect x="-70" y="0" width="140" height="100" rx="8" fill="#c08a64"/><path d="M-70 30 h140 M-70 60 h140" stroke="#a8704b" stroke-width="5"/>
        <rect x="40" y="-60" width="110" height="60" rx="6" fill="#d8a77c"/></g>`,
  },
  rest: {
    wall: ['#5a5aa8', '#a99be8'], floor: '#7b6cc0',
    props: `<g transform="translate(1000 520)"><rect width="520" height="190" rx="30" fill="#fff"/><rect y="-120" width="40" height="300" rx="16" fill="#e9a3c6"/><rect x="480" y="-60" width="40" height="240" rx="16" fill="#e9a3c6"/>
        <path d="M40 60 h440 v80 h-440Z" fill="#ffb6d3"/><ellipse cx="110" cy="40" rx="64" ry="34" fill="#fff" stroke="#f3a9c9" stroke-width="4"/></g>
      <circle cx="300" cy="200" r="60" fill="#fff6c8"/><circle cx="330" cy="180" r="56" fill="#6f6ab8"/>
      ${Array.from({ length: 10 }, (_, i) => `<circle cx="${120 + i * 150}" cy="${80 + (i % 3) * 90}" r="3" fill="#fff"/>`).join('')}
      <text x="1260" y="440" font-family="Jua" font-size="60" fill="#fff" opacity=".85">Z z z</text>`,
  },
  picnic: {
    wall: ['#9fdcff', '#e9f7ff'], floor: '#9fdc9a',
    props: `${cloud(300, 180, 1)}${cloud(1300, 140, 0.8)}<circle cx="1450" cy="210" r="60" fill="#fff3a0"/>
      <g transform="translate(1150 720)"><path d="M-220 -40 L220 -40 L260 60 L-260 60Z" fill="#fff"/>
        ${[-180, -90, 0, 90, 180].map((x) => `<path d="M${x} -40 l${x / 4.5} 100" stroke="#ff8fb5" stroke-width="22" opacity=".7"/>`).join('')}
        <g transform="translate(-120 -70)"><path d="M-50 0 h100 l-10 60 h-80Z" fill="#d8a77c"/><path d="M-40 0 q40 -60 80 0" stroke="#a8704b" stroke-width="6" fill="none"/></g>${bread(60, -50, 0.6)}</g>
      ${[[400, 520], [1500, 600], [700, 460]].map(([x, y]) => `<g transform="translate(${x} ${y})"><ellipse cx="-10" rx="12" ry="8" fill="#ffb6d3"/><ellipse cx="10" rx="12" ry="8" fill="#ffb6d3"/><rect x="-2" y="-8" width="4" height="16" rx="2" fill="#7a4a36"/></g>`).join('')}`,
  },
};

export function activityScene(id) {
  const sc = SCENES[id];
  return wrap(`<rect width="1600" height="900" fill="url(#aw)"/>
    <rect y="640" width="1600" height="260" fill="${sc.floor}"/><rect y="636" width="1600" height="8" fill="#fff" opacity=".6"/>
    ${sc.props}
    <ellipse cx="560" cy="800" rx="260" ry="46" fill="#fff" opacity=".35"/>`,
  `<linearGradient id="aw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sc.wall[0]}"/><stop offset="1" stop-color="${sc.wall[1]}"/></linearGradient>`);
}

// 활동할 때 공주가 잠깐 바꿔 입는 모습
export const ACT_LOOK = {
  sword: { weapon: 'wood', mood: 'smile' },
  magic: { weapon: 'starwand', hat: 'witch', mood: 'joy' },
  manners: { hat: 'tiara', mood: 'smile' },
  school: { mood: 'smile' },
  dance: { outfit: 'ballgown', mood: 'joy' },
  bakery: { mood: 'joy' },
  florist: { hat: 'flower', mood: 'joy' },
  library: { mood: 'smile' },
  cleaning: { mood: 'smile' },
  hunter: { mood: 'smile' },
  rest: { mood: 'joy' },
  picnic: { hat: 'flower', mood: 'joy' },
};
