/*!
 * Copyright 2017, nju33
 * Released under the MIT License
 * https://github.com/nju33/context-modal
 */
var ContextModal = (function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
});

var _aFunction = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding
var aFunction = _aFunction;
var _ctx = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

var _isObject = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var isObject = _isObject;
var _anObject = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

var isObject$1 = _isObject;
var document$1 = _global.document;
var is = isObject$1(document$1) && isObject$1(document$1.createElement);
var _domCreate = function(it){
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function(){
  return Object.defineProperty(_domCreate('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject$2 = _isObject;
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function(it, S){
  if(!isObject$2(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject$2(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject$2(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject$2(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

var anObject       = _anObject;
var IE8_DOM_DEFINE = _ie8DomDefine;
var toPrimitive    = _toPrimitive;
var dP$1             = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP$1(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

var dP         = _objectDp;
var createDesc = _propertyDesc;
var _hide = _descriptors ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

var global$1    = _global;
var core      = _core;
var ctx       = _ctx;
var hide      = _hide;
var PROTOTYPE = 'prototype';

var $export$1 = function(type, name, source){
  var IS_FORCED = type & $export$1.F
    , IS_GLOBAL = type & $export$1.G
    , IS_STATIC = type & $export$1.S
    , IS_PROTO  = type & $export$1.P
    , IS_BIND   = type & $export$1.B
    , IS_WRAP   = type & $export$1.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global$1 : IS_STATIC ? global$1[name] : (global$1[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global$1)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export$1.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export$1.F = 1;   // forced
$export$1.G = 2;   // global
$export$1.S = 4;   // static
$export$1.P = 8;   // proto
$export$1.B = 16;  // bind
$export$1.W = 32;  // wrap
$export$1.U = 64;  // safe
$export$1.R = 128; // real proto method for `library` 
var _export = $export$1;

var hasOwnProperty = {}.hasOwnProperty;
var _has = function(it, key){
  return hasOwnProperty.call(it, key);
};

var toString = {}.toString;

var _cof = function(it){
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _cof;
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject$1 = _iobject;
var defined = _defined;
var _toIobject = function(it){
  return IObject$1(defined(it));
};

// 7.1.4 ToInteger
var ceil  = Math.ceil;
var floor = Math.floor;
var _toInteger = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.1.15 ToLength
var toInteger = _toInteger;
var min       = Math.min;
var _toLength = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var toInteger$1 = _toInteger;
var max       = Math.max;
var min$1       = Math.min;
var _toIndex = function(index, length){
  index = toInteger$1(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes
var toIObject$1 = _toIobject;
var toLength  = _toLength;
var toIndex   = _toIndex;
var _arrayIncludes = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject$1($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var global$2 = _global;
var SHARED = '__core-js_shared__';
var store  = global$2[SHARED] || (global$2[SHARED] = {});
var _shared = function(key){
  return store[key] || (store[key] = {});
};

var id = 0;
var px = Math.random();
var _uid = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');
var uid    = _uid;
var _sharedKey = function(key){
  return shared[key] || (shared[key] = uid(key));
};

var has          = _has;
var toIObject    = _toIobject;
var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO     = _sharedKey('IE_PROTO');

var _objectKeysInternal = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = _objectKeysInternal;
var enumBugKeys = _enumBugKeys;

var _objectKeys = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

var f$1 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$1
};

var f$2 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$2
};

// 7.1.13 ToObject(argument)
var defined$1 = _defined;
var _toObject = function(it){
  return Object(defined$1(it));
};

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = _objectKeys;
var gOPS     = _objectGops;
var pIE      = _objectPie;
var toObject = _toObject;
var IObject  = _iobject;
var $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
var _objectAssign = !$assign || _fails(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;

// 19.1.3.1 Object.assign(target, source)
var $export = _export;

$export($export.S + $export.F, 'Object', {assign: _objectAssign});

var assign$2 = _core.Object.assign;

var assign$1 = createCommonjsModule(function (module) {
module.exports = { "default": assign$2, __esModule: true };
});

var _Object$assign = unwrapExports(assign$1);

var _extends = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;

var _assign = assign$1;

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};
});

var _extends$1 = unwrapExports(_extends);

var classCallCheck = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck = unwrapExports(classCallCheck);

var $export$2 = _export;
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export$2($export$2.S + $export$2.F * !_descriptors, 'Object', {defineProperty: _objectDp.f});

var $Object = _core.Object;
var defineProperty$3 = function defineProperty$3(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

var defineProperty$1 = createCommonjsModule(function (module) {
module.exports = { "default": defineProperty$3, __esModule: true };
});

var createClass = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;

var _defineProperty = defineProperty$1;

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
});

var _createClass = unwrapExports(createClass);

var NativeCustomEvent = commonjsGlobal.CustomEvent;

function useNative () {
  try {
    var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
    return  'cat' === p.type && 'bar' === p.detail.foo;
  } catch (e) {
  }
  return false;
}

/**
 * Cross-browser `CustomEvent` constructor.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
 *
 * @public
 */

var index = useNative() ? NativeCustomEvent :

// IE >= 9
'undefined' !== typeof document && 'function' === typeof document.createEvent ? function CustomEvent (type, params) {
  var e = document.createEvent('CustomEvent');
  if (params) {
    e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
  } else {
    e.initCustomEvent(type, false, false, void 0);
  }
  return e;
} :

// IE <= 8
function CustomEvent (type, params) {
  var e = document.createEventObject();
  e.type = type;
  if (params) {
    e.bubbles = Boolean(params.bubbles);
    e.cancelable = Boolean(params.cancelable);
    e.detail = params.detail;
  } else {
    e.bubbles = false;
    e.cancelable = false;
    e.detail = void 0;
  }
  return e;
};

var defaultOpts = {
  scrollable: document.body,
  transition: ['opacity .2s linear', 'none']
};

var ContextModalCollection = function () {
  function ContextModalCollection(trigger, ctx, ctxModal) {
    _classCallCheck(this, ContextModalCollection);

    this.trigger = trigger;
    this.eventType = this.trigger.getAttribute('data-context-modal-event-type') || 'click';
    this.ctx = ctx;
    this.ctxModal = ctxModal;

    this.showCtx = this._createShowCtx.bind(this);
    this.hideCtx = this._createHideCtx.bind(this);
    this.handleTransitionend = this._createTransitionendHandler.bind(this);
    this.ctx.addEventListener('transitionend', this.handleTransitionend);

    var detail = { collection: this };
    this.events = {
      contextmodalwillshow: new index('contextmodalwillshow', { detail: detail }),
      contextmodalwillhide: new index('contextmodalwillhide', { detail: detail }),
      contextmodaldidshow: new index('contextmodaldidshow', { detail: detail }),
      contextmodaldidhide: new index('contextmodaldidhide', { detail: detail })
    };
  }

  _createClass(ContextModalCollection, [{
    key: 'getPosition',
    value: function getPosition(offset) {
      var _this = this;

      var rect = this.trigger.getBoundingClientRect();
      var attr = this.trigger.getAttribute('data-context-modal-offset');
      offset = function () {
        switch (attr) {
          case 'left-top':
            {
              offset.offsetX = 0;
              offset.offsetY = 0;
              return offset;
            }
          case 'right-top':
            {
              offset.offsetX = _this.trigger.clientWidth;
              offset.offsetY = 0;
              return offset;
            }
          case 'left-bottom':
            {
              offset.offsetX = 0;
              offset.offsetY = _this.trigger.clientHeight;
              return offset;
            }
          case 'right-bottom':
            {
              offset.offsetX = _this.trigger.clientWidth;
              offset.offsetY = _this.trigger.clientHeight;
              return offset;
            }
          default:
            {
              return offset;
            }
        }
      }();

      return {
        left: function () {
          var left = rect.left + offset.offsetX;
          var overflow = left + _this.ctx.clientWidth - innerWidth;
          if (overflow > 0) {
            left -= overflow;
          }
          return left + 'px';
        }(),
        top: function () {
          var top = rect.top + offset.offsetY;
          var overflow = top + _this.ctx.clientHeight - innerHeight;
          if (overflow > 0) {
            top -= overflow;
          }
          return top + 'px';
        }()
      };
    }
  }, {
    key: 'addEventListener',
    value: function addEventListener() {
      this.trigger.addEventListener(this.eventType, this.showCtx);
    }
  }, {
    key: 'teardown',
    value: function teardown() {
      this.trigger.removeEventListener(this.eventType, this.showCtx);
      this.ctx.removeEventListener('transitionend', this.handleTransitionend);
    }
  }, {
    key: 'isVisible',
    value: function isVisible() {
      return this.ctxModal.active === this;
    }
  }, {
    key: 'hasTransition',
    value: function hasTransition() {
      if (getComputedStyle(this.ctx).transitionDuration === '0s') {
        return false;
      }
      return true;
    }
  }, {
    key: '_createTransitionendHandler',
    value: function _createTransitionendHandler() {
      if (this.isVisible()) {
        this.postShowCtx();
      } else {
        this.postHideCtx();
      }
    }
  }, {
    key: 'getScrollable',
    value: function getScrollable() {
      var scrollable = this.trigger.getAttribute('data-context-modal-scrollable');
      return scrollable && document.querySelector(scrollable) || this.ctxModal.opts.scrollable || defaultOpts.scrollable;
    }
  }, {
    key: 'getTransition',
    value: function getTransition(type) {
      if (type === 'show') {
        var onshow = this.trigger.getAttribute('data-context-modal-transition-for-onshow');
        return onshow || this.ctxModal.opts.transition[0] || defaultOpts.transition[0];
      }
      var onhide = this.trigger.getAttribute('data-context-modal-transition-for-onhide');
      return onhide || this.ctxModal.opts.transition[1] || defaultOpts.transition[1];
    }
  }, {
    key: '_createShowCtx',
    value: function _createShowCtx(ev) {
      var _this2 = this;

      var offsetX = ev.offsetX,
          offsetY = ev.offsetY;


      this.ctx.dispatchEvent(this.events.contextmodalwillshow);

      this.ctxModal.showWall();
      this.ctxModal.active = this;
      _Object$assign(this.ctx.style, {
        display: '',
        opacity: 0
      });
      setTimeout(function () {
        _Object$assign(_this2.ctx.style, _extends$1({
          webkitTransition: _this2.getTransition('show'),
          transition: _this2.getTransition('show'),
          position: 'fixed'
        }, _this2.getPosition({ offsetX: offsetX, offsetY: offsetY })));
        setTimeout(function () {
          _this2.activeScrollable = _this2.getScrollable();
          _this2.activeScrollable.style.overflow = 'hidden';
          _Object$assign(_this2.ctx.style, {
            opacity: 1,
            zIndex: 99999
          });
          if (!_this2.hasTransition()) {
            _this2.postShowCtx();
          }
        }, 0);
      }, 0);
    }
  }, {
    key: 'postShowCtx',
    value: function postShowCtx() {
      this.ctx.dispatchEvent(this.events.contextmodaldidshow);
    }
  }, {
    key: '_createHideCtx',
    value: function _createHideCtx() {
      var _this3 = this;

      this.ctx.dispatchEvent(this.events.contextmodalwillhide);

      _Object$assign(this.ctx.style, {
        webkitTransition: this.getTransition('hide'),
        transition: this.getTransition('hide')
      });
      setTimeout(function () {
        _Object$assign(_this3.ctx.style, {
          opacity: 0,
          zIndex: ''
        });
        setTimeout(function () {
          _this3.ctxModal.active = null;
          if (!_this3.hasTransition()) {
            _this3.postHideCtx();
          }
        }, 0);
      }, 0);
    }
  }, {
    key: 'postHideCtx',
    value: function postHideCtx() {
      _Object$assign(this.ctx.style, { display: 'none' });
      this.ctxModal.hideWall();
      if (this.activeScrollable) {
        this.activeScrollable.style.overflow = '';
        delete this.activeScrollable;
      }
      this.ctx.dispatchEvent(this.events.contextmodaldidhide);
    }
  }]);

  return ContextModalCollection;
}();

var ContextModal = function () {
  function ContextModal() {
    var _this4 = this;

    var els = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOpts;

    _classCallCheck(this, ContextModal);

    if (els === null) {
      throw new Error('Required `elements` with first argument');
    }

    if (els instanceof HTMLCollection || els instanceof NodeList) {
      els = Array.prototype.slice.call(els);
    }

    this.opts = _Object$assign({}, defaultOpts, opts);

    this.collections = els.map(function (el) {
      var id = el.getAttribute('data-context-modal-for');
      var ctx = document.querySelector('[data-context-modal-id=' + id + ']');
      if (id && ctx) {
        return new ContextModalCollection(el, ctx, _this4);
      }
      return null;
    }).filter(function (zip) {
      return zip !== null;
    });

    this.wall = null;
    this.active = null;
    this.handleClickOnWall = this._createClickOnWallHandler.bind(this);
  }

  _createClass(ContextModal, [{
    key: 'init',
    value: function init() {
      this.collections.forEach(function (collection) {
        collection.addEventListener();
      });
      this._createWall();
    }
  }, {
    key: 'teardown',
    value: function teardown() {
      if (this.active !== null) {
        throw new Error('Can not be teardown while a modal is visible');
      }
      this.collections.forEach(function (collection) {
        collection.teardown();
      });
      this.wall.removeEventListener('click', this.handleClickOnWall);
    }
  }, {
    key: '_createClickOnWallHandler',
    value: function _createClickOnWallHandler() {
      this.hideWall();
      if (this.active !== null) {
        this.active.hideCtx();
      }
    }
  }, {
    key: '_createWall',
    value: function _createWall() {
      this.wall = document.createElement('wall');
      _Object$assign(this.wall.style, {
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
  }, {
    key: 'showWall',
    value: function showWall() {
      this.wall.style.display = 'block';
    }
  }, {
    key: 'hideWall',
    value: function hideWall() {
      this.wall.style.display = 'none';
    }
  }]);

  return ContextModal;
}();

return ContextModal;

}());
