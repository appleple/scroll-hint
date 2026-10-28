# ScrollHint

Suggests that the elements are scrollable horizontally, with the `pointer icon`.

<img src="./assets/demo.gif">

## Installation

### via npm

```sh
npm install scroll-hint --save
```

### via yarn

```sh
yarn add scroll-hint
```

### via cdn

```html
<link rel="stylesheet" href="https://unpkg.com/scroll-hint@latest/css/scroll-hint.css">
<script src="https://unpkg.com/scroll-hint@latest/js/scroll-hint.js"></script>
```


### Browser support

モダンブラウザ (Chrome / Edge / Firefox / Safari の最新版) が対象です。`Object.assign` を使うため IE11 は非対応です。
アイコンの縮小表示には CSS コンテナクエリ (`container-type: size`) を使います。非対応のブラウザでは縮小せず、はみ出した部分はクリップされます。

## Usage

import the js with babel and Browserify/Webpack

```js
import ScrollHint from 'scroll-hint';
new ScrollHint('.js-scrollable');
```

## Option

<table class="table-">
  <tr>
    <th style="text-align:left;">Name</th>
    <th style="text-align:left;">Default</th>
    <th style="text-align:left;">Description</th>
  </tr>
  <tr>
    <td><code>suggestClass</code></td>
    <td>is-active</td>
    <td>Classname to be added when the element is scrolled-in</td>
  </tr>
  <tr>
    <td><code>scrollableClass</code></td>
    <td>is-scrollable</td>
    <td>Classname to be added when the element is scrollable</td>
  </tr>
  <tr>
    <td><code>scrollableRightClass</code></td>
    <td>is-right-scrollable</td>
    <td>Classname to be added when the element is right-scrollable</td>
  </tr>
  <tr>
    <td><code>scrollableLeftClass</code></td>
    <td>is-left-scrollable</td>
    <td>Classname to be added when the element is left-scrollable</td>
  </tr>
  <tr>
    <td><code>scrollHintClass</code></td>
    <td>scroll-hint</td>
    <td>Classname to be added to the element</td>
  </tr>
  <tr>
    <td><code>scrollHintShadowWrapClass</code></td>
    <td>scroll-hint-shadow-wrap</td>
    <td>Class name added to the wrapper element for shadow effects</td>
  </tr>
  <tr>
    <td><code>scrollHintIconClass</code></td>
    <td>scroll-hint-icon</td>
    <td>Classname to be added to the icon</td>
  </tr>
  <tr>
    <td><code>scrollHintIconAppendClass</code></td>
    <td>scroll-hint-icon-white</td>
    <td>Another classname to be added to the element's icon</td>
  </tr>
  <tr>
    <td><code>scrollHintIconWrapClass</code></td>
    <td>scroll-hint-icon-wrap</td>
    <td>Classname to be added to the icon's wrapper</td>
  </tr>
  <tr>
    <td><code>scrollHintText</code></td>
    <td>scroll-hint-text</td>
    <td>Classname to be added to the text</td>
  </tr>
  <tr>
    <td><code>remainingTime</code></td>
    <td>-1</td>
    <td>When to hide scroll-hint icon (ms)</td>
  </tr>
  <tr>
    <td><code>scrollHintBorderWidth</code></td>
    <td>10</td>
    <td>Shadowbox border width of the element</td>
  </tr>
  <tr>
    <td><code>enableOverflowScrolling</code></td>
    <td>true</td>
    <td>When using iOS and the value is true,<br>
          -webkit-overflow-scrolling property will be added to the element</td>
  </tr>
  <tr>
    <td><code>suggestiveShadow</code></td>
    <td>false</td>
    <td>Show suggestive shadow, when the element is scrollable</td>
  </tr>
  <tr>
    <td><code>applyToParents</code></td>
    <td>false</td>
    <td>Apply JavaScript to the parent element</td>
  </tr>
  <tr>
    <td><code>offset</code></td>
    <td>0</td>
    <td>You can change criteria for scrollable.</td>
  </tr>
  <tr>
    <td><code>i18n.scrollable</code></td>
    <td>scrollable</td>
    <td>You can change the scrollable text from here</td>
  </tr>
</table>

## Development

`lib/` と `js/` はビルド成果物のため Git では管理せず、`npm publish` 時(`prepack`)に生成します。

```sh
npm ci
npm run dev        # ビルドの watch と examples/index.html の配信
npm test           # lint + テスト (カバレッジ 90% 未満で失敗)
npm run build      # lib/ (CJS/ESM) と js/ (ブラウザ向け) を生成
```

### Release

```sh
npm run release:patch   # minor / major も同様
```

`v*.*.*` タグを push すると GitHub Actions が npm の Trusted Publishing (OIDC) で公開します。
事前に npmjs.com 側で、このリポジトリの `publish.yml` を Trusted Publisher として登録してください。
