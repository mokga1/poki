// 공주 SD 캐릭터 SVG. viewBox 0 0 300 420.
// avatar(stateOrCharacter, prefix?, { equip, mood }) → svg 문자열
// 레이어: 뒤 장식(망토·날개) → 뒷머리 → 다리 → 치마 → 상의 → 무기 → 팔 → 소매 → 목걸이 → 얼굴 → 앞머리 → 모자·핀
import { CHARACTERS } from '../data/characters.js';

const SKIN = '#ffe1d2';
let uid = 0;

export function avatar(src, prefix = 'av', opts = {}) {
  const c = src.charId ? CHARACTERS[src.charId] : src;
  const eq = { weapon: null, outfit: 'apron', hat: null, acc: null, ...(src.charId ? src.equip : {}), ...(opts.equip || {}) };
  const id = `${prefix}${++uid}`;
  const [h1, h2] = c.hair, [e1, e2] = c.eye, [d1, d2] = c.dress;
  const o = OUTFITS[eq.outfit || 'apron'](id, d1, d2);

  return `<svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${h1}"/><stop offset="1" stop-color="${h2}"/></linearGradient>
    <linearGradient id="${id}i" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${e1}"/><stop offset="1" stop-color="${e2}"/></linearGradient>
    <linearGradient id="${id}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${d1}"/><stop offset="1" stop-color="${d2}"/></linearGradient>
    <radialGradient id="${id}s" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="#fff3ec"/><stop offset="1" stop-color="#ffd8c6"/></radialGradient>
    <linearGradient id="${id}silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#aebbd6"/></linearGradient>
    <linearGradient id="${id}gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3a8"/><stop offset="1" stop-color="#f2b632"/></linearGradient>
    ${o.defs || ''}
  </defs>
  <ellipse cx="150" cy="398" rx="72" ry="12" fill="#c2577f" opacity=".18"/>
  ${ACC_BACK[eq.acc]?.(id) || ''}
  ${backHair(c.style, id)}
  ${legs(o)}
  ${o.skirt}
  <rect x="142" y="196" width="16" height="22" fill="${SKIN}"/>
  ${o.top}
  ${WEAPONS[eq.weapon]?.(id) || ''}
  <path d="M114 230 Q102 258 106 286" stroke="${SKIN}" stroke-width="14" fill="none" stroke-linecap="round"/>
  <path d="M186 230 Q198 258 204 286" stroke="${SKIN}" stroke-width="14" fill="none" stroke-linecap="round"/>
  <circle cx="106" cy="290" r="8.5" fill="${SKIN}"/><circle cx="205" cy="290" r="8.5" fill="${SKIN}"/>
  ${o.sleeves}
  ${ACC_FRONT[eq.acc]?.(id) || ''}
  ${face(id, c, opts.mood || 'smile')}
  ${bangs(id, c)}
  ${eq.hat ? '' : styleRibbon(c, d2)}
  ${HATS[eq.hat]?.(id) || ''}
  ${ACC_HAIR[eq.acc]?.(id) || ''}
</svg>`;
}

/* ---------------- 머리 ---------------- */
function backHair(style, id) {
  const H = `url(#${id}h)`;
  const short = `<path d="M68 150 C58 60 242 60 232 150 C236 186 232 204 222 214 L78 214 C68 204 64 186 68 150Z" fill="${H}"/>`;
  return {
    long: `<path d="M68 150 C56 54 244 54 232 150 C246 220 252 290 240 336 Q226 320 214 340 Q200 322 186 338 L114 338 Q100 322 86 340 Q74 320 60 336 C48 290 54 220 68 150Z" fill="${H}"/>`,
    bob: `<path d="M68 150 C58 60 242 60 232 150 C238 186 236 208 224 220 Q206 208 194 222 L106 222 Q94 208 76 220 C64 208 62 186 68 150Z" fill="${H}"/>`,
    pony: `${short}<path d="M196 74 C290 60 296 196 254 290 Q250 262 236 268 C262 200 250 120 200 104Z" fill="${H}"/>`,
    twin: `${short}<g id="${id}tail"><path d="M80 104 C14 132 10 262 46 330 Q54 300 68 310 C46 246 58 176 96 132Z" fill="${H}"/></g>
           <use href="#${id}tail" transform="translate(300 0) scale(-1 1)"/>`,
  }[style];
}

