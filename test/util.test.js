import { afterEach, describe, expect, it, vi } from 'vitest';
import { addClass, append, getOffset, getScrollLeft, getScrollTop, removeClass } from '../src/util';

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('append', () => {
  it('文字列をパースして全ての子要素を末尾に追加する', () => {
    const el = document.createElement('div');
    append(el, '<span>a</span><b>b</b>');
    expect(el.innerHTML).toBe('<span>a</span><b>b</b>');
  });
});

describe('addClass / removeClass', () => {
  it('classList がある場合はそれを使う', () => {
    const el = document.createElement('div');
    addClass(el, 'foo');
    expect(el.classList.contains('foo')).toBe(true);
    removeClass(el, 'foo');
    expect(el.classList.contains('foo')).toBe(false);
  });

  it('classList が無い場合は className を直接書き換える', () => {
    const el = { className: 'a foo b' };
    removeClass(el, 'foo');
    expect(el.className.split(/\s+/).filter(Boolean)).toEqual(['a', 'b']);
    addClass(el, 'bar');
    expect(el.className).toContain('bar');
  });
});

describe('getScrollTop / getScrollLeft', () => {
  it('window.pageYOffset / pageXOffset を返す', () => {
    vi.stubGlobal('pageYOffset', 120);
    vi.stubGlobal('pageXOffset', 30);
    expect(getScrollTop()).toBe(120);
    expect(getScrollLeft()).toBe(30);
    vi.unstubAllGlobals();
  });

  it('pageOffset が 0 のときは documentElement → body → 0 の順にフォールバックする', () => {
    vi.stubGlobal('pageYOffset', 0);
    vi.stubGlobal('pageXOffset', 0);
    expect(getScrollTop()).toBe(0);
    expect(getScrollLeft()).toBe(0);

    document.documentElement.scrollTop = 5;
    document.documentElement.scrollLeft = 6;
    expect(getScrollTop()).toBe(5);
    expect(getScrollLeft()).toBe(6);
    document.documentElement.scrollTop = 0;
    document.documentElement.scrollLeft = 0;

    vi.spyOn(document.body, 'scrollTop', 'get').mockReturnValue(7);
    vi.spyOn(document.body, 'scrollLeft', 'get').mockReturnValue(8);
    expect(getScrollTop()).toBe(7);
    expect(getScrollLeft()).toBe(8);
    vi.unstubAllGlobals();
  });
});

describe('getOffset', () => {
  it('getBoundingClientRect にスクロール量を加えた座標を返す', () => {
    vi.stubGlobal('pageYOffset', 100);
    vi.stubGlobal('pageXOffset', 50);
    const el = document.createElement('div');
    el.getBoundingClientRect = () => ({ top: 10, left: 20 });
    expect(getOffset(el)).toEqual({ top: 110, left: 70 });
    vi.unstubAllGlobals();
  });
});
