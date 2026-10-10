// 매달 고르는 활동. cost = 드는 돈, income = 버는 돈, gain = 능력치 변화
export const ACTIVITIES = {
  sword:    { id: 'sword', cat: 'study', name: '검술 교실', icon: '⚔️', cost: 30, income: 0, gain: { str: 6, vit: 2, fat: 10 }, line: '얍! 얍! 허수아비를 백 번 베었어요!' },
  magic:    { id: 'magic', cat: 'study', name: '마법 학교', icon: '🔮', cost: 40, income: 0, gain: { mgc: 6, int: 2, fat: 10 }, line: '반짝! 지팡이 끝에서 작은 별이 나왔어요!' },
  manners:  { id: 'manners', cat: 'study', name: '예절 교실', icon: '🫖', cost: 30, income: 0, gain: { gra: 6, cha: 2, fat: 8 }, line: '찻잔을 들 때는 새끼손가락을 살짝~' },
  school:   { id: 'school', cat: 'study', name: '학교 공부', icon: '📚', cost: 20, income: 0, gain: { int: 6, gra: 1, fat: 8 }, line: '구구단도, 왕국 역사도 척척!' },
  dance:    { id: 'dance', cat: 'study', name: '무용 교실', icon: '🩰', cost: 30, income: 0, gain: { cha: 6, vit: 2, fat: 10 }, line: '빙글빙글 한 바퀴! 박수가 쏟아졌어요.' },
  bakery:   { id: 'bakery', cat: 'job', name: '빵집', icon: '🥐', cost: 0, income: 60, gain: { vit: 1, cha: 1, fat: 12 }, line: '갓 구운 크루아상 냄새가 가득해요.' },
  florist:  { id: 'florist', cat: 'job', name: '꽃집', icon: '💐', cost: 0, income: 50, gain: { cha: 3, fat: 10 }, line: '예쁜 꽃다발을 스무 개나 만들었어요.' },
  library:  { id: 'library', cat: 'job', name: '도서관 사서', icon: '📖', cost: 0, income: 50, gain: { int: 3, fat: 10 }, line: '책 정리하다가 재미있는 책을 발견했어요!' },
  cleaning: { id: 'cleaning', cat: 'job', name: '성 청소', icon: '🧹', cost: 0, income: 70, gain: { vit: 2, fat: 14 }, line: '반짝반짝, 성 복도가 거울 같아졌어요.' },
  hunter:   { id: 'hunter', cat: 'job', name: '사냥꾼 도우미', icon: '🏹', cost: 0, income: 80, gain: { str: 3, fat: 15 }, line: '무거운 짐을 번쩍번쩍 날랐어요.' },
  rest:     { id: 'rest', cat: 'rest', name: '집에서 쉬기', icon: '🛏️', cost: 0, income: 0, gain: { fat: -40 }, line: '폭신한 침대에서 푹 잤어요. 쿨쿨…' },
  picnic:   { id: 'picnic', cat: 'rest', name: '소풍 가기', icon: '🧺', cost: 20, income: 0, gain: { fat: -30, cha: 2 }, line: '들판에서 샌드위치를 먹고 나비를 쫓았어요.' },
};

export const CATEGORIES = {
  study: { name: '공부', icon: '📚' },
  job: { name: '아르바이트', icon: '🧁' },
  rest: { name: '휴식', icon: '🛏️' },
};
