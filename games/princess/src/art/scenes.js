// 배경 그림들 (viewBox 1600x900, 화면을 꽉 채우도록 slice)
export const wrap = (inner, defs = '') =>
  `<svg class="bg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${inner}</svg>`;

export const cloud = (x, y, s = 1, op = 0.9) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity="${op}"><ellipse rx="110" ry="36"/><ellipse cx="60" cy="-20" rx="66" ry="42"/><ellipse cx="-52" cy="-16" rx="52" ry="32"/></g>`;

function tower(x, y, w, h, roof) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#cw)"/>
    <polygon points="${x - 10},${y} ${x + w / 2},${y - w * 1.25} ${x + w + 10},${y}" fill="${roof}"/>
    <path d="M${x + w / 2} ${y - w * 1.25} v-34" stroke="#c08a64" stroke-width="3"/><path d="M${x + w / 2} ${y - w * 1.25 - 34} l30 9 l-30 9Z" fill="#ff8fb5"/>
    <path d="M${x + w / 2 - 10} ${y + 46} a10 10 0 0 1 20 0 v26 h-20Z" fill="#8f8ee8" stroke="#fff" stroke-width="3"/>`;
}

// 동화 속 성 (타이틀·캐릭터 고르기 공통)
function castle(cx, base, s = 1) {
  return `<g transform="translate(${cx} ${base}) scale(${s}) translate(-300 -420)">
    ${tower(40, 140, 90, 280, '#a99bff')}${tower(470, 140, 90, 280, '#a99bff')}
    <rect x="110" y="230" width="380" height="190" fill="url(#cw)"/>
    ${Array.from({ length: 10 }, (_, i) => `<rect x="${112 + i * 38}" y="214" width="22" height="20" fill="url(#cw)"/>`).join('')}
    ${tower(240, 90, 120, 160, '#ff9cc4')}
    <path d="M262 420 v-80 a38 38 0 0 1 76 0 v80Z" fill="#e9a3c6"/><path d="M300 304 v116" stroke="#d58ab0" stroke-width="3"/>
    <circle cx="300" cy="190" r="22" fill="#fff6c8" stroke="#ffd864" stroke-width="4"/>
    ${[160, 420].map((x) => `<path d="M${x - 14} 320 a14 14 0 0 1 28 0 v30 h-28Z" fill="#8f8ee8" stroke="#fff" stroke-width="3"/>`).join('')}
    <path d="M110 300 Q300 260 490 300" stroke="#ffb3cf" stroke-width="6" fill="none"/>
    ${Array.from({ length: 8 }, (_, i) => `<circle cx="${130 + i * 48}" cy="${296 - Math.sin((i / 7) * Math.PI) * 18}" r="7" fill="${['#ff8fb5', '#ffd36e', '#9fdcff', '#b8f0c2'][i % 4]}"/>`).join('')}
  </g>`;
}

const castleDefs = `<linearGradient id="cw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#ffe0ee"/></linearGradient>`;

function flowers(list) {
  return list.map(([x, y, c, s = 1]) => `<g transform="translate(${x} ${y}) scale(${s})">${[0, 72, 144, 216, 288].map((d) =>
    `<circle cx="${(Math.cos((d * Math.PI) / 180) * 8).toFixed(1)}" cy="${(Math.sin((d * Math.PI) / 180) * 8).toFixed(1)}" r="7" fill="${c}"/>`).join('')}<circle r="5" fill="#ffd36e"/></g>`).join('');
}

export function titleBg() {
  return wrap(`
    <rect width="1600" height="900" fill="url(#tsky)"/>
    <circle cx="800" cy="380" r="560" fill="url(#tsun)"/>
    <path d="M260 640 A540 540 0 0 1 1340 640" stroke="url(#rb)" stroke-width="46" fill="none" opacity=".45"/>
    ${cloud(220, 180, 1.1)}${cloud(1380, 220, 1.2)}${cloud(560, 110, 0.7, 0.8)}${cloud(1120, 120, 0.6, 0.8)}
    ${castle(800, 640, 0.95)}
    <path d="M0 640 Q 400 560 800 620 T 1600 600 L1600 900 L0 900 Z" fill="#ffd2e6"/>
    <path d="M0 720 Q 420 650 820 700 T 1600 690 L1600 900 L0 900 Z" fill="#ffc0dc"/>
    <path d="M0 800 Q 400 760 800 790 T 1600 780 L1600 900 L0 900 Z" fill="#ffb0d2"/>
    ${flowers([[90, 760, '#fff'], [260, 820, '#ffe27a'], [420, 760, '#fff'], [1180, 750, '#fff'], [1340, 820, '#c9a8ff'], [1520, 760, '#fff'], [640, 840, '#fff', 0.8], [980, 850, '#ffe27a', 0.8]])}
  `, `${castleDefs}
    <linearGradient id="tsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9c4ff"/><stop offset=".45" stop-color="#ffd6ea"/><stop offset="1" stop-color="#fff3e2"/></linearGradient>
    <radialGradient id="tsun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <linearGradient id="rb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a9a"/><stop offset=".33" stop-color="#ffd36e"/><stop offset=".66" stop-color="#9fe0a0"/><stop offset="1" stop-color="#8fb8ff"/></linearGradient>`);
}

