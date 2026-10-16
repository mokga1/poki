// 시작점: 화면 전환(router)과 공통 컨텍스트
import * as title from './screens/title.js';
import * as select from './screens/select.js';
import * as home from './screens/home.js';
import * as activity from './screens/activity.js';
import * as shop from './screens/shop.js';
import * as equipScreen from './screens/equip.js';
import * as adventure from './screens/adventure.js';
import * as battle from './screens/battle.js';
import * as ending from './screens/ending.js';
import * as gallery from './screens/gallery.js';
import * as slots from './screens/slots.js';
import { save, requestPersist } from './state.js';
import { toast } from './ui.js';
import { initSound } from './sound.js';
import { installStory } from './story.js';
import { chooseActivity, chooseRegion, talkToLulu, runEvents } from './flow.js';

const screens = { title, select, home, activity, shop, equip: equipScreen, adventure, battle, ending, gallery, slots };

const ctx = {
  state: null,
  go(name, params = {}) {
    const mod = screens[name];
    if (!mod) { toast('곧 만나요! (준비 중)'); return; }
    // 새 요소로 갈아끼워서 이전 화면의 이벤트 리스너가 남지 않게 한다
    const old = document.getElementById('screen');
    const root = old.cloneNode(false);
    old.replaceWith(root);
    root.className = `screen-${name}`;
    mod.render(root, ctx, params);
  },
  save() {
    if (ctx.state) save(ctx.state);
  },
  // 이야기 이벤트 실행 (예: 보스를 이긴 뒤 'bossWin')
  runEvents(hook, data) {
    return runEvents(ctx, hook, data);
  },
  // 메인 화면 버튼(공부·상점 등)이 부르는 동작들
  action(kind) {
    const f = actions[kind];
    if (f) f();
    else toast('곧 만나요! (준비 중)');
  },
};

const actions = {
  study: () => chooseActivity(ctx, 'study'),
  job: () => chooseActivity(ctx, 'job'),
  rest: () => chooseActivity(ctx, 'rest'),
  adventure: () => chooseRegion(ctx),
  shop: () => ctx.go('shop'),
  equip: () => ctx.go('equip'),
  gallery: () => ctx.go('gallery', { back: 'home' }),
  talk: () => talkToLulu(ctx, home.luluAdvice(ctx.state)),
};

// 콘솔에서 상태를 살펴볼 수 있게 (확인용)
window.princess = ctx;

initSound();
requestPersist();
installStory();
ctx.go('title');
