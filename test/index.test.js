import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ScrollHint from '../src/index';

// jsdom はレイアウトを行わないため、寸法は defineProperty で差し込む。
const setMetrics = (el, { offsetWidth, scrollWidth, scrollLeft = 0 }) => {
  Object.defineProperty(el, 'offsetWidth', { configurable: true, value: offsetWidth });
  Object.defineProperty(el, 'scrollWidth', { configurable: true, value: scrollWidth });
  el.scrollLeft = scrollLeft;
};

const createContainer = (html = '<table><tr><td>cell</td></tr></table>') => {
  const el = document.createElement('div');
  el.innerHTML = html;
  document.body.appendChild(el);
  return el;
};

const iconWrap = (el) => el.querySelector('[data-target="scrollable-icon"]');

beforeEach(() => {
  // アイコンの getBoundingClientRect().top (= 0) を、画面内と判定させる
  vi.stubGlobal('innerHeight', 800);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('constructor', () => {
  it('HTMLElement を渡すとその要素を初期化する', () => {
    const el = createContainer();
    const hint = new ScrollHint(el);
    expect(hint.items).toHaveLength(1);
    expect(el.classList.contains('scroll-hint')).toBe(true);
    expect(el.style.position).toBe('relative');
    expect(el.style.overflow).toBe('auto');
    expect(iconWrap(el)).not.toBeNull();
  });

  it('セレクタ文字列で複数要素を初期化する', () => {
    createContainer().classList.add('target');
    createContainer().classList.add('target');
    expect(new ScrollHint('.target').items).toHaveLength(2);
  });

  it('NodeList / 配列も受け付ける', () => {
    const a = createContainer();
    const b = createContainer();
    a.classList.add('nodelist-target');
    b.classList.add('nodelist-target');
    expect(new ScrollHint([a, b]).items).toHaveLength(2);
    expect(new ScrollHint(document.querySelectorAll('.nodelist-target')).items).toHaveLength(2);
  });

  it('option でクラス名とテキストを上書きできる', () => {
    const el = createContainer();
    new ScrollHint(el, {
      scrollHintClass: 'my-hint',
      scrollHintIconClass: 'my-icon',
      scrollHintIconAppendClass: 'my-icon-white',
      scrollHintIconWrapClass: 'my-wrap',
      scrollHintText: 'my-text',
      i18n: { scrollable: 'スクロールできます' }
    });
    expect(el.classList.contains('my-hint')).toBe(true);
    expect(el.querySelector('.my-wrap > .my-icon.my-icon-white > .my-text').textContent).toBe('スクロールできます');
  });

  it('scrollHintIconAppendClass が空ならアイコンに余分なクラスを付けない', () => {
    const el = createContainer();
    new ScrollHint(el);
    expect(el.querySelector('.scroll-hint-icon').className).toBe('scroll-hint-icon');
  });

  it('applyToParents が true なら親要素を対象にする', () => {
    const parent = createContainer('<table></table>');
    const hint = new ScrollHint(parent.querySelector('table'), { applyToParents: true });
    expect(hint.items[0].element).toBe(parent);
  });

  it('suggestiveShadow が true ならラッパーで包む', () => {
    const el = createContainer();
    new ScrollHint(el, { suggestiveShadow: true });
    expect(el.parentNode.classList.contains('scroll-hint-shadow-wrap')).toBe(true);
  });

  describe('enableOverflowScrolling', () => {
    it('overflowScrolling が使える環境では touch を設定する', () => {
      const el = createContainer();
      el.style.overflowScrolling = '';
      new ScrollHint(el);
      expect(el.style.overflowScrolling).toBe('touch');
    });

    it('webkitOverflowScrolling のみの環境ではそちらを設定する', () => {
      const el = createContainer();
      el.style.webkitOverflowScrolling = '';
      new ScrollHint(el);
      expect(el.style.webkitOverflowScrolling).toBe('touch');
      expect('overflowScrolling' in el.style).toBe(false);
    });

    it('どちらも使えない環境では何も設定しない', () => {
      const el = createContainer();
      new ScrollHint(el);
      expect(el.style.overflowScrolling).toBeUndefined();
    });

    it('false の場合は設定しない', () => {
      const el = createContainer();
      el.style.overflowScrolling = '';
      new ScrollHint(el, { enableOverflowScrolling: false });
      expect(el.style.overflowScrolling).toBe('');
    });
  });

  it('window の scroll / resize で全アイテムを更新する', () => {
    const hint = new ScrollHint(createContainer());
    const spy = vi.spyOn(hint, 'updateItems');
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('resize'));
    expect(spy).toHaveBeenCalledTimes(2);
  });
});

describe('isScrollable', () => {
  it('scrollWidth が offsetWidth + offset を超えるとき true', () => {
    const el = createContainer();
    const hint = new ScrollHint(el);
    setMetrics(el, { offsetWidth: 100, scrollWidth: 200 });
    expect(hint.isScrollable(hint.items[0])).toBe(true);
    setMetrics(el, { offsetWidth: 100, scrollWidth: 100 });
    expect(hint.isScrollable(hint.items[0])).toBe(false);
  });

  it('offset を考慮する', () => {
    const el = createContainer();
    const hint = new ScrollHint(el, { offset: 50 });
    setMetrics(el, { offsetWidth: 100, scrollWidth: 140 });
    expect(hint.isScrollable(hint.items[0])).toBe(false);
    setMetrics(el, { offsetWidth: 100, scrollWidth: 160 });
    expect(hint.isScrollable(hint.items[0])).toBe(true);
  });
});

describe('checkScrollableDir', () => {
  const dirClasses = (el, scrollLeft, html) => {
    const container = el ?? createContainer(html);
    const hint = new ScrollHint(container, { scrollHintBorderWidth: 10 });
    setMetrics(container, { offsetWidth: 100, scrollWidth: 260, scrollLeft });
    hint.checkScrollableDir(hint.items[0]);
    return {
      right: container.classList.contains('is-right-scrollable'),
      left: container.classList.contains('is-left-scrollable')
    };
  };

  it('左端では右方向のみ', () => {
    expect(dirClasses(null, 0)).toEqual({ right: true, left: false });
  });

  it('中間では両方向', () => {
    expect(dirClasses(null, 80)).toEqual({ right: true, left: true });
  });

  it('右端では左方向のみ', () => {
    expect(dirClasses(null, 160)).toEqual({ right: false, left: true });
  });

  it('テキストのみのコンテナでも scrollWidth で判定する (先頭の子要素はアイコンラッパー)', () => {
    expect(dirClasses(null, 0, 'text only')).toEqual({ right: true, left: false });
  });
});

describe('needSuggest', () => {
  it.each([
    [{ scrolledIn: true, interacted: false }, true],
    [{ scrolledIn: false, interacted: false }, false],
    [{ scrolledIn: true, interacted: true }, false]
  ])('%j → %s', (state, expected) => {
    const el = createContainer();
    const hint = new ScrollHint(el);
    setMetrics(el, { offsetWidth: 100, scrollWidth: 200 });
    expect(hint.needSuggest({ element: el, ...state })).toBe(expected);
  });

  it('スクロール不要なら false', () => {
    const el = createContainer();
    const hint = new ScrollHint(el);
    setMetrics(el, { offsetWidth: 100, scrollWidth: 100 });
    expect(hint.needSuggest({ element: el, scrolledIn: true, interacted: false })).toBe(false);
  });
});

describe('updateStatus', () => {
  it('アイコンが画面内に入ったら scrolledIn になる', () => {
    const hint = new ScrollHint(createContainer());
    expect(hint.items[0].scrolledIn).toBe(true);
  });

  it('アイコンが画面外なら scrolledIn にならない', () => {
    vi.stubGlobal('innerHeight', 0);
    const hint = new ScrollHint(createContainer());
    expect(hint.items[0].scrolledIn).toBe(false);
  });

  it('scrolledIn 済みなら何もしない', () => {
    const el = createContainer();
    const hint = new ScrollHint(el);
    const spy = vi.spyOn(el, 'querySelector');
    hint.updateStatus(hint.items[0]);
    expect(spy).not.toHaveBeenCalled();
  });

  it('remainingTime 経過後に interacted になりヒントが消える', () => {
    vi.useFakeTimers();
    const el = createContainer();
    const hint = new ScrollHint(el, { remainingTime: 1000 });
    setMetrics(el, { offsetWidth: 100, scrollWidth: 200 });
    hint.updateItems();
    expect(iconWrap(el).classList.contains('is-active')).toBe(true);
    vi.advanceTimersByTime(1000);
    expect(hint.items[0].interacted).toBe(true);
    expect(iconWrap(el).classList.contains('is-active')).toBe(false);
  });

  it('remainingTime が -1 ならタイマーを使わない', () => {
    vi.useFakeTimers();
    new ScrollHint(createContainer());
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('updateItem', () => {
  it('スクロール可能なら is-scrollable と is-active を付ける', () => {
    const el = createContainer();
    const hint = new ScrollHint(el);
    setMetrics(el, { offsetWidth: 100, scrollWidth: 200 });
    hint.updateItems();
    expect(el.classList.contains('is-scrollable')).toBe(true);
    expect(iconWrap(el).classList.contains('is-active')).toBe(true);
  });

  it('スクロール不要なら両クラスを外す', () => {
    const el = createContainer();
    const hint = new ScrollHint(el);
    setMetrics(el, { offsetWidth: 100, scrollWidth: 200 });
    hint.updateItems();
    setMetrics(el, { offsetWidth: 100, scrollWidth: 100 });
    hint.updateItems();
    expect(el.classList.contains('is-scrollable')).toBe(false);
    expect(iconWrap(el).classList.contains('is-active')).toBe(false);
  });

  it('対象要素の scroll イベントで interacted になりヒントが消える', () => {
    const el = createContainer();
    const hint = new ScrollHint(el);
    setMetrics(el, { offsetWidth: 100, scrollWidth: 200 });
    hint.updateItems();
    el.dispatchEvent(new Event('scroll'));
    expect(hint.items[0].interacted).toBe(true);
    expect(iconWrap(el).classList.contains('is-active')).toBe(false);
  });

  it('他要素の scroll イベントは無視する', () => {
    const el = createContainer();
    const other = createContainer();
    const hint = new ScrollHint(el);
    other.dispatchEvent(new Event('scroll'));
    expect(hint.items[0].interacted).toBe(false);
  });

  it('suggestiveShadow が true のときだけ方向クラスを更新する', () => {
    const plain = createContainer();
    const shadow = createContainer();
    const hintPlain = new ScrollHint(plain);
    const hintShadow = new ScrollHint(shadow, { suggestiveShadow: true });
    setMetrics(plain, { offsetWidth: 100, scrollWidth: 260 });
    setMetrics(shadow, { offsetWidth: 100, scrollWidth: 260 });
    hintPlain.updateItems();
    hintShadow.updateItems();
    expect(plain.classList.contains('is-right-scrollable')).toBe(false);
    expect(shadow.classList.contains('is-right-scrollable')).toBe(true);
  });
});
