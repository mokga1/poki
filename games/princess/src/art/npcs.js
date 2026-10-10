// 등장인물 초상화 SVG (viewBox 0 0 120 120)
export const LULU = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <g opacity=".85"><ellipse cx="38" cy="50" rx="30" ry="20" fill="#c9f1ff" transform="rotate(-25 38 50)"/><ellipse cx="82" cy="50" rx="30" ry="20" fill="#c9f1ff" transform="rotate(25 82 50)"/>
  <ellipse cx="42" cy="78" rx="18" ry="12" fill="#e6d4ff" transform="rotate(20 42 78)"/><ellipse cx="78" cy="78" rx="18" ry="12" fill="#e6d4ff" transform="rotate(-20 78 78)"/></g>
  <path d="M50 74 L70 74 L78 104 L42 104Z" fill="#9fe3c8"/>
  <circle cx="60" cy="58" r="20" fill="#fff0e8"/>
  <path d="M40 58 C36 30 84 30 80 58 Q76 44 66 42 Q60 52 50 46 Q44 48 40 58Z" fill="#ffd36e"/>
  <ellipse cx="53" cy="61" rx="3" ry="4" fill="#4a2236"/><ellipse cx="67" cy="61" rx="3" ry="4" fill="#4a2236"/>
  <circle cx="52" cy="59.5" r="1.2" fill="#fff"/><circle cx="66" cy="59.5" r="1.2" fill="#fff"/>
  <ellipse cx="47" cy="67" rx="4" ry="2.4" fill="#ff9fb3" opacity=".6"/><ellipse cx="73" cy="67" rx="4" ry="2.4" fill="#ff9fb3" opacity=".6"/>
  <path d="M56 68 Q60 72 64 68" stroke="#c94a63" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M60 30 l3 -8 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3Z" fill="#fff6a8"/>
</svg>`;

const face = (y = 62) => `<ellipse cx="48" cy="${y}" rx="4" ry="5" fill="#3a2230"/><ellipse cx="72" cy="${y}" rx="4" ry="5" fill="#3a2230"/>
  <circle cx="46.5" cy="${y - 2}" r="1.6" fill="#fff"/><circle cx="70.5" cy="${y - 2}" r="1.6" fill="#fff"/>
  <ellipse cx="40" cy="${y + 9}" rx="6" ry="3.5" fill="#ff9fb3" opacity=".55"/><ellipse cx="80" cy="${y + 9}" rx="6" ry="3.5" fill="#ff9fb3" opacity=".55"/>`;

export const NYANG = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <path d="M30 120 Q30 92 60 90 Q90 92 90 120Z" fill="#7a5ad8"/><path d="M56 90 L60 104 L64 90Z" fill="#ffd36e"/>
  <path d="M26 46 L30 12 L52 34Z M94 46 L90 12 L68 34Z" fill="#ffb35a"/><path d="M32 40 L34 20 L46 34Z M88 40 L86 20 L74 34Z" fill="#ffd1e6"/>
  <ellipse cx="60" cy="60" rx="38" ry="34" fill="#ffc27a"/><path d="M44 30 q4 10 0 16 M60 26 v16 M76 30 q-4 10 0 16" stroke="#e8913a" stroke-width="4" fill="none" stroke-linecap="round"/>
  <ellipse cx="60" cy="74" rx="18" ry="12" fill="#fff6e8"/>
  ${face(60)}<path d="M56 70 L60 74 L64 70Z" fill="#ff8fab"/><path d="M60 74 q-5 6 -10 2 M60 74 q5 6 10 2" stroke="#3a2230" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M30 70 h-16 M30 76 h-14 M90 70 h16 M90 76 h14" stroke="#3a2230" stroke-width="1.5"/>
  <path d="M26 30 Q60 4 94 30 L88 36 Q60 18 32 36Z" fill="#5a3aa8"/><rect x="40" y="10" width="40" height="16" rx="6" fill="#7a5ad8"/><circle cx="60" cy="18" r="4" fill="#ffd36e"/>
</svg>`;

