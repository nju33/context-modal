# ContextModal

<!-- [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

[![Build Status](https://travis-ci.org/nju33/context-modal.svg?branch=master)](https://travis-ci.org/nju33/context-modal) -->

Display related elements with axis of trigger element. I made it to make it easy to make things like context-menu and dropdown, etc.


![screenshot](https://github.com/nju33/context-modal/raw/master/images/screenshot.gif?raw=true)

## Install or Download

```sh
yarn add context-modal
npm i -S context-modal
```

Or access to [releases page](https://github.com/nju33/context-modal/releases).
Then, download the latest version.

## Usage

First, if you read as a separate file

```html
<script src="/path/tp/context-modal.js"></script>
```

Markup is like this. (`test/fixtures/index.html`)

```html
<div data-context-modal-for="menu">Button</div>
<div data-context-modal-id="menu" style="display:none">
  <!-- Your designed element -->
</div>
```

```js
// For es
import ContextModal from 'context-modal';
const ctxModal = new ContextModal(document.querySelectorAll('[data-context-modal-for]'), {
  // 
  scrollable: document.body,
  transition: ['opacity .2s linear', 'none']
});
ctxModal.init();
```

### Example

- `test/fixtures/index.js`
- `example/webpack/index.js`

## LICENSE

The MIT License (MIT)

Copyright (c) 2017 nju33 <nju33.ki@gmail.com>
