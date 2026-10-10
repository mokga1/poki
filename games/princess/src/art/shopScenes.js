// 상점 배경 (일반 상점 / 냥냥이 특별 상점)
import { wrap } from './scenes.js';

const awning = (cols) => `<g>${Array.from({ length: 17 }, (_, i) =>
  `<path d="M${i * 100} 0 h100 v70 q-50 40 -100 0Z" fill="${cols[i % 2]}"/>`).join('')}</g>`;

const lamp = (x, c) => `<g transform="translate(${x} 70)"><path d="M0 0 v60" stroke="#c08a64" stroke-width="3"/>
  <path d="M-30 60 h60 l-12 40 h-36Z" fill="${c}"/><circle cy="108" r="10" fill="#fff6c8"/><circle cy="108" r="40" fill="#fff6c8" opacity=".25"/></g>`;

const mirror = `<g transform="translate(470 470)"><ellipse rx="230" ry="300" fill="#fff" stroke="#f2c230" stroke-width="18"/><ellipse rx="210" ry="280" fill="url(#mir)"/>
  <path d="M-120 -170 q60 -60 130 -40" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round" opacity=".7"/>
  <circle cy="-300" r="26" fill="#ff8fb5" stroke="#f2c230" stroke-width="6"/></g>`;

export function shopBg(special = false) {
  if (special) {
    return wrap(`<rect width="1600" height="900" fill="url(#ns)"/>
      ${Array.from({ length: 30 }, (_, i) => `<circle cx="${(i * 137) % 1600}" cy="${40 + ((i * 89) % 380)}" r="${2 + (i % 3)}" fill="#fff" opacity=".8"/>`).join('')}
      <path d="M0 160 Q400 240 800 170 T1600 170" stroke="#ffd36e" stroke-width="3" fill="none"/>
      ${[120, 320, 520, 720, 920, 1120, 1320, 1520].map((x, i) => `<g transform="translate(${x} ${190 + Math.sin(i) * 20})"><ellipse rx="26" ry="32" fill="${['#ff8fb5', '#ffd36e', '#9fdcff', '#c9a8ff'][i % 4]}"/><ellipse rx="26" ry="32" fill="#fff" opacity=".25"/></g>`).join('')}
      ${mirror}
      <rect y="660" width="1600" height="240" fill="#6a4aa8"/>
      <g transform="translate(1250 680)"><rect x="-260" y="0" width="520" height="160" rx="16" fill="#a8704b"/><rect x="-280" y="-14" width="560" height="28" rx="10" fill="#c08a64"/></g>`,
    `<linearGradient id="ns" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a78"/><stop offset="1" stop-color="#9a6ad0"/></linearGradient>
     <linearGradient id="mir" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8e4ff"/><stop offset="1" stop-color="#b8b0ee"/></linearGradient>`);
  }
  return wrap(`<rect width="1600" height="900" fill="url(#sw)"/>
    <g opacity=".35">${Array.from({ length: 26 }, (_, i) => `<path transform="translate(${(i % 13) * 130 + (i > 12 ? 65 : 0)} ${i > 12 ? 420 : 260})" d="M0 0 c-6 -10 -20 -6 -16 4 c3 7 16 15 16 15 s13 -8 16 -15 c4 -10 -10 -14 -16 -4z" fill="#fff"/>`).join('')}</g>
    ${awning(['#ff9cc4', '#fff'])}
    ${lamp(260, '#ff9cc4')}${lamp(1340, '#c9a8ff')}
    ${mirror}
    <rect y="660" width="1600" height="240" fill="url(#sf)"/>
    <g stroke="#e0a5c4" stroke-width="2" opacity=".5"><path d="M0 730 H1600 M0 810 H1600"/></g>`,
  `<linearGradient id="sw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1e4ff"/><stop offset="1" stop-color="#ffd9ec"/></linearGradient>
   <linearGradient id="sf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6c9e0"/><stop offset="1" stop-color="#e7a8c8"/></linearGradient>
   <linearGradient id="mir" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e6ddff"/></linearGradient>`);
}
