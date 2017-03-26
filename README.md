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
<!-- [data-context-modal-event-type=click] is default -->
<div data-context-modal-for="menu" data-context-modal-event-type="click">Button</div>
<div data-context-modal-id="menu" style="display:none">
  <!-- Your designed element -->
</div>
```

`data-context-modal-for` works like `<label for>`, `data-context-modal-id` works as `<input id>`.
That is, `[data-context-modal-id=foo]` will be shown using something of `[data-context-modal-for=foo]` as a trigger.

The trigger is `click` by default, but you can change only that element by adding `data-context-modal-event-type`.

```js
// For es
import ContextModal from 'context-modal';
const ctxModal = new ContextModal(document.querySelectorAll('[data-context-modal-for]'), {
  // This is global opts

  // Elements to prevent scrolling while displaying
  //
  // Use `data-context-modal-scrollable`
  // if you want to change only certain elements
  scrollable: document.body,  // default

  // Transition values at `onshow` and `onhide`
  //
  // Use `data-context-modal-transition-for-onshow` or `data-context-modal-transition-for-onhide`
  // if you want to change only certain elements
  transition: ['opacity .2s linear', 'none']  // defaults
});
ctxModal.init();
```

After `ctxModal.init`, `[data-context-modal-id]` will be able to use the following events.

- `contextmodalwillshow`  
  Just before being shown
- `contextmodaldidshow`  
  After being shown (after transition)
- `contextmodalwillhide`  
  Just before hiding
- `contextmodaldidhide`  
  After hiding (after transition)

### Example

- `test/fixtures/index.js`
- `example/webpack/index.js`

## LICENSE

The MIT License (MIT)

Copyright (c) 2017 nju33 <nju33.ki@gmail.com>
