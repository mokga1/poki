// 적 16종 SVG (viewBox 0 0 200 200, 땅은 y≈190). 무섭지 않고 귀엽게!
let uid = 0;

const shadow = (rx = 70) => `<ellipse cx="100" cy="190" rx="${rx}" ry="9" fill="#2a1a3a" opacity=".16"/>`;
const eyes = (x1, x2, y, r = 8, col = '#2b1a2e') => `<ellipse cx="${x1}" cy="${y}" rx="${r}" ry="${r * 1.25}" fill="${col}"/><ellipse cx="${x2}" cy="${y}" rx="${r}" ry="${r * 1.25}" fill="${col}"/>
  <circle cx="${x1 - r * 0.35}" cy="${y - r * 0.45}" r="${r * 0.42}" fill="#fff"/><circle cx="${x2 - r * 0.35}" cy="${y - r * 0.45}" r="${r * 0.42}" fill="#fff"/>`;
const blush = (x1, x2, y, s = 1) => `<ellipse cx="${x1}" cy="${y}" rx="${10 * s}" ry="${5 * s}" fill="#ff8fab" opacity=".5"/><ellipse cx="${x2}" cy="${y}" rx="${10 * s}" ry="${5 * s}" fill="#ff8fab" opacity=".5"/>`;
const smile = (x, y, w = 8, col = '#2b1a2e') => `<path d="M${x - w} ${y} Q${x} ${y + w} ${x + w} ${y}" stroke="${col}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
const grumpy = (x1, x2, y, col = '#2b1a2e') => `<path d="M${x1 - 12} ${y - 6} L${x1 + 8} ${y + 2} M${x2 + 12} ${y - 6} L${x2 - 8} ${y + 2}" stroke="${col}" stroke-width="5" stroke-linecap="round"/>`;
const grad = (id, a, b, radial = false) => radial
  ? `<radialGradient id="${id}" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`
  : `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const shine = (x, y, rx = 14, ry = 8, rot = -30) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".6" transform="rotate(${rot} ${x} ${y})"/>`;
const crown = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-22 8 L-18 -12 L-8 0 L0 -18 L8 0 L18 -12 L22 8Z" fill="#ffd864" stroke="#e6a92a" stroke-width="2"/><circle cy="-18" r="3.5" fill="#ff6fa5"/></g>`;