function bangs(id, c) {
  const H = `url(#${id}h)`;
  return `<path d="M70 152 C62 76 116 56 150 58 C184 56 238 76 230 152 L222 150 Q216 116 198 102 Q194 128 176 136 Q180 110 166 98 Q156 124 134 130 Q142 108 132 96 Q116 122 96 132 Q98 114 106 100 Q86 116 80 152Z" fill="${H}"/>
  <path d="M72 140 Q60 190 80 222 Q86 190 90 156Z" fill="${H}"/><path d="M228 140 Q240 190 220 222 Q214 190 210 156Z" fill="${H}"/>
  <path d="M98 86 Q150 62 204 86" stroke="${c.hairHi}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".75"/>
  <path d="M116 84 l4 -10 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4Z" fill="#fff" opacity=".9"/>`;
}

function bow(x, y, col) {
  return `<g transform="translate(${x} ${y})"><path d="M0 0 L-20 -12 L-22 12Z M0 0 L20 -12 L22 12Z" fill="${col}"/><circle r="6" fill="${col}"/><circle r="3" cx="-1" cy="-1" fill="#fff" opacity=".6"/></g>`;
}

function styleRibbon(c, col) {
  return {
    pony: bow(206, 80, col),
    twin: bow(84, 108, col) + bow(216, 108, col),
    long: bow(92, 98, '#fff'),
    bob: `<g transform="translate(210 86)">${['#ff9fc4', '#fff', '#ffd36e'].map((k, i) => `<circle cx="${i * 9 - 9}" cy="${i % 2 ? -6 : 0}" r="7" fill="${k}"/>`).join('')}</g>`,
  }[c.style];
}

/* ---------------- 얼굴 ---------------- */
function face(id, c, mood) {
  const [e1] = c.eye;
  const eye = (cx, flip) => {
    if (mood === 'joy') return `<path d="M${cx - 15} 158 Q${cx} 138 ${cx + 15} 158" stroke="#4a2236" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    if (mood === 'hurt') return `<path d="${flip ? `M${cx + 12} 142 L${cx - 10} 154 L${cx + 12} 166` : `M${cx - 12} 142 L${cx + 10} 154 L${cx - 12} 166`}" stroke="#4a2236" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `<g class="blink">
      <ellipse cx="${cx}" cy="152" rx="17" ry="21" fill="#fff"/>
      <ellipse cx="${cx}" cy="155" rx="14.5" ry="18.5" fill="url(#${id}i)"/>
      <ellipse cx="${cx}" cy="157" rx="7" ry="9" fill="${e1}" opacity=".85"/>
      <ellipse cx="${cx - 5}" cy="146" rx="5.5" ry="6.5" fill="#fff"/>
      <circle cx="${cx + 6}" cy="164" r="2.6" fill="#fff"/>
      <path d="M${cx - 15} 168 Q${cx} 175 ${cx + 15} 168" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/>
    </g>
    <path d="M${cx - 19} 146 Q${cx} 126 ${cx + 19} 146" stroke="#4a2236" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M${flip ? cx + 18 : cx - 18} 145 l${flip ? 6 : -6} 2" stroke="#4a2236" stroke-width="3.5" stroke-linecap="round"/>`;
  };
  const brow = (cx) => `<path d="M${cx - 10} 116 Q${cx} 111 ${cx + 10} 116" stroke="${c.hair[1]}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"/>`;
  const mouth = {
    smile: '<path d="M143 182 Q150 192 157 182Z" fill="#ec6a80" stroke="#c94a63" stroke-width="1.5" stroke-linejoin="round"/>',
    joy: '<path d="M139 179 Q150 198 161 179Z" fill="#ec6a80" stroke="#c94a63" stroke-width="1.5" stroke-linejoin="round"/><path d="M144 188 Q150 193 156 188" fill="#ff9fb0"/>',
    hurt: '<path d="M140 186 q5 -5 10 0 q5 5 10 0" stroke="#c94a63" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
  }[mood];
  return `<ellipse cx="150" cy="142" rx="77" ry="71" fill="url(#${id}s)"/>
  ${eye(121, false)}${eye(179, true)}${brow(121)}${brow(179)}
  <ellipse cx="104" cy="180" rx="14" ry="7.5" fill="#ff8fab" opacity="${mood === 'hurt' ? '.7' : '.45'}"/><ellipse cx="196" cy="180" rx="14" ry="7.5" fill="#ff8fab" opacity="${mood === 'hurt' ? '.7' : '.45'}"/>
  ${mouth}`;
}

