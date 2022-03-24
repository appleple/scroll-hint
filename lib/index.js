'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6ObjectAssign = require('es6-object-assign');

var _util = require('./util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaults = {
  suggestClass: 'is-active',
  scrollableClass: 'is-scrollable',
  scrollableRightClass: 'is-right-scrollable',
  scrollableLeftClass: 'is-left-scrollable',
  scrollHintClass: 'scroll-hint',
  scrollHintIconClass: 'scroll-hint-icon',
  scrollHintIconAppendClass: '', // 'scroll-hint-icon-white'
  scrollHintIconWrapClass: 'scroll-hint-icon-wrap',
  scrollHintText: 'scroll-hint-text',
  scrollHintBorderWidth: 10,
  remainingTime: -1,
  enableOverflowScrolling: true,
  applyToParents: false,
  suggestiveShadow: false,
  offset: 0,
  i18n: {
    scrollable: 'scrollable'
  }
};

var ScrollHint = function () {
  function ScrollHint(ele, option) {
    var _this = this;

    _classCallCheck(this, ScrollHint);

    this.opt = (0, _es6ObjectAssign.assign)({}, defaults, option);
    this.items = [];
    var elements = typeof ele === 'string' ? document.querySelectorAll(ele) : ele;
    var applyToParents = this.opt.applyToParents;

    [].forEach.call(elements, function (element) {
      if (applyToParents) {
        element = element.parentElement;
      }
      element.style.position = 'relative';
      element.style.overflow = 'auto';
      if (_this.opt.enableOverflowScrolling) {
        if ('overflowScrolling' in element.style) {
          element.style.overflowScrolling = 'touch';
        } else if ('webkitOverflowScrolling' in element.style) {
          element.style.webkitOverflowScrolling = 'touch';
        }
      }
      var item = {
        element: element,
        scrolledIn: false,
        interacted: false
      };
      document.addEventListener('scroll', function (e) {
        if (e.target === element) {
          item.interacted = true;
          _this.updateItem(item);
        }
      }, true);
      (0, _util.addClass)(element, _this.opt.scrollHintClass);
      (0, _util.append)(element, '<div class="' + _this.opt.scrollHintIconWrapClass + '" data-target="scrollable-icon">\n        <span class="' + _this.opt.scrollHintIconClass + (_this.opt.scrollHintIconAppendClass ? ' ' + _this.opt.scrollHintIconAppendClass : '') + '">\n          <div class="' + _this.opt.scrollHintText + '">' + _this.opt.i18n.scrollable + '</div>\n        </span>\n      </div>');
      _this.items.push(item);
    });
    window.addEventListener('scroll', function () {
      _this.updateItems();
    });
    window.addEventListener('resize', function () {
      _this.updateItems();
    });
    this.updateItems();
  }

  _createClass(ScrollHint, [{
    key: 'isScrollable',
    value: function isScrollable(item) {
      var offset = this.opt.offset;
      var element = item.element;
      var offsetWidth = element.offsetWidth;

      return offsetWidth + offset < element.scrollWidth;
    }
  }, {
    key: 'checkScrollableDir',
    value: function checkScrollableDir(item) {
      var _opt = this.opt,
          scrollHintBorderWidth = _opt.scrollHintBorderWidth,
          scrollableRightClass = _opt.scrollableRightClass,
          scrollableLeftClass = _opt.scrollableLeftClass;
      var element = item.element;

      var child = element.children[0];
      var width = child.scrollWidth;
      var parentWidth = element.offsetWidth;
      var scrollLeft = element.scrollLeft;
      if (parentWidth + scrollLeft < width - scrollHintBorderWidth) {
        (0, _util.addClass)(element, scrollableRightClass);
      } else {
        (0, _util.removeClass)(element, scrollableRightClass);
      }
      if (parentWidth < width && scrollLeft > scrollHintBorderWidth) {
        (0, _util.addClass)(element, scrollableLeftClass);
      } else {
        (0, _util.removeClass)(element, scrollableLeftClass);
      }
    }
  }, {
    key: 'needSuggest',
    value: function needSuggest(item) {
      var scrolledIn = item.scrolledIn,
          interacted = item.interacted;

      return !interacted && scrolledIn && this.isScrollable(item);
    }
  }, {
    key: 'updateItems',
    value: function updateItems() {
      var _this2 = this;

      [].forEach.call(this.items, function (item) {
        _this2.updateItem(item);
      });
    }
  }, {
    key: 'updateStatus',
    value: function updateStatus(item) {
      var _this3 = this;

      var element = item.element,
          scrolledIn = item.scrolledIn;

      if (scrolledIn) {
        return;
      }
      var target = element.querySelector('[data-target="scrollable-icon"] > span');
      if ((0, _util.getOffset)(target).top < (0, _util.getScrollTop)() + window.innerHeight) {
        item.scrolledIn = true;
        if (this.opt.remainingTime !== -1) {
          setTimeout(function () {
            item.interacted = true;
            _this3.updateItem(item);
          }, this.opt.remainingTime);
        }
      }
    }
  }, {
    key: 'updateItem',
    value: function updateItem(item) {
      var opt = this.opt;
      var element = item.element;

      var target = element.querySelector('[data-target="scrollable-icon"]');
      this.updateStatus(item);
      if (this.isScrollable(item)) {
        (0, _util.addClass)(element, opt.scrollableClass);
      } else {
        (0, _util.removeClass)(element, opt.scrollableClass);
      }
      if (this.needSuggest(item)) {
        (0, _util.addClass)(target, opt.suggestClass);
      } else {
        (0, _util.removeClass)(target, opt.suggestClass);
      }
      if (opt.suggestiveShadow) {
        this.checkScrollableDir(item);
      }
    }
  }]);

  return ScrollHint;
}();

exports.default = ScrollHint;
module.exports = exports['default'];