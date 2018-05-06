import { assign } from 'es6-object-assign';
import { append, addClass, removeClass, getScrollTop, getOffset } from './util';

const defaults = {
  suggestClass: 'is-active',
  scrollableClass : 'is-scrollable',
  scrollHintClass: 'scroll-hint',
  scrollHintIconClass: 'scroll-hint-icon',
  scrollHintIconWrapClass: 'scroll-hint-icon-wrap'
}

export default class ScrollHint {
  constructor (ele, option) {
    this.opt = assign({}, defaults, option);
    this.items = [];
    const elements = typeof ele === 'string' ? document.querySelectorAll(ele) : ele;
    [].forEach.call(elements, (element) => {
      element.style.position = 'relative';
      element.style.overflow = 'auto';
      const item = {
        element,
        scrolledIn: false,
        interacted: false
      };
      element.addEventListener('scroll', () => {
        item.interacted = true;
        this.updateItem(item);
      });
      addClass(element, this.opt.scrollHintClass);
      append(element, `<div class="${this.opt.scrollHintIconWrapClass}" data-target="scrollable-icon">
        <span class="${this.opt.scrollHintIconClass}"></span>
      </div>`);
      this.items.push(item);
    });
    window.addEventListener('scroll', () => {
      this.updateItems();
    });
    window.addEventListener('resize', () => {
      this.updateItems();
    });
    this.updateItems();
  }

  isScrollable (item) {
    const { element } = item;
    return element.offsetHeight === element.scrollHeight && element.clientWidth <= element.scrollWidth;
  }

  needSuggest (item) {
    const { scrolledIn, interacted } = item;
    return !interacted && scrolledIn && this.isScrollable(item);
  }

  updateItems () {
    [].forEach.call(this.items, (item) => {
      this.updateItem(item);
    });
  }

  updateStatus(item) {
    const { element, scrolledIn, interacted } = item;
    if (scrolledIn) {
      return;
    }
    if (getOffset(element).top < getScrollTop() + window.innerHeight) {
      item.scrolledIn = true;
    }
  }

  updateItem (item) {
    const { opt } = this;
    const { element } = item;
    const target = element.querySelector(`[data-target="scrollable-icon"]`);
    this.updateStatus(item);
    if (this.isScrollable(item)) {
      addClass(element, opt.scrollableClass);
    } else {
      removeClass(element. opt.scrollableClass);
    }
    if (this.needSuggest(item)) {
      addClass(target, opt.suggestClass);
    } else {
      removeClass(target, opt.suggestClass);
    }
  }
}