export const LEO = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <path d="M28 120 Q28 92 60 90 Q92 92 92 120Z" fill="#3a5a9a"/><path d="M50 90 L60 104 L70 90Z" fill="#fff"/><circle cx="60" cy="104" r="3" fill="#ffd864"/>
  <path d="M30 100 h14 M76 100 h14" stroke="#ffd864" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="60" cy="60" rx="32" ry="30" fill="#ffe6d6"/>
  <path d="M28 62 C24 26 96 26 92 62 Q86 40 72 38 Q66 48 56 42 Q44 46 40 40 Q32 48 28 62Z" fill="#ffd56b"/>
  <path d="M44 28 L48 14 L54 24 L60 10 L66 24 L72 14 L76 28Z" fill="#ffd864" stroke="#e6a92a" stroke-width="2"/><circle cx="60" cy="14" r="3" fill="#5aa8ff"/>
  <ellipse cx="48" cy="62" rx="4.5" ry="6" fill="#2a5aa8"/><ellipse cx="72" cy="62" rx="4.5" ry="6" fill="#2a5aa8"/><circle cx="46.5" cy="60" r="1.8" fill="#fff"/><circle cx="70.5" cy="60" r="1.8" fill="#fff"/>
  <ellipse cx="42" cy="72" rx="5" ry="3" fill="#ff9fb3" opacity=".45"/><ellipse cx="78" cy="72" rx="5" ry="3" fill="#ff9fb3" opacity=".45"/>
  <path d="M54 76 Q60 81 66 76" stroke="#b9435a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`;

export const MOMO = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <path d="M26 120 Q26 90 60 88 Q94 90 94 120Z" fill="#6f55d6"/><path d="M60 88 L60 120" stroke="#ffd864" stroke-width="3"/>
  <circle cx="60" cy="64" r="30" fill="#ffe6d6"/>
  <path d="M30 66 C26 40 94 40 90 66 Q84 52 72 52 Q60 46 48 52 Q36 52 30 66Z" fill="#e8e4ef"/><circle cx="60" cy="36" r="12" fill="#e8e4ef"/>
  <ellipse cx="60" cy="40" rx="56" ry="10" fill="#5a41b8"/><path d="M34 38 Q46 -6 76 -4 Q70 10 86 38Z" fill="#7a5ad8"/><path d="M36 34 Q60 42 84 34 L84 28 Q60 36 36 28Z" fill="#ffd864"/>
  <circle cx="48" cy="64" r="8" fill="none" stroke="#c08a64" stroke-width="2.5"/><circle cx="72" cy="64" r="8" fill="none" stroke="#c08a64" stroke-width="2.5"/><path d="M56 64 h8" stroke="#c08a64" stroke-width="2.5"/>
  <path d="M44 64 q4 -4 8 0 M68 64 q4 -4 8 0" stroke="#3a2230" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <ellipse cx="40" cy="76" rx="5" ry="3" fill="#ff9fb3" opacity=".55"/><ellipse cx="80" cy="76" rx="5" ry="3" fill="#ff9fb3" opacity=".55"/>
  <path d="M52 80 Q60 87 68 80" stroke="#b9435a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`;

export const KONG = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="60" cy="100" rx="34" ry="18" fill="#fff" stroke="#eee" stroke-width="2"/>
  <ellipse cx="30" cy="56" rx="14" ry="24" fill="#c08a64" transform="rotate(20 30 56)"/><ellipse cx="90" cy="56" rx="14" ry="24" fill="#fff" stroke="#eee" stroke-width="2" transform="rotate(-20 90 56)"/>
  <circle cx="60" cy="62" r="32" fill="#fff" stroke="#eee" stroke-width="2"/><ellipse cx="46" cy="56" rx="12" ry="14" fill="#e8c4a0" opacity=".7"/>
  ${face(60)}<ellipse cx="60" cy="74" rx="6" ry="4.5" fill="#3a2230"/><path d="M60 78 q-6 6 -10 2 M60 78 q6 6 10 2" stroke="#3a2230" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M56 86 q4 8 8 0Z" fill="#ff8fab"/><path d="M40 92 h40" stroke="#ff8fb5" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="96" r="4" fill="#ffd864"/>
</svg>`;

// 수확제 라이벌 (공주 그림을 다른 색으로)
export const RIVALS = {
  toto: { name: '토토', style: 'bob', hair: ['#d9a37a', '#8a5a3c'], hairHi: '#f2d6c0', eye: ['#5a3a1c', '#c08a64'], dress: ['#ffd9a8', '#f5a63b'] },
  mimi: { name: '미미', style: 'twin', hair: ['#fff3a0', '#f2c230'], hairHi: '#fffbe0', eye: ['#8a5a00', '#ffc94d'], dress: ['#ffe6f1', '#ff9fc4'] },
  bella: { name: '벨라', style: 'long', hair: ['#d8b8ff', '#8a5ad8'], hairHi: '#f2e8ff', eye: ['#4a2a8a', '#b38bff'], dress: ['#e6d4ff', '#a483f5'] },
  luna: { name: '루나', style: 'pony', hair: ['#c9d3ea', '#7a8bb5'], hairHi: '#f0f4ff', eye: ['#2a3a6a', '#7fb8ff'], dress: ['#d8ecff', '#7fb8ff'] },
};
