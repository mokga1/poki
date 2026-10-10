// 고를 수 있는 공주 후보 4명. 색·머리 모양은 art/avatar.js 가 그림에 사용한다.
export const CHARACTERS = {
  ruby: {
    id: 'ruby', name: '루비', trait: '용감하고 씩씩해요', tags: ['힘 ↑', '체력 ↑'], bonus: { str: 10, vit: 10 },
    hair: ['#ffa58a', '#e0475a'], hairHi: '#ffd2c4', eye: ['#9c1f35', '#ff7a6b'], dress: ['#ffb3c4', '#f0648f'],
    style: 'pony', k: '#ff9aae', k2: '#d9435f', t: '#ffe1e8',
    intro: '나는 루비! 무서운 건 하나도 없어. 마왕도 내가 혼내줄 거야!',
  },
  sapphire: {
    id: 'sapphire', name: '사파이어', trait: '책을 좋아하는 똑똑이', tags: ['지능 ↑', '마력 ↑'], bonus: { int: 10, mgc: 10 },
    hair: ['#9ccaff', '#4a6fd6'], hairHi: '#dceaff', eye: ['#1d3a8a', '#5aa8ff'], dress: ['#c9d4ff', '#7d8ff0'],
    style: 'long', k: '#9bb6ff', k2: '#4a62c8', t: '#e3ebff',
    intro: '안녕하세요, 사파이어예요. 마법책에 나오는 별빛 왕관… 꼭 직접 보고 싶었어요.',
  },
  rose: {
    id: 'rose', name: '로즈', trait: '상냥하고 다정해요', tags: ['매력 ↑', '기품 ↑'], bonus: { cha: 10, gra: 10 },
    hair: ['#ffc6e0', '#f0629f'], hairHi: '#fff0f7', eye: ['#a01d63', '#ff7fbf'], dress: ['#ffd1e6', '#f78ab8'],
    style: 'twin', k: '#ffa9cf', k2: '#d8478f', t: '#ffe6f2',
    intro: '로즈라고 해요♡ 모두가 웃는 왕국을 만들고 싶어요!',
  },
  emerald: {
    id: 'emerald', name: '에메랄드', trait: '뛰어놀기 대장 활발이', tags: ['체력 ↑', '매력 ↑'], bonus: { vit: 10, cha: 10 },
    hair: ['#b4ecb0', '#3faa72'], hairHi: '#eaffe6', eye: ['#17603c', '#5fd492'], dress: ['#fff1a8', '#f5c84a'],
    style: 'bob', k: '#9fe0b4', k2: '#2f9a62', t: '#e6fbea',
    intro: '에메랄드 등장! 숲이든 동굴이든 다 뛰어다닐 수 있어!',
  },
};
