'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6ObjectAssign = require('es6-object-assign');

var _util = require('./util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaults = {
  scrollableClass: 'is-scrollable'
};

var ScrollHint = function () {
  function ScrollHint(ele, option) {
    var _this = this;

    _classCallCheck(this, ScrollHint);

    this.opt = (0, _es6ObjectAssign.assign)({}, defaults, option);
    this.items = [];
    var elements = typeof ele === 'string' ? document.querySelectorAll(ele) : ele;
    [].forEach.call(elements, function (element) {
      element.style.position = 'relative';
      element.style.overflow = 'auto';
      var item = {
        element: element,
        scrolledIn: false,
        interacted: false
      };
      element.addEventListener('scroll', function () {
        item.interacted = true;
        _this.updateItem(item);
      });
      (0, _util.append)(element, '<div class="scroll-hint"><span></span></div>');
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
    key: 'canScroll',
    value: function canScroll(item) {
      var element = item.element,
          scrolledIn = item.scrolledIn,
          interacted = item.interacted;

      return !interacted && scrolledIn && element.offsetHeight === element.scrollHeight && element.clientWidth <= element.scrollWidth;
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
    key: 'checkPosition',
    value: function checkPosition(item) {
      var element = item.element,
          scrolledIn = item.scrolledIn,
          interacted = item.interacted;

      if (scrolledIn) {
        return;
      }
      if ((0, _util.getOffset)(element).top < (0, _util.getScrollTop)() + window.innerHeight) {
        item.scrolledIn = true;
      }
    }
  }, {
    key: 'updateItem',
    value: function updateItem(item) {
      var opt = this.opt;
      var element = item.element;

      this.checkPosition(item);
      if (this.canScroll(item)) {
        (0, _util.addClass)(element, opt.scrollableClass);
      } else {
        (0, _util.removeClass)(element, opt.scrollableClass);
      }
    }
  }]);

  return ScrollHint;
}();

exports.default = ScrollHint;
module.exports = exports['default'];