export function selectBg() {
  return wrap(`
    <rect width="1600" height="900" fill="url(#ssky)"/>
    <circle cx="800" cy="420" r="520" fill="url(#ssun)"/>
    ${cloud(200, 170)}${cloud(1380, 210, 1.1)}
    <g opacity=".55">${castle(800, 760, 0.8)}</g>
    <path d="M0 760 Q 400 690 800 740 T 1600 720 L1600 900 L0 900 Z" fill="#ffd2e6"/>
    <path d="M0 810 Q 400 760 800 800 T 1600 790 L1600 900 L0 900 Z" fill="#ffc0dc"/>
  `, `${castleDefs}
    <linearGradient id="ssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd6ea"/><stop offset=".55" stop-color="#ffeef6"/><stop offset="1" stop-color="#fff7e6"/></linearGradient>
    <radialGradient id="ssun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`);
}

// 공주의 방. 창밖 풍경이 계절마다 바뀐다.
const WINDOW_VIEW = {
  spring: {
    sky: ['#ffc6e0', '#fff2f8'],
    view: `<circle cx="190" cy="100" r="34" fill="#fff6c8" opacity=".9"/>
      <path d="M-10 60 Q60 80 110 50 Q150 30 200 40" stroke="#a8704b" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M70 66 Q90 100 80 130" stroke="#a8704b" stroke-width="5" fill="none" stroke-linecap="round"/>
      ${[[20, 62], [50, 72], [90, 56], [130, 40], [170, 38], [78, 98], [84, 128], [112, 66], [150, 52]].map(([x, y]) =>
        `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((d) => `<circle cx="${(Math.cos((d * Math.PI) / 180) * 7).toFixed(1)}" cy="${(Math.sin((d * Math.PI) / 180) * 7).toFixed(1)}" r="6.5" fill="#ffb6d3"/>`).join('')}<circle r="4" fill="#ff7fae"/></g>`).join('')}
      <path d="M0 330 Q130 290 260 320 L260 340 L0 340Z" fill="#b6ebb4"/>`,
  },
  summer: {
    sky: ['#7fc8ff', '#e6f7ff'],
    view: `<circle cx="180" cy="90" r="36" fill="#fff3a0"/>
      <g stroke="#fff3a0" stroke-width="5" stroke-linecap="round">${Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4; return `<path d="M${180 + Math.cos(a) * 46} ${90 + Math.sin(a) * 46} L${180 + Math.cos(a) * 60} ${90 + Math.sin(a) * 60}"/>`;
      }).join('')}</g>
      ${cloud(70, 190, 0.5)}${cloud(200, 250, 0.35)}
      <path d="M0 320 Q130 280 260 310 L260 340 L0 340Z" fill="#8fd59a"/>
      ${[[40, 312], [110, 300], [200, 306]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#ffd36e"/><circle cx="${x}" cy="${y}" r="3" fill="#ff9f5a"/>`).join('')}`,
  },
  autumn: {
    sky: ['#ffa98a', '#ffe7c4'],
    view: `<circle cx="70" cy="230" r="40" fill="#ffd27a" opacity=".85"/>
      <rect x="168" y="190" width="18" height="150" fill="#a8704b"/>
      <circle cx="177" cy="160" r="70" fill="#f08a4b"/><circle cx="130" cy="190" r="44" fill="#ffb347"/><circle cx="220" cy="186" r="46" fill="#e8613c"/><circle cx="170" cy="110" r="40" fill="#ffc35a"/>
      <path d="M0 320 Q130 290 260 316 L260 340 L0 340Z" fill="#e8b46a"/>`,
  },
  winter: {
    sky: ['#8f8ee8', '#f3b7da'],
    view: `<circle cx="190" cy="90" r="30" fill="#fff6c8"/><circle cx="204" cy="80" r="28" fill="#9b98ea"/>
      <g fill="#fff"><circle cx="60" cy="120" r="3"/><circle cx="120" cy="70" r="2.5"/><circle cx="90" cy="200" r="2"/><circle cx="210" cy="190" r="3"/><circle cx="160" cy="250" r="2"/><circle cx="40" cy="260" r="2.5"/></g>
      <path d="M0 316 Q130 286 260 312 L260 340 L0 340Z" fill="#fff"/>`,
  },
};

export function room(season = 'spring') {
  const w = WINDOW_VIEW[season];
  const snowSill = season === 'winter' ? '<path d="M-24 338 Q30 322 80 334 Q140 318 200 332 Q250 320 284 336 L284 342 L-24 342Z" fill="#fff"/>' : '';
  return wrap(`
    <rect width="1600" height="900" fill="url(#wall)"/>
    <rect width="1600" height="640" fill="url(#stripe)"/>
    <path d="M0 110 Q 400 190 800 120 T 1600 120" stroke="#e27aa9" stroke-width="3" fill="none"/>
    ${[[60, 128, '#ffd36e'], [160, 146, '#9fdcff'], [260, 158, '#ffa7c9'], [360, 162, '#b8f0c2'], [460, 158, '#d8b8ff'], [560, 148, '#ffd36e'], [660, 134, '#9fdcff']].map(([x, y, c]) =>
      `<polygon points="${x},${y} ${x + 40},${y + 6} ${x + 16},${y + 52}" fill="${c}"/>`).join('')}
    <g transform="translate(420 170)">
      <clipPath id="win"><path d="M0 340 L0 130 A 130 130 0 0 1 260 130 L260 340 Z"/></clipPath>
      <g clip-path="url(#win)"><rect x="-10" y="-10" width="280" height="360" fill="url(#wsky)"/>${w.view}</g>
      <path d="M0 340 L0 130 A 130 130 0 0 1 260 130 L260 340 Z" fill="none" stroke="#fff" stroke-width="16"/>
      <path d="M130 0 L130 340 M0 200 L260 200" stroke="#fff" stroke-width="9"/>
      <rect x="-24" y="336" width="308" height="22" rx="8" fill="#fff"/>${snowSill}
      <path d="M40 336 L48 300 L92 300 L100 336 Z" fill="#f59ac0"/><circle cx="60" cy="286" r="16" fill="#ff7fa8"/><circle cx="82" cy="282" r="14" fill="#ffd36e"/><circle cx="70" cy="270" r="13" fill="#ffa7c9"/>
    </g>
    <path d="M360 140 Q 380 330 340 560 L430 560 Q 400 380 440 210 Q 420 160 440 140 Z" fill="url(#curtain)"/>
    <path d="M740 140 Q 720 330 760 560 L670 560 Q 700 380 660 210 Q 680 160 660 140 Z" fill="url(#curtain)"/>
    <rect x="330" y="128" width="440" height="18" rx="9" fill="#e9a943"/>
    <circle cx="330" cy="137" r="14" fill="#ffd36e"/><circle cx="770" cy="137" r="14" fill="#ffd36e"/>
    <circle cx="392" cy="390" r="12" fill="#ffd36e"/><circle cx="708" cy="390" r="12" fill="#ffd36e"/>
    <g transform="translate(1000 330)">
      <rect x="0" y="0" width="200" height="270" rx="10" fill="#fff" stroke="#f3a9c9" stroke-width="5"/>
      ${[60, 130, 200].map((y) => `<rect x="10" y="${y}" width="180" height="8" fill="#f3a9c9"/>`).join('')}
      ${[['#ff9fc4', 20, 18, 42], ['#9fdcff', 46, 24, 36], ['#ffd36e', 74, 16, 42], ['#b8f0c2', 94, 22, 30], ['#d8b8ff', 20, 92, 38], ['#ff9fc4', 44, 94, 36], ['#9fdcff', 130, 88, 42]].map(([c, x, y, h]) =>
        `<rect x="${x}" y="${y + (42 - h)}" width="20" height="${h}" rx="3" fill="${c}"/>`).join('')}
      <circle cx="150" cy="40" r="16" fill="#ffd1ea"/><path d="M140 170 h40 v28 h-40Z" fill="#ffe28a"/><circle cx="60" cy="176" r="18" fill="#c9a8ff"/>
    </g>
    <rect y="600" width="1600" height="60" fill="#fff" opacity=".7"/>
    <rect y="596" width="1600" height="8" fill="#f3a9c9"/>
    <rect y="660" width="1600" height="240" fill="url(#floor)"/>
    <g stroke="#e090b6" stroke-width="2" opacity=".6"><path d="M0 720 H1600 M0 790 H1600 M0 860 H1600"/></g>
    <ellipse cx="450" cy="790" rx="420" ry="80" fill="url(#rug)"/>
    <ellipse cx="450" cy="790" rx="380" ry="64" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round"/>
    <g transform="translate(160 0)">
      <path d="M0 0 V70" stroke="#e9a943" stroke-width="4"/>
      <path d="M-70 80 Q 0 130 70 80" stroke="#e9a943" stroke-width="6" fill="none"/>
      <g fill="#fff6c8"><ellipse cx="-70" cy="70" rx="8" ry="14"/><ellipse cx="0" cy="98" rx="8" ry="14"/><ellipse cx="70" cy="70" rx="8" ry="14"/></g>
      <g fill="#ffd1ea"><circle cx="-40" cy="112" r="6"/><circle cx="0" cy="124" r="7"/><circle cx="40" cy="112" r="6"/></g>
    </g>
  `, `<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe4f0"/><stop offset="1" stop-color="#ffd3e6"/></linearGradient>
    <pattern id="stripe" width="64" height="64" patternUnits="userSpaceOnUse"><rect width="32" height="64" fill="#fff" opacity=".35"/>
      <path d="M48 26 c-3 -5 -10 -3 -8 3 c1 3 8 8 8 8 s7 -5 8 -8 c2 -6 -5 -8 -8 -3z" fill="#ffb6d3" opacity=".55"/></pattern>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6c1d8"/><stop offset="1" stop-color="#e79fc1"/></linearGradient>
    <linearGradient id="wsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${w.sky[0]}"/><stop offset="1" stop-color="${w.sky[1]}"/></linearGradient>
    <linearGradient id="curtain" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff9cc4"/><stop offset=".5" stop-color="#ffc2dc"/><stop offset="1" stop-color="#f77fb2"/></linearGradient>
    <radialGradient id="rug" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6fb"/><stop offset=".75" stop-color="#ffd9ea"/><stop offset="1" stop-color="#f7b2d0"/></radialGradient>`);
}

