// 적 능력치. 수치는 tests/princess/balance.test.js 로 확인하며 조정한다.
// 목표: 숲 보스 레벨 3~4, 동굴 보스 레벨 7, 얼음 성 보스 레벨 10, 마왕 레벨 12 쯤에서 이길 수 있게.
export const ENEMIES = {
  slime:    { id: 'slime', name: '말랑 슬라임', skill: '말랑 박치기', hp: 26, atk: 8, def: 1, exp: 6, gold: 10 },
  bunny:    { id: 'bunny', name: '꽃 토끼', skill: '깡총 발차기', hp: 30, atk: 10, def: 2, exp: 7, gold: 12 },
  squirrel: { id: 'squirrel', name: '도토리 다람쥐', skill: '도토리 던지기', hp: 34, atk: 11, def: 3, exp: 8, gold: 14 },
  mushroom: { id: 'mushroom', name: '대왕 버섯 뭉게', skill: '포자 뿜뿜', hp: 140, atk: 24, def: 6, exp: 40, gold: 150, boss: true, gem: 'forest' },

  bat:    { id: 'bat', name: '박쥐 박박이', skill: '초음파 찍찍', hp: 70, atk: 20, def: 6, exp: 14, gold: 22 },
  turtle: { id: 'turtle', name: '돌멩이 거북', skill: '단단 박치기', hp: 90, atk: 18, def: 12, exp: 15, gold: 24 },
  crab:   { id: 'crab', name: '수정 게', skill: '집게 꼬집기', hp: 80, atk: 22, def: 9, exp: 16, gold: 26 },
  golem:  { id: 'golem', name: '수정 골렘 또각이', skill: '수정 주먹', hp: 220, atk: 32, def: 14, exp: 80, gold: 250, boss: true, gem: 'cave' },

  snowman:  { id: 'snowman', name: '눈사람 뭉치', skill: '눈덩이 던지기', hp: 110, atk: 30, def: 14, exp: 22, gold: 30 },
  icefairy: { id: 'icefairy', name: '얼음 요정 링', skill: '고드름 화살', hp: 100, atk: 34, def: 12, exp: 23, gold: 32 },
  penguin:  { id: 'penguin', name: '펭귄 기사', skill: '펭귄 찌르기', hp: 130, atk: 32, def: 18, exp: 24, gold: 34 },
  frosty:   { id: 'frosty', name: '눈의 여왕 프로스티', skill: '얼음 폭풍', hp: 260, atk: 38, def: 20, exp: 120, gold: 350, boss: true, gem: 'ice', drop: 'stardress' },

  ghost:   { id: 'ghost', name: '꼬마 유령 부우', skill: '깜짝 놀래키기', hp: 150, atk: 40, def: 20, exp: 30, gold: 40 },
  sheep:   { id: 'sheep', name: '구름 양', skill: '구름 박치기', hp: 170, atk: 38, def: 24, exp: 32, gold: 42 },
  soldier: { id: 'soldier', name: '장난감 병정', skill: '태엽 돌격', hp: 180, atk: 44, def: 26, exp: 34, gold: 46 },
  grr:     { id: 'grr', name: '심술 마왕 그르릉', skill: '심술 번개', hp: 340, atk: 43, def: 25, exp: 200, gold: 500, boss: true, gem: 'tower', drop: 'heartsword' },
};
