const assert = require('node:assert/strict');
const { test } = require('node:test');
const ScrollHint = require('../lib');

function directionClasses(scrollLeft) {
  const classes = new Set();
  const element = {
    // Simulate a text-only scroll container: the constructor's appended icon
    // wrapper is its first element child, but the text makes the container wider.
    children: [{ scrollWidth: 100 }],
    offsetWidth: 100,
    scrollWidth: 260,
    scrollLeft,
    classList: {
      add: name => classes.add(name),
      remove: name => classes.delete(name),
    },
  };

  const hint = Object.create(ScrollHint.prototype);
  hint.opt = {
    scrollHintBorderWidth: 10,
    scrollableRightClass: 'right-scrollable',
    scrollableLeftClass: 'left-scrollable',
  };
  hint.checkScrollableDir({ element });
  return classes;
}

test('suggestive shadows follow the scroll container width for text-only content', () => {
  assert.deepEqual([...directionClasses(0)].sort(), ['right-scrollable']);
  assert.deepEqual([...directionClasses(80)].sort(), ['left-scrollable', 'right-scrollable']);
  assert.deepEqual([...directionClasses(160)].sort(), ['left-scrollable']);
});