const ART = {
  slime: (g) => `<defs>${grad(`${g}a`, '#d8ffd8', '#3fb873', true)}</defs>${shadow(80)}
    <path d="M20 180 C10 120 50 40 100 38 C150 40 190 120 180 180 Q100 196 20 180Z" fill="url(#${g}a)"/>${shine(70, 78, 18, 10)}
    <path d="M100 40 Q96 18 112 10 Q114 28 100 40Z" fill="#7fd08e"/><path d="M100 40 Q110 22 128 24 Q120 40 100 40Z" fill="#9fe0a0"/>
    ${eyes(78, 122, 122, 9, '#1f4a32')}${blush(62, 138, 142)}${smile(100, 142, 8, '#1f4a32')}`,

  bunny: (g) => `<defs>${grad(`${g}a`, '#fff', '#e3c9ff', true)}</defs>${shadow(60)}
    <ellipse cx="72" cy="50" rx="16" ry="44" fill="url(#${g}a)" transform="rotate(-12 72 50)"/><ellipse cx="72" cy="52" rx="7" ry="32" fill="#ffb6d3" transform="rotate(-12 72 52)"/>
    <ellipse cx="128" cy="50" rx="16" ry="44" fill="url(#${g}a)" transform="rotate(14 128 50)"/><ellipse cx="128" cy="52" rx="7" ry="32" fill="#ffb6d3" transform="rotate(14 128 52)"/>
    <g transform="translate(138 22)">${[0, 72, 144, 216, 288].map((d) => `<circle cx="${(Math.cos((d * Math.PI) / 180) * 7).toFixed(1)}" cy="${(Math.sin((d * Math.PI) / 180) * 7).toFixed(1)}" r="6" fill="#ff8fb5"/>`).join('')}<circle r="4" fill="#ffd36e"/></g>
    <ellipse cx="100" cy="134" rx="62" ry="56" fill="url(#${g}a)"/><ellipse cx="72" cy="182" rx="20" ry="10" fill="#fff"/><ellipse cx="128" cy="182" rx="20" ry="10" fill="#fff"/>
    ${eyes(80, 120, 122, 8, '#5a2a6a')}${blush(66, 134, 140)}<path d="M94 140 L100 146 L106 140" stroke="#5a2a6a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M96 146 v6 h8 v-6" fill="#fff" stroke="#5a2a6a" stroke-width="1.5"/>`,

  squirrel: (g) => `<defs>${grad(`${g}a`, '#ffc38a', '#e0803c', true)}</defs>${shadow(64)}
    <path d="M140 170 C210 160 200 60 150 50 C120 46 120 90 150 100 C176 110 160 150 130 150Z" fill="#d9733a"/><path d="M150 64 C176 76 180 120 160 140" stroke="#ffc38a" stroke-width="8" fill="none" stroke-linecap="round"/>
    <ellipse cx="90" cy="138" rx="52" ry="50" fill="url(#${g}a)"/><ellipse cx="90" cy="150" rx="30" ry="30" fill="#fff1dc"/>
    <path d="M58 92 L52 64 L74 82Z M118 88 L126 62 L104 80Z" fill="#e0803c"/>
    ${eyes(74, 106, 122, 7)}${blush(62, 118, 136, 0.8)}<ellipse cx="90" cy="132" rx="4" ry="3" fill="#2b1a2e"/>
    <g transform="translate(90 172)"><ellipse rx="14" ry="16" fill="#c08a64"/><path d="M-16 -8 Q0 -22 16 -8 Q0 -2 -16 -8Z" fill="#7a4a36"/></g>`,

  mushroom: (g) => `<defs>${grad(`${g}a`, '#ff8a8a', '#d9435f')}${grad(`${g}b`, '#fff8ec', '#f2dcc0')}</defs>${shadow(84)}
    <path d="M60 118 Q56 186 70 188 L130 188 Q144 186 140 118Z" fill="url(#${g}b)"/>
    <path d="M14 118 C10 40 70 10 100 10 C130 10 190 40 186 118 Q100 136 14 118Z" fill="url(#${g}a)"/>
    ${[[52, 66, 14], [100, 40, 12], [146, 70, 16], [76, 100, 9], [128, 104, 9]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join('')}
    ${eyes(84, 116, 150, 7)}${grumpy(84, 116, 138)}${blush(72, 128, 164, 0.8)}<path d="M92 170 Q100 164 108 170" stroke="#2b1a2e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="54" cy="160" rx="10" ry="14" fill="#f2dcc0"/><ellipse cx="146" cy="160" rx="10" ry="14" fill="#f2dcc0"/>${crown(100, 4, 1.1)}`,

  bat: (g) => `<defs>${grad(`${g}a`, '#c9a8ff', '#6f55d6', true)}</defs>${shadow(50)}
    <path d="M70 100 C40 60 10 70 4 96 Q24 92 28 110 Q40 98 50 116 Q58 104 72 118Z" fill="#7a5ad8"/>
    <path d="M130 100 C160 60 190 70 196 96 Q176 92 172 110 Q160 98 150 116 Q142 104 128 118Z" fill="#7a5ad8"/>
    <path d="M70 70 L74 42 L90 62Z M130 70 L126 42 L110 62Z" fill="#6f55d6"/>
    <circle cx="100" cy="104" r="44" fill="url(#${g}a)"/>${shine(80, 80, 12, 7)}
    ${eyes(84, 116, 100, 9)}${blush(72, 128, 118, 0.8)}<path d="M90 120 Q100 128 110 120" stroke="#2b1a2e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M94 122 l3 7 l3 -6 M106 122 l-3 7 l-3 -6" fill="#fff"/>`,

  turtle: (g) => `<defs>${grad(`${g}a`, '#d3d6df', '#8a90a3', true)}</defs>${shadow(82)}
    <ellipse cx="40" cy="160" rx="22" ry="16" fill="#8fd59a"/><ellipse cx="60" cy="182" rx="16" ry="10" fill="#8fd59a"/><ellipse cx="146" cy="182" rx="16" ry="10" fill="#8fd59a"/>
    <path d="M30 170 C30 90 80 60 116 64 C160 68 186 110 180 170Z" fill="url(#${g}a)"/>
    <path d="M70 90 L96 80 L118 96 L110 124 L82 126Z M126 100 L156 112 L158 146 L128 150Z M50 136 L80 132 L88 160 L56 166Z" fill="#b9bdc9" stroke="#7a8094" stroke-width="2"/>
    <path d="M60 78 q20 -16 40 -6" stroke="#7fd08e" stroke-width="10" fill="none" stroke-linecap="round"/>
    <ellipse cx="32" cy="140" rx="30" ry="26" fill="#9fe0a0"/>
    <path d="M18 138 q6 -5 12 0 M38 138 q6 -5 12 0" stroke="#1f4a32" stroke-width="3" fill="none" stroke-linecap="round"/>${blush(16, 50, 150, 0.6)}${smile(32, 154, 6, '#1f4a32')}`,

  crab: (g) => `<defs>${grad(`${g}a`, '#ffb0c8', '#ec5f8a', true)}</defs>${shadow(76)}
    ${[40, 60, 140, 160].map((x) => `<path d="M${x} 160 l${x < 100 ? -16 : 16} 24" stroke="#ec5f8a" stroke-width="7" stroke-linecap="round"/>`).join('')}
    <path d="M44 120 Q20 100 26 70 M156 120 Q180 100 174 70" stroke="#ec5f8a" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M10 70 Q14 40 36 48 L30 64 L42 70 Q30 86 10 70Z" fill="#ff8fb0"/><path d="M190 70 Q186 40 164 48 L170 64 L158 70 Q170 86 190 70Z" fill="#ff8fb0"/>
    <ellipse cx="100" cy="134" rx="66" ry="44" fill="url(#${g}a)"/>
    <path d="M86 98 L94 60 L104 92 L114 54 L120 98Z" fill="#9fdcff" stroke="#6fb6ff" stroke-width="2"/><path d="M94 66 L100 90" stroke="#fff" stroke-width="2"/>
    <path d="M80 112 v-14 M120 112 v-14" stroke="#ec5f8a" stroke-width="5"/>${eyes(80, 120, 96, 8)}${blush(64, 136, 136)}${smile(100, 140, 9)}`,

  golem: (g) => `<defs>${grad(`${g}a`, '#d9c9ff', '#7a5ad8')}${grad(`${g}b`, '#bfe3ff', '#5a8ae0')}</defs>${shadow(90)}
    <rect x="58" y="150" width="30" height="40" rx="6" fill="url(#${g}a)"/><rect x="112" y="150" width="30" height="40" rx="6" fill="url(#${g}a)"/>
    <path d="M14 70 L44 60 L52 120 L20 132Z M186 70 L156 60 L148 120 L180 132Z" fill="url(#${g}b)" stroke="#fff" stroke-width="2"/>
    <path d="M40 54 L100 30 L160 54 L168 156 L100 172 L32 156Z" fill="url(#${g}a)" stroke="#fff" stroke-width="3"/>
    <path d="M100 30 L100 172 M40 54 L100 100 L160 54 M32 156 L100 100 L168 156" stroke="#fff" stroke-width="1.5" opacity=".5"/>
    <path d="M86 10 L100 -6 L114 10 L100 34Z" fill="url(#${g}b)" stroke="#fff" stroke-width="2"/>
    <rect x="64" y="70" width="72" height="36" rx="12" fill="#3a2a78" opacity=".55"/>
    <ellipse cx="84" cy="88" rx="9" ry="10" fill="#9ff0ff"/><ellipse cx="116" cy="88" rx="9" ry="10" fill="#9ff0ff"/><circle cx="81" cy="84" r="3" fill="#fff"/><circle cx="113" cy="84" r="3" fill="#fff"/>
    ${grumpy(84, 116, 74, '#fff')}<path d="M86 128 h28" stroke="#3a2a78" stroke-width="4" stroke-linecap="round"/>${crown(100, 24, 0.9)}`,

  snowman: (g) => `<defs>${grad(`${g}a`, '#ffffff', '#cfe6ff', true)}</defs>${shadow(64)}
    <circle cx="100" cy="146" r="46" fill="url(#${g}a)"/><circle cx="100" cy="76" r="36" fill="url(#${g}a)"/>
    <path d="M56 130 L18 104 M144 130 L182 104" stroke="#a8704b" stroke-width="5" stroke-linecap="round"/><path d="M26 108 l-8 -10 M174 108 l8 -10" stroke="#a8704b" stroke-width="4" stroke-linecap="round"/>
    <path d="M66 104 Q100 120 134 104 L134 116 Q100 132 66 116Z" fill="#ff7f9e"/><path d="M120 112 l10 30 l12 -4 l-8 -28Z" fill="#ff7f9e"/>
    <rect x="72" y="32" width="56" height="10" rx="5" fill="#5a82e0"/><rect x="80" y="4" width="40" height="32" rx="6" fill="#5a82e0"/>
    ${eyes(86, 114, 72, 6)}<path d="M100 82 L126 88 L100 92Z" fill="#ff9f4a"/>${blush(76, 124, 90, 0.7)}
    ${[130, 148, 166].map((y) => `<circle cx="100" cy="${y}" r="5" fill="#5a82e0"/>`).join('')}`,

  icefairy: (g) => `<defs>${grad(`${g}a`, '#e9f7ff', '#8fc8ff')}</defs>${shadow(40)}
    <g opacity=".85" stroke="#fff" stroke-width="2"><path d="M86 90 L30 50 L40 110Z" fill="#bfe3ff"/><path d="M114 90 L170 50 L160 110Z" fill="#bfe3ff"/>
    <path d="M88 110 L44 140 L72 150Z" fill="#d8f0ff"/><path d="M112 110 L156 140 L128 150Z" fill="#d8f0ff"/></g>
    <path d="M80 104 L120 104 L138 170 Q100 182 62 170Z" fill="url(#${g}a)"/>
    <circle cx="100" cy="76" r="30" fill="#fff3ec"/>
    <path d="M70 76 C66 36 134 36 130 76 Q122 54 108 52 Q98 64 86 56 Q76 60 70 76Z" fill="#9fdcff"/>
    <path d="M78 44 L84 22 L92 42 L100 16 L108 42 L116 22 L122 44Z" fill="#e9f7ff" stroke="#8fc8ff" stroke-width="2"/>
    ${eyes(90, 110, 80, 5, '#1d3a8a')}${blush(82, 118, 90, 0.6)}<path d="M96 92 Q100 96 104 92" stroke="#1d3a8a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M148 120 l6 -14 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6Z" fill="#fff"/>`,

  penguin: (g) => `<defs>${grad(`${g}a`, '#5a6a9a', '#2a3458')}</defs>${shadow(56)}
    <ellipse cx="74" cy="184" rx="16" ry="8" fill="#ffb347"/><ellipse cx="126" cy="184" rx="16" ry="8" fill="#ffb347"/>
    <ellipse cx="100" cy="124" rx="56" ry="64" fill="url(#${g}a)"/><ellipse cx="100" cy="136" rx="38" ry="48" fill="#fff"/>
    <path d="M46 112 Q30 140 44 160 Q54 140 58 122Z" fill="#2a3458"/>
    <g transform="translate(160 120) rotate(30)"><rect x="-3" y="-60" width="6" height="60" rx="2" fill="#dfe6f5" stroke="#8b9abb"/><rect x="-12" y="0" width="24" height="6" rx="3" fill="#ffd864"/><rect x="-3" y="6" width="6" height="14" fill="#7a4a36"/></g>
    <path d="M146 110 Q166 128 158 140 Q146 132 142 122Z" fill="#2a3458"/>
    <path d="M58 70 Q100 30 142 70 L136 86 Q100 66 64 86Z" fill="#c9d3ea" stroke="#8b9abb" stroke-width="2"/><path d="M100 40 v-16" stroke="#ff6f8a" stroke-width="6" stroke-linecap="round"/>
    ${eyes(84, 116, 98, 6, '#fff')}<circle cx="84" cy="99" r="3.5" fill="#2b1a2e"/><circle cx="116" cy="99" r="3.5" fill="#2b1a2e"/>
    <path d="M90 110 L110 110 L100 122Z" fill="#ffb347"/>${blush(76, 124, 116, 0.6)}`,

  frosty: (g) => `<defs>${grad(`${g}a`, '#e9f7ff', '#7fb8ff')}${grad(`${g}b`, '#ffffff', '#bfe3ff')}</defs>${shadow(84)}
    <path d="M60 64 C40 120 30 170 36 190 L164 190 C170 170 160 120 140 64Z" fill="#cfe8ff"/>
    <path d="M74 96 L126 96 L170 190 L30 190Z" fill="url(#${g}a)"/>
    <path d="M60 150 Q100 170 140 150 M48 176 Q100 196 152 176" stroke="#fff" stroke-width="3" fill="none" opacity=".8"/>
    ${[[64, 160], [128, 140], [96, 176], [146, 178]].map(([x, y]) => `<path d="M${x} ${y} l4 -10 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4Z" fill="#fff"/>`).join('')}
    <path d="M78 96 Q100 108 122 96 L118 86 Q100 94 82 86Z" fill="#fff"/>
    <circle cx="100" cy="62" r="32" fill="#fff3ec"/>
    <path d="M66 64 C60 20 140 20 134 64 Q128 42 112 38 Q100 52 86 42 Q74 46 66 64Z" fill="url(#${g}b)"/>
    <path d="M70 60 Q60 100 66 130 M130 60 Q140 100 134 130" stroke="#e9f7ff" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M74 30 L80 4 L88 26 L100 -4 L112 26 L120 4 L126 30Z" fill="#e9f7ff" stroke="#7fb8ff" stroke-width="2"/><circle cx="100" cy="14" r="4" fill="#7fd0ff"/>
    ${eyes(88, 112, 66, 5.5, '#1d3a8a')}<path d="M80 56 l12 4 M120 56 l-12 4" stroke="#1d3a8a" stroke-width="2.5" stroke-linecap="round"/>
    ${blush(80, 120, 76, 0.6)}<path d="M94 80 Q100 77 106 80" stroke="#c94a63" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,

  ghost: (g) => `<defs>${grad(`${g}a`, '#ffffff', '#e3dcff')}</defs>${shadow(50)}
    <path d="M40 170 C34 80 60 30 100 30 C140 30 166 80 160 170 Q146 158 134 172 Q120 158 106 172 Q92 158 80 172 Q66 158 52 172 Q46 164 40 170Z" fill="url(#${g}a)"/>
    <path d="M40 120 Q20 110 24 92 M160 120 Q180 110 176 92" stroke="#e3dcff" stroke-width="14" fill="none" stroke-linecap="round"/>${shine(74, 64, 14, 8)}
    ${eyes(82, 118, 96, 9)}${blush(68, 132, 116)}<path d="M88 118 Q100 132 112 118Z" fill="#ff7f9e"/><path d="M98 124 q4 10 8 0" fill="#ff9fb0"/>`,

  sheep: (g) => `${shadow(76)}
    <rect x="66" y="150" width="12" height="36" rx="5" fill="#4a3a5a"/><rect x="122" y="150" width="12" height="36" rx="5" fill="#4a3a5a"/>
    <g fill="#fff" stroke="#e8e0f5" stroke-width="2">${[[60, 110, 34], [100, 90, 38], [140, 110, 34], [70, 146, 30], [130, 146, 30], [100, 140, 36], [40, 136, 22], [160, 136, 22]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>
    <ellipse cx="100" cy="118" rx="32" ry="30" fill="#5a4a6a"/>
    <path d="M70 100 C50 92 46 116 62 118 M130 100 C150 92 154 116 138 118" stroke="#ffd36e" stroke-width="8" fill="none" stroke-linecap="round"/>
    ${eyes(88, 112, 116, 6, '#fff')}<circle cx="88" cy="117" r="3.5" fill="#2b1a2e"/><circle cx="112" cy="117" r="3.5" fill="#2b1a2e"/>${blush(80, 120, 130, 0.6)}${smile(100, 132, 6, '#fff')}
    <circle cx="100" cy="74" r="14" fill="#fff" stroke="#e8e0f5" stroke-width="2"/>`,

  soldier: (g) => `<defs>${grad(`${g}a`, '#ff8a96', '#d9435f')}</defs>${shadow(50)}
    <rect x="80" y="140" width="16" height="44" rx="4" fill="#3a4a8a"/><rect x="104" y="140" width="16" height="44" rx="4" fill="#3a4a8a"/>
    <rect x="76" y="180" width="22" height="10" rx="4" fill="#2b1a2e"/><rect x="102" y="180" width="22" height="10" rx="4" fill="#2b1a2e"/>
    <rect x="70" y="92" width="60" height="54" rx="12" fill="url(#${g}a)"/><path d="M70 104 L130 136 M130 104 L70 136" stroke="#fff" stroke-width="5"/>
    <g transform="translate(150 110)"><path d="M0 -14 a10 10 0 1 1 0 20 a10 10 0 1 1 0 -20Z M-4 -4 h-14" stroke="#ffd864" stroke-width="5" fill="none"/></g>
    <rect x="56" y="96" width="14" height="40" rx="7" fill="#d9435f"/><rect x="130" y="96" width="14" height="40" rx="7" fill="#d9435f"/>
    <circle cx="100" cy="70" r="26" fill="#ffe1d2"/><circle cx="84" cy="80" r="6" fill="#ff8fab" opacity=".7"/><circle cx="116" cy="80" r="6" fill="#ff8fab" opacity=".7"/>
    <rect x="76" y="14" width="48" height="44" rx="10" fill="#2b1a2e"/><rect x="72" y="52" width="56" height="8" rx="4" fill="#ffd864"/><circle cx="100" cy="30" r="6" fill="#ffd864"/>
    <circle cx="90" cy="70" r="4" fill="#2b1a2e"/><circle cx="110" cy="70" r="4" fill="#2b1a2e"/><path d="M90 66 l-6 -3 M110 66 l6 -3" stroke="#2b1a2e" stroke-width="2"/>
    <path d="M94 84 h12" stroke="#c94a63" stroke-width="3" stroke-linecap="round"/>`,

  grr: (g) => `<defs>${grad(`${g}a`, '#c9a8ff', '#6f4ad0', true)}${grad(`${g}b`, '#ff8fb5', '#c9305a')}</defs>${shadow(80)}
    <path d="M44 90 C10 140 20 186 40 190 L160 190 C180 186 190 140 156 90Z" fill="url(#${g}b)"/>
    <path d="M52 92 C30 60 4 70 2 92 Q20 86 22 104 Q34 92 44 108Z" fill="#5a3aa8"/><path d="M148 92 C170 60 196 70 198 92 Q180 86 178 104 Q166 92 156 108Z" fill="#5a3aa8"/>
    <ellipse cx="100" cy="132" rx="56" ry="54" fill="url(#${g}a)"/>
    <path d="M62 84 C46 60 50 34 64 26 C64 50 72 66 82 76Z" fill="#fff6e0" stroke="#e6c99a" stroke-width="2"/>
    <path d="M138 84 C154 60 150 34 136 26 C136 50 128 66 118 76Z" fill="#fff6e0" stroke="#e6c99a" stroke-width="2"/>
    ${crown(100, 80, 1.2)}
    ${eyes(80, 120, 128, 9)}${grumpy(80, 120, 114)}${blush(64, 136, 148)}
    <path d="M86 156 Q100 146 114 156" stroke="#2b1a2e" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M90 152 l3 6 l3 -5" fill="#fff"/>
    <ellipse cx="60" cy="176" rx="14" ry="10" fill="#8a6ad8"/><ellipse cx="140" cy="176" rx="14" ry="10" fill="#8a6ad8"/>
    <path d="M150 150 Q180 150 178 120" stroke="#6f4ad0" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M172 112 l10 4 l-4 10Z" fill="#6f4ad0"/>`,
};

export function monster(id) {
  const g = `mo${++uid}`;
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${ART[id](g)}</svg>`;
}