/* ---------------- 다리 ---------------- */
function legs(o) {
  const sock = o.boots
    ? `<path d="M127 352 h19 v34 h-19Z M154 352 h19 v34 h-19Z" fill="${o.shoe}"/><path d="M127 356 h19 M154 356 h19" stroke="#ffd864" stroke-width="3"/>`
    : '<rect x="128" y="362" width="17" height="24" rx="5" fill="#fff"/><rect x="155" y="362" width="17" height="24" rx="5" fill="#fff"/>';
  return `<rect x="129" y="340" width="15" height="48" rx="7" fill="${SKIN}"/><rect x="156" y="340" width="15" height="48" rx="7" fill="${SKIN}"/>
  ${sock}
  <path d="M122 392 Q122 380 137 380 Q150 380 148 394 Z" fill="${o.shoe}"/><path d="M178 392 Q178 380 163 380 Q150 380 152 394 Z" fill="${o.shoe}"/>`;
}

const petticoat = `<path d="M84 346 Q150 386 216 346 L222 360 Q150 400 78 360Z" fill="#fff"/>
  <g fill="#fff">${Array.from({ length: 9 }, (_, i) => `<circle cx="${84 + i * 16.5}" cy="${(362 + Math.sin((i / 8) * Math.PI) * 18).toFixed(1)}" r="7"/>`).join('')}</g>`;
const puff = (fill) => `<circle cx="114" cy="226" r="17" fill="${fill}"/><circle cx="186" cy="226" r="17" fill="${fill}"/>
  <path d="M104 220 q8 -8 16 -4" stroke="#fff" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/><path d="M180 216 q8 -4 16 4" stroke="#fff" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/>`;
const star4 = (x, y, r, fill) => `<path d="M${x} ${y - r} Q${x + r * 0.2} ${y - r * 0.2} ${x + r} ${y} Q${x + r * 0.2} ${y + r * 0.2} ${x} ${y + r} Q${x - r * 0.2} ${y + r * 0.2} ${x - r} ${y} Q${x - r * 0.2} ${y - r * 0.2} ${x} ${y - r}Z" fill="${fill}"/>`;
const star5 = (x, y, r, fill) => {
  const p = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r;
    return `${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`;
  }).join(' ');
  return `<polygon points="${p}" fill="${fill}"/>`;
};