// 계절 입자(꽃잎/햇살/낙엽/눈)
export function particles(season, n = 16) {
  const shape = {
    spring: () => `<svg width="16" height="12"><ellipse cx="8" cy="6" rx="7" ry="4.5" fill="#ffb6d3"/></svg>`,
    summer: () => `<svg width="14" height="14"><path d="M7 0 L8.5 5.5 L14 7 L8.5 8.5 L7 14 L5.5 8.5 L0 7 L5.5 5.5Z" fill="#fff6a8"/></svg>`,
    autumn: () => `<svg width="18" height="18"><path d="M9 1 L11 6 L16 5 L13 9 L17 12 L11 12 L9 17 L7 12 L1 12 L5 9 L2 5 L7 6Z" fill="${Math.random() < 0.5 ? '#f08a4b' : '#ffc35a'}"/></svg>`,
    winter: () => `<svg width="12" height="12"><circle cx="6" cy="6" r="${3 + Math.random() * 3}" fill="#fff"/></svg>`,
  }[season];
  return `<div class="particles ${season}">${Array.from({ length: n }, () =>
    `<i style="left:${(Math.random() * 100).toFixed(1)}%;animation-duration:${(7 + Math.random() * 7).toFixed(1)}s;animation-delay:${(-Math.random() * 14).toFixed(1)}s;--dx:${Math.round(Math.random() * 160 - 60)}px">${shape()}</i>`).join('')}</div>`;
}

export const CROWN_SVG = `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3a8"/><stop offset="1" stop-color="#f2b632"/></linearGradient></defs>
  <path d="M10 70 L6 22 L34 44 L60 8 L86 44 L114 22 L110 70Z" fill="url(#cg)" stroke="#e6a92a" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="60" cy="8" r="7" fill="#ff6fa5" stroke="#fff" stroke-width="2"/><circle cx="6" cy="22" r="5" fill="#7fd0ff" stroke="#fff" stroke-width="2"/><circle cx="114" cy="22" r="5" fill="#7fd0ff" stroke="#fff" stroke-width="2"/>
  <ellipse cx="60" cy="54" rx="9" ry="10" fill="#ff6fa5" stroke="#fff" stroke-width="2"/><circle cx="32" cy="58" r="5" fill="#9fe0a0"/><circle cx="88" cy="58" r="5" fill="#9fe0a0"/>
</svg>`;
