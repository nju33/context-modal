import CustomEvent from 'custom-event';

const defaultOpts = {
  scrollable: document.body,
  transition: ['opacity .2s linear', 'none']
};

class ContextModalCollection {
  constructor(trigger, ctx, ctxModal) {
    this.trigger = trigger;
    this.eventType =
      this.trigger.getAttribute('data-context-modal-event-type') || 'click';
    this.ctx = ctx;
    this.ctxModal = ctxModal;

    this.showCtx = this._createShowCtx.bind(this);
    this.hideCtx = this._createHideCtx.bind(this);
    this.handleTransitionend = this._createTransitionendHandler.bind(this);
    this.ctx.addEventListener('transitionend', this.handleTransitionend);

    const detail = {collection: this};
    this.events = {
      contextmodalwillshow: new CustomEvent('contextmodalwillshow', {detail}),
      contextmodalwillhide: new CustomEvent('contextmodalwillhide', {detail}),
      contextmodaldidshow: new CustomEvent('contextmodaldidshow', {detail}),
      contextmodaldidhide: new CustomEvent('contextmodaldidhide', {detail})
    };
  }

  getPosition(offset) {
    const rect = this.trigger.getBoundingClientRect();
    const attr = this.trigger.getAttribute('data-context-modal-offset');
    offset = (() => {
      switch (attr) {
        case 'left-top': {
          offset.offsetX = 0;
          offset.offsetY = 0;
          return offset;
        }
        case 'right-top': {
          offset.offsetX = this.trigger.clientWidth;
          offset.offsetY = 0;
          return offset;
        }
        case 'left-bottom': {
          offset.offsetX = 0;
          offset.offsetY = this.trigger.clientHeight;
          return offset;
        }
        case 'right-bottom': {
          offset.offsetX = this.trigger.clientWidth;
          offset.offsetY = this.trigger.clientHeight;
          return offset;
        }
        default: {
          return offset;
        }
      }
    })();

    return {
      left: (() => {
        let left = rect.left + offset.offsetX;
        const overflow = left + this.ctx.clientWidth - innerWidth;
        if (overflow > 0) {
          left -= overflow;
        }
        return left + 'px';
      })(),
      top: (() => {
        let top = rect.top + offset.offsetY;
        const overflow = top + this.ctx.clientHeight - innerHeight;
        if (overflow > 0) {
          top -= overflow;
        }
        return top + 'px';
      })()
    };
  }

  addEventListener() {
    this.trigger.addEventListener(this.eventType, this.showCtx);
  }

  teardown() {
    this.trigger.removeEventListener(this.eventType, this.showCtx);
    this.ctx.removeEventListener('transitionend', this.handleTransitionend);
  }

  isVisible() {
    return this.ctxModal.active === this;
  }

  hasTransition() {
    if (getComputedStyle(this.ctx).transitionDuration === '0s') {
      return false;
    }
    return true;
  }

  _createTransitionendHandler() {
    if (this.isVisible()) {
      this.postShowCtx();
    } else {
      this.postHideCtx();
    }
  }

  getScrollable() {
    const scrollable =
      this.trigger.getAttribute('data-context-modal-scrollable');
    return (scrollable && document.querySelector(scrollable)) ||
           this.ctxModal.opts.scrollable ||
           defaultOpts.scrollable;
  }

  getTransition(type) {
    if (type === 'show') {
      const onshow =
        this.trigger.getAttribute('data-context-modal-transition-for-onshow');
      return onshow ||
             this.ctxModal.opts.transition[0] ||
             defaultOpts.transition[0];
    }
    const onhide =
      this.trigger.getAttribute('data-context-modal-transition-for-onhide');
    return onhide ||
           this.ctxModal.opts.transition[1] ||
           defaultOpts.transition[1];
  }

  _createShowCtx(ev) {
    const {offsetX, offsetY} = ev;

    this.ctx.dispatchEvent(this.events.contextmodalwillshow);

    this.ctxModal.showWall();
    this.ctxModal.active = this;
    Object.assign(this.ctx.style, {
      display: '',
      opacity: 0
    });
    setTimeout(() => {
      Object.assign(this.ctx.style, {
        webkitTransition: this.getTransition('show'),
        transition: this.getTransition('show'),
        position: 'fixed',
        ...this.getPosition({offsetX, offsetY})
      });
      setTimeout(() => {
        this.activeScrollable = this.getScrollable();
        this.activeScrollable.style.overflow = 'hidden';
        Object.assign(this.ctx.style, {
          opacity: 1,
          zIndex: 99999
        });
        if (!this.hasTransition()) {
          this.postShowCtx();
        }
      }, 0);
    }, 0);
  }

  postShowCtx() {
    this.ctx.dispatchEvent(this.events.contextmodaldidshow);
  }

  _createHideCtx() {
    this.ctx.dispatchEvent(this.events.contextmodalwillhide);

    Object.assign(this.ctx.style, {
      webkitTransition: this.getTransition('hide'),
      transition: this.getTransition('hide')
    });
    setTimeout(() => {
      Object.assign(this.ctx.style, {
        opacity: 0,
        zIndex: ''
      });
      setTimeout(() => {
        this.ctxModal.active = null;
        if (!this.hasTransition()) {
          this.postHideCtx();
        }
      }, 0);
    }, 0);
  }

  postHideCtx() {
    Object.assign(this.ctx.style, {display: 'none'});
    this.ctxModal.hideWall();
    if (this.activeScrollable) {
      this.activeScrollable.style.overflow = '';
      delete this.activeScrollable;
    }
    this.ctx.dispatchEvent(this.events.contextmodaldidhide);
  }
}

export default class ContextModal {
  constructor(els = null, opts = defaultOpts) {
    if (els === null) {
      throw new Error('Required `elements` with first argument');
    }

    if (els instanceof HTMLCollection || els instanceof NodeList) {
      els = Array.prototype.slice.call(els);
    }

    this.opts = Object.assign({}, defaultOpts, opts);

    this.collections =
      els
        .map(el => {
          const id = el.getAttribute('data-context-modal-for');
          const ctx = document.querySelector(`[data-context-modal-id=${id}]`);
          if (id && ctx) {
            return new ContextModalCollection(el, ctx, this);
          }
          return null;
        })
        .filter(zip => zip !== null);

    this.wall = null;
    this.active = null;
    this.handleClickOnWall = this._createClickOnWallHandler.bind(this);
  }

  init() {
    this.collections.forEach(collection => {
      collection.addEventListener();
    });
    this._createWall();
  }

  teardown() {
    if (this.active !== null) {
      throw new Error('Can not be teardown while a modal is visible');
    }
    this.collections.forEach(collection => {
      collection.teardown();
    });
    this.wall.removeEventListener('click', this.handleClickOnWall);
  }

  _createClickOnWallHandler() {
    this.hideWall();
    if (this.active !== null) {
      this.active.hideCtx();
    }
  }

  _createWall() {
    this.wall = document.createElement('wall');
    Object.assign(this.wall.style, {
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      display: 'none'
    });
    document.body.appendChild(this.wall);
    this.wall.addEventListener('click', this.handleClickOnWall);
  }

  showWall() {
    this.wall.style.display = 'block';
  }

  hideWall() {
    this.wall.style.display = 'none';
  }
}