/* ---------------- 옷 ---------------- */
const OUTFITS = {
  apron: (id, d1, d2) => ({
    shoe: d2,
    skirt: `${petticoat}
      <path d="M122 248 Q150 242 178 248 L220 350 Q150 384 80 350Z" fill="url(#${id}d)"/>
      <path d="M100 330 Q150 356 200 330" stroke="#fff" stroke-width="3" fill="none" opacity=".7" stroke-dasharray="1 9" stroke-linecap="round"/>
      <path d="M132 262 L168 262 L182 336 Q150 350 118 336Z" fill="#fff" opacity=".92"/>
      <path d="M150 304 c-4 -7 -14 -4 -11 4 c2 5 11 11 11 11 s9 -6 11 -11 c3 -8 -7 -11 -11 -4z" fill="${d2}" opacity=".8"/>`,
    top: `<path d="M120 216 Q150 206 180 216 L184 256 Q150 266 116 256Z" fill="url(#${id}d)"/>
      <path d="M132 214 L150 232 L168 214" fill="#fff" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>
      <rect x="116" y="250" width="68" height="10" rx="5" fill="${d2}"/>
      <path d="M150 255 L132 244 L130 266Z M150 255 L168 244 L170 266Z" fill="#fff"/><circle cx="150" cy="255" r="5" fill="#fff"/>`,
    sleeves: puff(`url(#${id}d)`),
  }),

  knightdress: (id) => ({
    shoe: '#8a5a3c', boots: true,
    defs: `<linearGradient id="${id}kb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b6d0ff"/><stop offset="1" stop-color="#5a82e0"/></linearGradient>`,
    skirt: `${petticoat}
      <path d="M122 248 Q150 242 178 248 L220 350 Q150 384 80 350Z" fill="url(#${id}kb)"/>
      <path d="M86 342 Q150 376 214 342" stroke="#ffd864" stroke-width="5" fill="none"/>
      <path d="M137 258 L163 258 L170 354 Q150 360 130 354Z" fill="#fff"/>
      <path d="M150 300 c-4 -7 -14 -4 -11 4 c2 5 11 11 11 11 s9 -6 11 -11 c3 -8 -7 -11 -11 -4z" fill="#5a82e0"/>`,
    top: `<path d="M120 216 Q150 206 180 216 L184 256 Q150 266 116 256Z" fill="url(#${id}kb)"/>
      <path d="M124 214 Q150 204 176 214 L178 248 Q150 262 122 248Z" fill="url(#${id}silver)" stroke="#8b9abb" stroke-width="2"/>
      <path d="M134 222 Q150 216 166 222" stroke="#fff" stroke-width="3" fill="none" opacity=".8"/>
      <path d="M150 232 c-4 -6 -12 -3 -10 3 c2 5 10 9 10 9 s8 -4 10 -9 c2 -6 -6 -9 -10 -3z" fill="#ff6fa5"/>
      <rect x="116" y="250" width="68" height="9" rx="4.5" fill="url(#${id}gold)"/><rect x="144" y="248" width="12" height="13" rx="3" fill="#ffd864" stroke="#e6a92a" stroke-width="1.5"/>`,
    sleeves: `<ellipse cx="113" cy="225" rx="21" ry="15" fill="url(#${id}silver)" stroke="#8b9abb" stroke-width="2"/><ellipse cx="187" cy="225" rx="21" ry="15" fill="url(#${id}silver)" stroke="#8b9abb" stroke-width="2"/>
      <path d="M96 230 Q113 238 130 230 M170 230 Q187 238 204 230" stroke="#ffd864" stroke-width="3" fill="none"/>`,
  }),

  robe: (id) => ({
    shoe: '#6f55d6',
    defs: `<linearGradient id="${id}rb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cdbbff"/><stop offset="1" stop-color="#6f55d6"/></linearGradient>`,
    skirt: `<path d="M120 246 Q150 240 180 246 L230 386 Q150 404 70 386Z" fill="url(#${id}rb)"/>
      <path d="M73 381 Q150 398 227 381" stroke="#ffd864" stroke-width="5" fill="none"/>
      <path d="M150 262 L150 396" stroke="#5a41b8" stroke-width="2" opacity=".5"/>
      ${star5(104, 346, 7, '#ffe27a')}${star5(196, 326, 6, '#ffe27a')}${star5(132, 296, 5, '#fff6c8')}${star5(176, 370, 7, '#ffe27a')}${star5(170, 282, 4, '#fff6c8')}${star5(116, 376, 4, '#fff6c8')}`,
    top: `<path d="M120 216 Q150 206 180 216 L184 256 Q150 266 116 256Z" fill="url(#${id}rb)"/>
      <path d="M126 212 Q150 226 174 212 L168 230 Q150 240 132 230Z" fill="#fff"/>
      <rect x="116" y="248" width="68" height="10" rx="5" fill="url(#${id}gold)"/>
      ${star5(150, 238, 7, '#ffe27a')}`,
    sleeves: `<path d="M100 220 Q90 252 84 284 Q104 292 122 282 Q120 252 128 226Z" fill="url(#${id}rb)"/>
      <path d="M200 220 Q210 252 216 284 Q196 292 178 282 Q180 252 172 226Z" fill="url(#${id}rb)"/>
      <path d="M84 282 Q104 292 122 280 M216 282 Q196 292 178 280" stroke="#ffd864" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  }),

  ballgown: (id, d1, d2) => ({
    shoe: d2,
    defs: `<linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="${d1}"/></linearGradient>`,
    skirt: `<path d="M72 318 Q150 352 228 318 L252 376 Q150 414 48 376Z" fill="${d2}"/>
      <g fill="#fff" opacity=".9">${Array.from({ length: 11 }, (_, i) => `<circle cx="${52 + i * 19.6}" cy="${(378 + Math.sin((i / 10) * Math.PI) * 26).toFixed(1)}" r="6"/>`).join('')}</g>
      <path d="M88 288 Q150 316 212 288 L236 346 Q150 380 64 346Z" fill="url(#${id}bg)"/>
      <path d="M68 344 Q150 378 232 344" stroke="${d2}" stroke-width="3" fill="none" stroke-dasharray="2 10" stroke-linecap="round"/>
      <path d="M120 248 Q150 242 180 248 L214 316 Q150 342 86 316Z" fill="url(#${id}d)"/>
      ${[[92, 318], [150, 330], [208, 318], [70, 348], [230, 348]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${d2}"/><circle cx="${x}" cy="${y}" r="3.5" fill="#fff" opacity=".8"/>`).join('')}
      ${star4(110, 362, 7, '#fff')}${star4(196, 300, 6, '#fff')}${star4(170, 372, 5, '#fff')}`,
    top: `<ellipse cx="150" cy="214" rx="32" ry="10" fill="${SKIN}"/>
      <path d="M122 222 Q136 212 150 222 Q164 212 178 222 L182 256 Q150 266 118 256Z" fill="${d2}"/>
      <path d="M126 222 Q138 216 150 224 Q162 216 174 222" stroke="#fff" stroke-width="3" fill="none"/>
      <path d="M150 254 L120 236 L116 270Z M150 254 L180 236 L184 270Z" fill="${d2}" stroke="#fff" stroke-width="2"/>
      <path d="M146 258 L136 292 L144 290Z M154 258 L164 292 L156 290Z" fill="${d2}"/>
      <circle cx="150" cy="254" r="7" fill="${d1}" stroke="#fff" stroke-width="2"/>`,
    sleeves: `<circle cx="113" cy="232" r="15" fill="url(#${id}d)"/><circle cx="187" cy="232" r="15" fill="url(#${id}d)"/>
      <path d="M100 238 Q113 246 126 238 M174 238 Q187 246 200 238" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray="1 5" stroke-linecap="round"/>`,
  }),

  stardress: (id) => ({
    shoe: '#f2c230',
    defs: `<linearGradient id="${id}sd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ffe7a3"/></linearGradient>`,
    skirt: `${petticoat}
      <path d="M122 248 Q150 242 178 248 L224 356 Q150 392 76 356Z" fill="url(#${id}sd)"/>
      <path d="M130 252 L170 252 L208 352 Q150 378 92 352Z" fill="#bfe3ff" opacity=".45"/>
      <path d="M80 350 Q150 386 220 350" stroke="url(#${id}gold)" stroke-width="5" fill="none"/>
      ${star4(104, 330, 8, '#ffd864')}${star4(186, 316, 7, '#ffd864')}${star4(146, 344, 9, '#fff')}${star4(126, 290, 5, '#ffd864')}${star4(172, 280, 5, '#fff')}${star4(200, 346, 5, '#fff')}`,
    top: `<path d="M120 216 Q150 206 180 216 L184 256 Q150 266 116 256Z" fill="url(#${id}sd)"/>
      <path d="M124 216 Q150 230 176 216" stroke="#f2b632" stroke-width="3" fill="none"/>
      <rect x="116" y="250" width="68" height="9" rx="4.5" fill="url(#${id}gold)"/>
      ${star5(150, 238, 8, '#ffd864')}`,
    sleeves: `<circle cx="114" cy="226" r="17" fill="#fff" opacity=".92" stroke="#ffd864" stroke-width="2"/><circle cx="186" cy="226" r="17" fill="#fff" opacity=".92" stroke="#ffd864" stroke-width="2"/>
      ${star4(110, 222, 5, '#ffd864')}${star4(190, 222, 5, '#ffd864')}`,
  }),
};

/* ---------------- 무기 (오른손 205,290) ---------------- */
const WEAPONS = {
  wood: () => `<g transform="translate(206 292) rotate(28)"><path d="M-6 -10 L-6 -84 L0 -96 L6 -84 L6 -10Z" fill="#e9c08f" stroke="#b9875a" stroke-width="2"/><rect x="-16" y="-12" width="32" height="7" rx="3.5" fill="#ff8fb5"/><rect x="-4" y="-6" width="8" height="24" rx="3" fill="#a8704b"/><circle cy="20" r="5" fill="#ff8fb5"/></g>`,
  knight: (id) => `<g transform="translate(206 292) rotate(28)"><path d="M-7 -12 L-7 -104 L0 -118 L7 -104 L7 -12Z" fill="url(#${id}silver)" stroke="#8b9abb" stroke-width="2"/><path d="M0 -16 L0 -104" stroke="#fff" stroke-width="2" opacity=".8"/><rect x="-22" y="-16" width="44" height="8" rx="4" fill="url(#${id}gold)"/><circle cy="-12" r="5" fill="#5aa8ff" stroke="#fff" stroke-width="1.5"/><rect x="-4" y="-8" width="8" height="24" rx="3" fill="#7a4a36"/><circle cy="20" r="6" fill="#ffd864"/></g>`,
  starwand: () => `<g transform="translate(206 292) rotate(22)"><rect x="-3" y="-80" width="6" height="96" rx="3" fill="#fff" stroke="#e7b8d2" stroke-width="2"/><path d="M-3 -40 L3 -46 M-3 -20 L3 -26" stroke="#ff9fc4" stroke-width="2"/><path d="M0 -112 L8 -94 L28 -92 L13 -79 L18 -59 L0 -70 L-18 -59 L-13 -79 L-28 -92 L-8 -94Z" fill="#ffe27a" stroke="#f2b632" stroke-width="2"/><circle cx="-4" cy="-90" r="3" fill="#fff"/></g>`,
  rainbow: (id) => `<g transform="translate(206 290) rotate(-6)">
    <defs><linearGradient id="${id}rw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a8a"/><stop offset=".25" stop-color="#ffc35a"/><stop offset=".5" stop-color="#8fe08a"/><stop offset=".75" stop-color="#6fb6ff"/><stop offset="1" stop-color="#b38bff"/></linearGradient></defs>
    <path d="M2 -78 L2 78" stroke="#fff" stroke-width="1.5"/><path d="M0 -80 Q52 0 0 80" stroke="url(#${id}rw)" stroke-width="8" fill="none" stroke-linecap="round"/><rect x="-2" y="-10" width="10" height="20" rx="4" fill="#ff8fb5"/></g>`,
  heartsword: (id) => `<g transform="translate(206 292) rotate(28)">
    <defs><linearGradient id="${id}hs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe0f0"/><stop offset="1" stop-color="#ff6fae"/></linearGradient></defs>
    <path d="M-8 -14 L-8 -106 L0 -124 L8 -106 L8 -14Z" fill="url(#${id}hs)" stroke="#e0508f" stroke-width="2"/><path d="M-2 -20 L-2 -104" stroke="#fff" stroke-width="2.5" opacity=".8"/>
    <path d="M0 -6 c-8 -14 -30 -10 -24 2 c4 8 24 14 24 14 s20 -6 24 -14 c6 -12 -16 -16 -24 -2z" fill="url(#${id}gold)" stroke="#e6a92a" stroke-width="1.5"/>
    <rect x="-4" y="4" width="8" height="18" rx="3" fill="#c94a8a"/><circle cy="26" r="6" fill="#ff8fc4"/>
    <path d="M14 -90 l2 -6 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2Z" fill="#fff"/></g>`,
};

/* ---------------- 모자 ---------------- */
const HATS = {
  flower: () => {
    const cols = ['#ff8fb5', '#fff', '#ffd36e', '#c9a8ff', '#ff8fb5', '#fff', '#ffd36e', '#c9a8ff', '#ff8fb5'];
    return cols.map((col, i) => {
      const a = Math.PI * (1.12 + (i / 8) * 0.76);
      const x = 150 + Math.cos(a) * 76, y = 132 + Math.sin(a) * 66;
      const petals = [0, 72, 144, 216, 288].map((d) => `<circle cx="${(Math.cos((d * Math.PI) / 180) * 6).toFixed(1)}" cy="${(Math.sin((d * Math.PI) / 180) * 6).toFixed(1)}" r="5.5" fill="${col}" stroke="#f3a9c9" stroke-width=".8"/>`).join('');
      return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><ellipse cx="9" cy="5" rx="7" ry="3.5" fill="#7fd08e" transform="rotate(30 9 5)"/>${petals}<circle r="3.5" fill="${col === '#ffd36e' ? '#ff9f5a' : '#ffd36e'}"/></g>`;
    }).join('');
  },
  witch: (id) => `<g transform="translate(150 70) rotate(-8)">
    <defs><linearGradient id="${id}wh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a98bff"/><stop offset="1" stop-color="#5a41b8"/></linearGradient></defs>
    <ellipse cx="0" cy="0" rx="96" ry="17" fill="#5a41b8"/><ellipse cx="0" cy="-3" rx="88" ry="12" fill="#7a5ad8"/>
    <path d="M-50 -4 Q-24 -60 8 -104 Q24 -116 34 -100 Q22 -74 50 -4Z" fill="url(#${id}wh)"/>
    <path d="M-48 -8 Q0 6 48 -8 L45 -22 Q0 -8 -45 -22Z" fill="url(#${id}gold)"/>
    ${star5(0, -14, 8, '#fff')}${star5(30, -100, 7, '#ffe27a')}${star4(-20, -50, 5, '#fff')}</g>`,
  silver: (id) => {
    const wing = `<path d="M0 0 Q-34 -26 -40 -6 Q-26 -4 -20 4 Q-36 6 -34 18 Q-16 12 0 6Z" fill="url(#${id}silver)" stroke="#8b9abb" stroke-width="1.5"/><circle r="6" fill="#7fd0ff" stroke="#fff" stroke-width="2"/>`;
    return `<g transform="translate(84 106)">${wing}</g><g transform="translate(216 106) scale(-1 1)">${wing}</g>`;
  },
  tiara: () => `<g transform="translate(150 66)"><path d="M-46 8 L-36 -18 L-20 2 L0 -30 L20 2 L36 -18 L46 8 Q0 18 -46 8Z" fill="#ffd864" stroke="#e6a92a" stroke-width="2.5"/><circle cy="-30" r="6" fill="#ff6fa5"/><circle cx="-36" cy="-18" r="4.5" fill="#7fd0ff"/><circle cx="36" cy="-18" r="4.5" fill="#7fd0ff"/><ellipse cy="2" rx="7" ry="8" fill="#ff6fa5" stroke="#fff" stroke-width="2"/></g>`,
};

/* ---------------- 액세서리 ---------------- */
const ACC_BACK = {
  cape: (id) => `<defs><linearGradient id="${id}cp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a96"/><stop offset="1" stop-color="#d9435f"/></linearGradient></defs>
    <path d="M118 212 Q150 204 182 212 Q214 290 232 372 Q150 394 68 372 Q86 290 118 212Z" fill="url(#${id}cp)"/>
    <path d="M72 366 Q150 388 228 366" stroke="#ffd864" stroke-width="4" fill="none"/>`,
  wings: () => `<g opacity=".85" stroke="#fff" stroke-width="2">
    <ellipse cx="92" cy="196" rx="58" ry="32" fill="#c9f1ff" transform="rotate(-28 92 196)"/><ellipse cx="208" cy="196" rx="58" ry="32" fill="#c9f1ff" transform="rotate(28 208 196)"/>
    <ellipse cx="104" cy="262" rx="36" ry="20" fill="#e6d4ff" transform="rotate(26 104 262)"/><ellipse cx="196" cy="262" rx="36" ry="20" fill="#e6d4ff" transform="rotate(-26 196 262)"/></g>
    <path d="M72 186 Q92 176 112 190 M228 186 Q208 176 188 190" stroke="#fff" stroke-width="3" fill="none" opacity=".8" stroke-linecap="round"/>`,
};
const ACC_FRONT = {
  necklace: () => `<path d="M132 214 Q150 234 168 214" stroke="#f2b632" stroke-width="2" fill="none"/>
    <path d="M150 232 c-5 -8 -16 -4 -13 4 c2 6 13 12 13 12 s11 -6 13 -12 c3 -8 -8 -12 -13 -4z" fill="#ff5f97" stroke="#fff" stroke-width="1.5"/><circle cx="146" cy="234" r="2" fill="#fff"/>`,
  cape: () => '<circle cx="128" cy="216" r="6" fill="#ffd864" stroke="#e6a92a" stroke-width="1.5"/><circle cx="172" cy="216" r="6" fill="#ffd864" stroke="#e6a92a" stroke-width="1.5"/>',
};
const ACC_HAIR = {
  clover: () => `<g transform="translate(94 112) rotate(-20)">${[0, 90, 180, 270].map((d) => `<path transform="rotate(${d})" d="M0 0 c-3 -8 -13 -7 -12 0 c1 5 12 0 12 0z" fill="#5fcf7a" stroke="#fff" stroke-width="1"/>`).join('')}<circle r="2.5" fill="#ffe27a"/></g>`,
};

// 상점 카드용: 장비 하나만 크게 보여주는 작은 그림
export function itemIcon(itemId) {
  const id = `ic${++uid}`;
  const defs = `<defs><linearGradient id="${id}silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#aebbd6"/></linearGradient><linearGradient id="${id}gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3a8"/><stop offset="1" stop-color="#f2b632"/></linearGradient></defs>`;
  if (WEAPONS[itemId]) return `<svg viewBox="150 160 120 160">${defs}${WEAPONS[itemId](id)}</svg>`;
  if (HATS[itemId]) return `<svg viewBox="55 ${itemId === 'witch' ? -60 : 20} 190 ${itemId === 'witch' ? 160 : 130}">${defs}${HATS[itemId](id)}</svg>`;
  if (itemId === 'necklace') return `<svg viewBox="120 200 60 60">${defs}${ACC_FRONT.necklace(id)}</svg>`;
  if (itemId === 'clover') return `<svg viewBox="74 92 40 40">${defs}${ACC_HAIR.clover(id)}</svg>`;
  if (ACC_BACK[itemId]) return `<svg viewBox="30 150 240 250">${defs}${ACC_BACK[itemId](id)}${ACC_FRONT[itemId]?.(id) || ''}</svg>`;
  if (OUTFITS[itemId]) {
    const o = OUTFITS[itemId](id, '#ffd1e6', '#f78ab8');
    return `<svg viewBox="40 196 220 220"><defs>${defs.slice(6, -7)}<linearGradient id="${id}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd1e6"/><stop offset="1" stop-color="#f78ab8"/></linearGradient>${o.defs || ''}</defs>${o.skirt}${o.top}${o.sleeves}</svg>`;
  }
  const potion = { potion: '#ff7f9e', ether: '#9b6cff', bigpotion: '#ff5f97' }[itemId];
  if (potion) {
    const big = itemId === 'bigpotion' ? 1.15 : 1;
    if (itemId === 'ether') return `<svg viewBox="0 0 60 60"><circle cx="30" cy="32" r="16" fill="${potion}"/><path d="M14 32 L4 24 L6 40Z M46 32 L56 24 L54 40Z" fill="#cfbaff"/><circle cx="25" cy="27" r="5" fill="#fff" opacity=".6"/></svg>`;
    return `<svg viewBox="0 0 60 60"><g transform="translate(30 32) scale(${big}) translate(-30 -32)"><rect x="24" y="8" width="12" height="10" rx="2" fill="#c08a64"/><path d="M24 16 L36 16 L36 22 Q48 28 46 42 Q44 54 30 54 Q16 54 14 42 Q12 28 24 22Z" fill="#e8f6ff" stroke="#bcd8ee" stroke-width="2"/><path d="M15 38 Q30 34 45 38 Q44 52 30 52 Q16 52 15 38Z" fill="${potion}"/><circle cx="22" cy="30" r="3" fill="#fff"/></g></svg>`;
  }
  return '';
}
