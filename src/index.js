import { assign } from 'es6-object-assign';
import { append, addClass, removeClass, getScrollTop, getOffset } from './util';

const defaults = {
  scrollableClass: 'is-scrollable'
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
      append(element, `<div class="scroll-hint"><span></span></div>`);
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

  canScroll (item) {
    const { element, scrolledIn, interacted } = item;
    return !interacted && scrolledIn &&
    element.offsetHeight === element.scrollHeight && element.clientWidth <= element.scrollWidth;
  }

  updateItems () {
    [].forEach.call(this.items, (item) => {
      this.updateItem(item);
    });
  }

  checkPosition(item) {
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
    this.checkPosition(item);
    if (this.canScroll(item)) {
      addClass(element, opt.scrollableClass);
    } else {
      removeClass(element, opt.scrollableClass);
    }
  }

}
