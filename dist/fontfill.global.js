var fontfill =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(69);


/***/ },
/* 1 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(37)('wks')
	  , uid        = __webpack_require__(25)
	  , Symbol     = __webpack_require__(4).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(10)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 4 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(7)
	  , IE8_DOM_DEFINE = __webpack_require__(52)
	  , toPrimitive    = __webpack_require__(40)
	  , dP             = Object.defineProperty;
	
	exports.f = __webpack_require__(3) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(4)
	  , core      = __webpack_require__(1)
	  , ctx       = __webpack_require__(16)
	  , hide      = __webpack_require__(8)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
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
	    : IS_BIND && own ? ctx(out, global)
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
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(12);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(5)
	  , createDesc = __webpack_require__(23);
	module.exports = __webpack_require__(3) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(30)
	  , defined = __webpack_require__(19);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(58)
	  , enumBugKeys = __webpack_require__(28);
	
	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _defineProperty = __webpack_require__(46);
	
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

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(92);
	module.exports = function(fn, that, length){
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

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(19);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(7)
	  , dPs         = __webpack_require__(109)
	  , enumBugKeys = __webpack_require__(28)
	  , IE_PROTO    = __webpack_require__(36)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(51)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(103).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};
	
	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ },
/* 21 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(6)
	  , core    = __webpack_require__(1)
	  , fails   = __webpack_require__(10);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(5).f
	  , has = __webpack_require__(11)
	  , TAG = __webpack_require__(2)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _iterator = __webpack_require__(77);
	
	var _iterator2 = _interopRequireDefault(_iterator);
	
	var _symbol = __webpack_require__(76);
	
	var _symbol2 = _interopRequireDefault(_symbol);
	
	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 27 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var ctx         = __webpack_require__(16)
	  , call        = __webpack_require__(105)
	  , isArrayIter = __webpack_require__(104)
	  , anObject    = __webpack_require__(7)
	  , toLength    = __webpack_require__(39)
	  , getIterFn   = __webpack_require__(61)
	  , BREAK       = {}
	  , RETURN      = {};
	var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
	  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
	    , f      = ctx(fn, that, entries ? 2 : 1)
	    , index  = 0
	    , length, step, iterator, result;
	  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
	    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if(result === BREAK || result === RETURN)return result;
	  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
	    result = call(iterator, f, step.value, entries);
	    if(result === BREAK || result === RETURN)return result;
	  }
	};
	exports.BREAK  = BREAK;
	exports.RETURN = RETURN;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(27);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(32)
	  , $export        = __webpack_require__(6)
	  , redefine       = __webpack_require__(60)
	  , hide           = __webpack_require__(8)
	  , has            = __webpack_require__(11)
	  , Iterators      = __webpack_require__(17)
	  , $iterCreate    = __webpack_require__(106)
	  , setToStringTag = __webpack_require__(24)
	  , getPrototypeOf = __webpack_require__(57)
	  , ITERATOR       = __webpack_require__(2)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';
	
	var returnThis = function(){ return this; };
	
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(25)('meta')
	  , isObject = __webpack_require__(12)
	  , has      = __webpack_require__(11)
	  , setDesc  = __webpack_require__(5).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(10)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(21)
	  , createDesc     = __webpack_require__(23)
	  , toIObject      = __webpack_require__(9)
	  , toPrimitive    = __webpack_require__(40)
	  , has            = __webpack_require__(11)
	  , IE8_DOM_DEFINE = __webpack_require__(52)
	  , gOPD           = Object.getOwnPropertyDescriptor;
	
	exports.f = __webpack_require__(3) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 35 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(37)('keys')
	  , uid    = __webpack_require__(25);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(4)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 38 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(38)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(12);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(4)
	  , core           = __webpack_require__(1)
	  , LIBRARY        = __webpack_require__(32)
	  , wksExt         = __webpack_require__(42)
	  , defineProperty = __webpack_require__(5).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(2);

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(112)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(31)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(115);
	var global        = __webpack_require__(4)
	  , hide          = __webpack_require__(8)
	  , Iterators     = __webpack_require__(17)
	  , TO_STRING_TAG = __webpack_require__(2)('toStringTag');
	
	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(80), __esModule: true };

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(84), __esModule: true };

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(87), __esModule: true };

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(88), __esModule: true };

/***/ },
/* 49 */
/***/ function(module, exports) {

	module.exports = function(it, Constructor, name, forbiddenField){
	  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(27)
	  , TAG = __webpack_require__(2)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';
	
	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};
	
	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(12)
	  , document = __webpack_require__(4).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(3) && !__webpack_require__(10)(function(){
	  return Object.defineProperty(__webpack_require__(51)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(27);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 54 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(9)
	  , gOPN      = __webpack_require__(56).f
	  , toString  = {}.toString;
	
	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];
	
	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};
	
	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(58)
	  , hiddenKeys = __webpack_require__(28).concat('length', 'prototype');
	
	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(11)
	  , toObject    = __webpack_require__(18)
	  , IE_PROTO    = __webpack_require__(36)('IE_PROTO')
	  , ObjectProto = Object.prototype;
	
	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(11)
	  , toIObject    = __webpack_require__(9)
	  , arrayIndexOf = __webpack_require__(95)(false)
	  , IE_PROTO     = __webpack_require__(36)('IE_PROTO');
	
	module.exports = function(object, names){
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

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var hide = __webpack_require__(8);
	module.exports = function(target, src, safe){
	  for(var key in src){
	    if(safe && target[key])target[key] = src[key];
	    else hide(target, key, src[key]);
	  } return target;
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(8);

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(50)
	  , ITERATOR  = __webpack_require__(2)('iterator')
	  , Iterators = __webpack_require__(17);
	module.exports = __webpack_require__(1).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 62 */
/***/ function(module, exports) {



/***/ },
/* 63 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Taken and adapted from https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
	 */
	var fillArray = void 0;
	
	if (!Array.prototype.fill) {
	  exports.fillArray = fillArray = function fillArray(arr) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }
	
	    if (arr == null) {
	      throw new TypeError('arr is null or not defined');
	    }
	
	    var O = Object(arr);
	
	    var len = O.length >>> 0;
	
	    var start = arguments[1];
	    var relativeStart = start >> 0;
	
	    var k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);
	
	    var end = arguments[2];
	    var relativeEnd = end === undefined ? len : end >> 0;
	
	    var final = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);
	
	    var value = args[0];
	
	    while (k < final) {
	      O[k] = value;
	      k++;
	    }
	
	    return O;
	  };
	} else {
	  exports.fillArray = fillArray = function fillArray(arr) {
	    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	      args[_key2 - 1] = arguments[_key2];
	    }
	
	    return arr.fill.apply(arr, args);
	  };
	}
	
	exports.fillArray = fillArray;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _keys = __webpack_require__(48);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	var _getIterator2 = __webpack_require__(45);
	
	var _getIterator3 = _interopRequireDefault(_getIterator2);
	
	var _classCallCheck2 = __webpack_require__(14);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(15);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var uid = 0;
	
	var Dependency = function () {
	  function Dependency(key) {
	    (0, _classCallCheck3.default)(this, Dependency);
	
	    this.dependencies = {};
	    this.dependents = {};
	    this.key = key;
	    this.uid = uid++;
	    this.valid = false;
	    this.invalidationSubscriber = false;
	  }
	
	  (0, _createClass3.default)(Dependency, [{
	    key: "recalc",
	    value: function recalc() {
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(this.dependencies)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var dependencyID = _step.value;
	
	          var dependency = this.dependencies[dependencyID].dependency;
	          delete dependency.dependents[this.uid];
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      this.dependencies = {};
	      if (this._valid) {
	        this.valid = false;
	      }
	    }
	  }, {
	    key: "addDep",
	    value: function addDep(dependency) {
	      if (!this.dependencies[dependency.uid]) {
	        this.dependencies[dependency.uid] = { dependency: dependency, valid: true };
	      }
	      dependency.subscribeDependent(this);
	    }
	  }, {
	    key: "subscribeDependent",
	    value: function subscribeDependent(dependency) {
	      this.dependents[dependency.uid] = dependency;
	    }
	  }, {
	    key: "invalidateDependency",
	    value: function invalidateDependency(uid) {
	      this.dependencies[uid].valid = false;
	    }
	  }, {
	    key: "watch",
	    value: function watch(observer) {
	      this.watched = true;
	      this.observer = observer;
	    }
	  }, {
	    key: "invalidateSelf",
	    value: function invalidateSelf() {
	      if (this.watched && this._valid) {
	        this.observer.changeObserved = false;
	      }
	
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;
	
	      try {
	        for (var _iterator2 = (0, _getIterator3.default)((0, _keys2.default)(this.dependents)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var dependencyID = _step2.value;
	
	          var dependency = this.dependents[dependencyID];
	          dependency.invalidateDependency(this.uid);
	          dependency.valid = false;
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	    }
	  }, {
	    key: "valid",
	    set: function set(bool) {
	      if (!bool) {
	        this.invalidateSelf();
	      }
	      this._valid = bool;
	    },
	    get: function get() {
	      if (!this._valid) {
	        return false;
	      }
	      var _iteratorNormalCompletion3 = true;
	      var _didIteratorError3 = false;
	      var _iteratorError3 = undefined;
	
	      try {
	        for (var _iterator3 = (0, _getIterator3.default)((0, _keys2.default)(this.dependencies)), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	          var dependencyID = _step3.value;
	
	          var dependencyData = this.dependencies[dependencyID];
	          if (!dependencyData.valid || !dependencyData.dependency.valid) {
	            return false;
	          }
	        }
	      } catch (err) {
	        _didIteratorError3 = true;
	        _iteratorError3 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion3 && _iterator3.return) {
	            _iterator3.return();
	          }
	        } finally {
	          if (_didIteratorError3) {
	            throw _iteratorError3;
	          }
	        }
	      }
	
	      return true;
	    }
	  }]);
	  return Dependency;
	}();
	
	module.exports = { Dependency: Dependency };

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _classCallCheck2 = __webpack_require__(14);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(15);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _Dependency = __webpack_require__(64);
	
	var _Watcher = __webpack_require__(68);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var watcher = _Watcher.OptimizedWatcher.getSingleton();
	var dependencyStack = [];
	var uid = 0;
	
	var Observer = function () {
	  function Observer(owner, key, getter, setter) {
	    (0, _classCallCheck3.default)(this, Observer);
	
	    this.owner = owner;
	    this.key = key;
	    this.getter = this.getterFactory(getter);
	    this.setter = setter && this.setterFactory(setter);
	    this.dependencies = new _Dependency.Dependency(key);
	    this.uid = uid++;
	    this.watchers = [];
	    this.observed = true;
	  }
	
	  (0, _createClass3.default)(Observer, [{
	    key: 'addWatcher',
	    value: function addWatcher(callback) {
	      if (!watcher.observers[this.uid]) {
	        watcher.observers[this.uid] = this;
	        watcher.cachedValues[this.uid] = this.getter();
	      }
	      if (!this.dependencies.watched) {
	        this.dependencies.watch(this);
	      }
	      this.watchers.push(callback);
	    }
	  }, {
	    key: 'getterFactory',
	    value: function getterFactory(get) {
	      var _this = this;
	
	      return function () {
	        if (!_this.dependencies.valid) {
	          _this._value = _this.captureDependencies(get);
	          _this.dependencies.valid = true;
	        }
	        var activeDependency = dependencyStack[dependencyStack.length - 1];
	        if (activeDependency) {
	          activeDependency.addDep(_this.dependencies);
	        }
	        return _this._value;
	      };
	    }
	  }, {
	    key: 'setterFactory',
	    value: function setterFactory(set) {
	      var _this2 = this;
	
	      return function (value) {
	        set.bind(_this2.owner)(value);
	        _this2.dependencies.valid = false;
	      };
	    }
	  }, {
	    key: 'captureDependencies',
	    value: function captureDependencies(get) {
	      dependencyStack.push(this.dependencies);
	      this.dependencies.recalc();
	      var val = get.bind(this.owner)();
	      dependencyStack.pop();
	      return val;
	    }
	  }]);
	  return Observer;
	}();
	
	module.exports = { Observer: Observer };

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ReactiveClass = undefined;
	
	var _defineProperty = __webpack_require__(46);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	var _getOwnPropertyDescriptor = __webpack_require__(73);
	
	var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);
	
	var _getOwnPropertyNames = __webpack_require__(74);
	
	var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);
	
	var _getIterator2 = __webpack_require__(45);
	
	var _getIterator3 = _interopRequireDefault(_getIterator2);
	
	var _getPrototypeOf = __webpack_require__(47);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(14);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(15);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _map = __webpack_require__(70);
	
	var _map2 = _interopRequireDefault(_map);
	
	var _Observer = __webpack_require__(65);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var shadowValues = {}; /**
	                        * @module ReactiveClass
	                        */
	
	var observers = {};
	var reactiveIds = new _map2.default();
	var uid = 0;
	
	/**
	 * A Class that is reactive
	 */
	
	var ReactiveClass = function () {
	
	  /**
	   * ReactiveClass Constructor
	   * @return {ReactiveClass} [description]
	   */
	  function ReactiveClass() {
	    (0, _classCallCheck3.default)(this, ReactiveClass);
	
	    reactiveIds.set(this, uid++);
	    shadowValues[reactiveIds.get(this)] = {};
	    observers[reactiveIds.get(this)] = {};
	  }
	
	  /**
	   * Converts instance of class into a reactive object.
	   * @private
	   */
	
	
	  (0, _createClass3.default)(ReactiveClass, [{
	    key: 'reactive',
	    value: function reactive() {
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = (0, _getIterator3.default)((0, _getOwnPropertyNames2.default)(this)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var property = _step.value;
	
	          this.$set(property, { value: this[property] });
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      var myPrototype = (0, _getPrototypeOf2.default)(this);
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;
	
	      try {
	        for (var _iterator2 = (0, _getIterator3.default)((0, _getOwnPropertyNames2.default)(myPrototype)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var _property = _step2.value;
	
	          if (['constructor'].indexOf(_property) < 0) {
	            var descriptor = (0, _getOwnPropertyDescriptor2.default)(myPrototype, _property);
	            this.$set(_property, descriptor);
	          }
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	    }
	
	    /**
	     * Watch an instance property
	     * @param  {String}                      key      - Name of reactive property on instance to watch
	     * @param  {ReactiveClass~watchCallback} callback - Callback to use
	     */
	
	  }, {
	    key: '$watch',
	    value: function $watch(key, callback) {
	      observers[reactiveIds.get(this)][key].addWatcher(callback);
	    }
	
	    /**
	     * Set a new, reactive instance property. Should be used instead of
	     * Object.defineProperty()
	     * @param {String} key        - Property key
	     * @param {Object} descriptor - Property descriptor
	     */
	
	  }, {
	    key: '$set',
	    value: function $set(key, descriptor) {
	      var _this = this;
	
	      var reactiveDescriptor = {};
	      var observer = void 0;
	      if (!descriptor || !descriptor.get && !descriptor.set) {
	        observer = new _Observer.Observer(this, key, function () {
	          return shadowValues[reactiveIds.get(_this)][key];
	        }, function (val) {
	          shadowValues[reactiveIds.get(_this)][key] = val;
	        });
	        if (descriptor && descriptor.value) {
	          shadowValues[reactiveIds.get(this)][key] = descriptor.value;
	        }
	      } else if (descriptor) {
	        observer = new _Observer.Observer(this, key, descriptor.get, descriptor.set);
	      }
	      observers[reactiveIds.get(this)][key] = observer;
	      reactiveDescriptor.get = observer.getter;
	      reactiveDescriptor.set = observer.setter;
	      (0, _defineProperty2.default)(this, key, reactiveDescriptor);
	    }
	  }]);
	  return ReactiveClass;
	}();
	
	/**
	 * This callback is displayed as part of the Requester class.
	 * @callback ReactiveClass~watchCallback
	 * @param {Any} newValue
	 * @param {Any} oldValue
	 */
	
	exports.ReactiveClass = ReactiveClass;

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getBestFit = undefined;
	
	var _Array = __webpack_require__(63);
	
	var prevTime = Date.now();
	
	/**
	 * @todo tidy code
	 * @todo implement faster algorithm (SMAWK)
	 */
	/**
	 * @module ShortestPath
	 */
	
	/*eslint-disable*/
	function getBestFit(tokens, spaceSize, offsets, width, height, fontSize, lineHeight) {
	    var currentTime = Date.now();
	    if (currentTime - prevTime < 14) console.log('time since last ' + (currentTime - prevTime) / 1000);
	    prevTime = currentTime;
	    // for now assume one line desired
	    var count = tokens.length;
	    var lines = 1;
	    var heightRatio = height / (fontSize * lineHeight);
	    // figure out minimum lines
	    // should implement a binary search for this
	    var i = lines;
	    var finished = false;
	    var scale = false;
	    var previousBreakpoint = void 0;
	    while (!finished) {
	        var maxSpace = width / heightRatio * i * i;
	        for (var j = previousBreakpoint || 0; j < count + 1; j++) {
	            if (offsets[j] + (j + i - 1) * spaceSize > maxSpace) {
	                var needsNewLine = false;
	                var newMaxSpace = width / heightRatio * (i + 1) * i; // scale width as if new line, but don't actually use an i + 1 th line
	                for (var k = j + 1; k < count + 1; k++) {
	                    if (offsets[k] + (k + i - 1) * spaceSize > newMaxSpace) {
	                        needsNewLine = true;
	                        previousBreakpoint = k; // shouldn't find the breakpoint earlier than this
	                        break;
	                    }
	                }
	                if (!needsNewLine) {
	                    // we have min
	                    finished = true; // finish the while
	                    break; // from the for, not the while
	                } else {
	                    // we need moar lines
	                    i++;
	                }
	                break; // from the for, not the while
	            } else if (j === count) {
	                // from the for, and end while
	                finished = true;
	                break;
	            }
	        }
	    }
	    var minLines = i;
	    var maxLineWidth = void 0;
	    var largestLineSize = void 0;
	    function findMinima(scale, targetLines) {
	        var scaledWidth = scale * width / heightRatio;
	        var minima = [0].concat((0, _Array.fillArray)(Array(count), Infinity));
	        var breaks = (0, _Array.fillArray)(Array(count + 1), 0);
	        maxLineWidth = scaledWidth;
	        largestLineSize = 0;
	        for (var _i = 0; _i < count; _i++) {
	            var _j = _i + 1;
	            while (_j <= count) {
	                var w = offsets[_j] - offsets[_i] + (_j - _i) * spaceSize;
	                var cost = void 0;
	                if (w > scaledWidth) {
	                    break;
	                } else {
	                    cost = minima[_i] + Math.pow(scaledWidth - w, 2);
	                }
	                if (cost < minima[_j]) {
	                    minima[_j] = cost;
	                    breaks[_j] = _i;
	                }
	                _j += 1;
	            }
	        }
	
	        var lines = [];
	        var j = count;
	        while (j > 0) {
	            var _i2 = breaks[j];
	            var _width = offsets[j] - offsets[_i2] + (j - _i2) * spaceSize;
	            lines.push({ line: tokens.slice(_i2, j).join(' ') });
	            largestLineSize = Math.max(largestLineSize, _width);
	            if (lines.length > targetLines) return false;
	            j = _i2;
	        }
	        return lines;
	    }
	    var currentLines = minLines;
	    var results = void 0;
	    var trying = true;
	    while (trying) {
	        var _scale = currentLines;
	        results = findMinima(_scale, currentLines);
	        if (!results) {
	            currentLines++;
	        } else {
	            trying = false;
	        }
	    }
	    return {
	        results: results.reverse(),
	        targetLines: currentLines,
	        maxLineWidth: maxLineWidth,
	        largestLineSize: largestLineSize
	    };
	}
	
	exports.getBestFit = getBestFit;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.OptimizedWatcher = undefined;
	
	var _keys = __webpack_require__(48);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	var _classCallCheck2 = __webpack_require__(14);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(15);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var singleton = void 0;
	
	/**
	 * A class that uses amimation frames, and a settimeout fallback
	 * to call a watched properties watcher callbacks
	 */
	
	var OptimizedWatcher = function () {
	  function OptimizedWatcher() {
	    (0, _classCallCheck3.default)(this, OptimizedWatcher);
	
	    this.observers = {};
	    this.cachedValues = {};
	  }
	
	  (0, _createClass3.default)(OptimizedWatcher, [{
	    key: "_loop",
	    value: function _loop() {
	      if (window.requestAnimationFrame) {
	        window.requestAnimationFrame(this._runWatches.bind(this));
	      } else {
	        setTimeout(this._runWatches.bind(this), 0);
	      }
	    }
	  }, {
	    key: "_runWatches",
	    value: function _runWatches() {
	      var _this = this;
	
	      (0, _keys2.default)(this.observers).forEach(function (observerId) {
	        var observer = _this.observers[observerId];
	        if (!observer.changeObserved) {
	          (function () {
	            var oldValue = _this.cachedValues[observerId];
	            var newValue = observer.getter();
	            _this.cachedValues[observerId] = newValue;
	            observer.changeObserved = true;
	            if (oldValue !== newValue) {
	              observer.watchers.forEach(function (watcher) {
	                watcher(newValue, oldValue);
	              });
	            }
	          })();
	        }
	      });
	      this._loop();
	    }
	  }], [{
	    key: "getSingleton",
	    value: function getSingleton() {
	      if (!singleton) {
	        singleton = new this();
	        singleton._loop();
	      }
	      return singleton;
	    }
	  }]);
	  return OptimizedWatcher;
	}();
	
	exports.OptimizedWatcher = OptimizedWatcher;

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.AutoFittingText = undefined;
	
	var _typeof2 = __webpack_require__(26);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	var _getPrototypeOf = __webpack_require__(47);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _possibleConstructorReturn2 = __webpack_require__(79);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _createClass2 = __webpack_require__(15);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _inherits2 = __webpack_require__(78);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _assign = __webpack_require__(71);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _classCallCheck2 = __webpack_require__(14);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _ShortestPath = __webpack_require__(67);
	
	var _ReactiveClass2 = __webpack_require__(66);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * A canvas 2D Rendering Context element.
	 * @external CanvasRenderingContext2D
	 * @see {@link http://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D}
	 */
	
	/**
	 * @module fontfill
	 */
	
	var ctx = document.createElement('canvas').getContext('2d');
	var wordDeleminatorRegex = /[ ]/;
	
	/**
	 * A Class that represents the FittedText
	 * Metrics
	 */
	
	var TextMetric =
	/**
	 * TextMetric Constructor
	 * @param  {Object}   options                 - Constructor Options
	 * @param  {String[]} options.lines           - An array of strings, that represent the fitted text
	 * @param  {Number}   options.fillRatio       - a ratio that can be used to fill as much space
	 *                                              as possible (by scaling the font)
	 * @param  {Number}   options.maxLineWidth    - The maximum (scaled) line width allowed
	 * @param  {Number}   options.largestLineSize - The larget line width used
	 * @param  {Number}   options.targetLines     - The number of lines of the fitted text
	 * @param  {Number}   options.fontSize        - The fontSize to use for the fitted text
	 * @return {TextMetric}                       - New instance of TextMetric
	 */
	function TextMetric(_ref) {
	  var lines = _ref.lines,
	      fillRatio = _ref.fillRatio,
	      maxLineWidth = _ref.maxLineWidth,
	      largestLineSize = _ref.largestLineSize,
	      targetLines = _ref.targetLines,
	      fontSize = _ref.fontSize;
	  (0, _classCallCheck3.default)(this, TextMetric);
	
	  (0, _assign2.default)(this, arguments[0]);
	};
	
	/**
	 * AutoFittingText is a ReactiveClass, all of its computed
	 * getters are memoized, but also correctly invalidated and
	 * recalculated when a dependency is changed.
	 * @extends module:ReactiveClass~ReactiveClass
	 * @link ReactiveClass~ReactiveClass
	 */
	
	
	var AutoFittingText = function (_ReactiveClass) {
	  (0, _inherits3.default)(AutoFittingText, _ReactiveClass);
	  (0, _createClass3.default)(AutoFittingText, [{
	    key: 'context',
	
	    /**
	     * Static property that stores a shared shadow Canvas 2D Rendering Context element.
	     * @readOnly
	     * @const {external:CanvasRenderingContext2D}
	     */
	    get: function get() {
	      return ctx;
	    }
	
	    /**
	     * default fontMetricSize
	     * @readOnly
	     * @const {Number}
	     * @default 100
	     */
	
	  }, {
	    key: 'defaultFontMetricSize',
	    get: function get() {
	      return 100;
	    }
	
	    /**
	     * Regular Expression for splitting string into words
	     * @readOnly
	     * @const {RegExp}
	     */
	
	  }, {
	    key: 'wordDeleminatorRegex',
	    get: function get() {
	      return wordDeleminatorRegex;
	    }
	
	    /**
	     * String to fit
	     * @type {String}
	     */
	
	  }, {
	    key: 'targetString',
	    set: function set(txt) {
	      if (this._setProperty('_targetString', txt, 'string')) {
	        this._invalidTokens = true;
	      }
	    },
	    get: function get() {
	      return this._targetString;
	    }
	
	    /**
	     * FontFamiy to fit text with
	     * @type {String}
	     */
	
	  }, {
	    key: 'family',
	    set: function set(family) {
	      if (this._setProperty('_family', family, 'string')) {
	        this._invalidOffsets = true;
	        this.context.font = this.fontMetricsSize + 'px ' + this.family;
	      }
	    },
	    get: function get() {
	      return this._family;
	    }
	
	    /**
	     * The fontSize to use for calculating fontMetrics (small is
	     * faster, bigger is more precise)
	     * @type {Number}
	     */
	
	  }, {
	    key: 'fontMetricsSize',
	    set: function set(size) {
	      if (this._setProperty('_fontMetricsSize', size, 'number')) {
	        this._invalidSolution = true;
	        this.context.font = this.fontMetricsSize + 'px ' + this.family;
	      }
	    },
	    get: function get() {
	      return this._fontMetricsSize;
	    }
	
	    /**
	     * The line height to use when fitting text, as a scalar
	     * @type {Number}
	     */
	
	  }, {
	    key: 'lineHeight',
	    set: function set(lineHeight) {
	      if (this._setProperty('_lineHeight', lineHeight, 'number')) {
	        this._invalidSolution = true;
	      }
	    },
	    get: function get() {
	      return this._lineHeight;
	    }
	
	    /**
	     * Height to constrain text fit to, as a `px` value.
	     * @type {Number}
	     */
	
	  }, {
	    key: 'height',
	    set: function set(height) {
	      if (this._setProperty('_height', height, 'number')) {
	        this._invalidSolution = true;
	      }
	    },
	    get: function get() {
	      return this._height;
	    }
	
	    /**
	     * Width to constrain text fit to, as a `px` value.
	     * @type {Number}
	     */
	
	  }, {
	    key: 'width',
	    set: function set(width) {
	      if (this._setProperty('_width', width, 'number')) {
	        this._invalidSolution = true;
	      }
	    },
	    get: function get() {
	      return this._width;
	    }
	
	    // Computed Getters
	    // Memoized and Updateable thanks to ReactiveClass
	
	    /**
	     * The target string broken into an array of words split
	     * by wordDeleminatorRegex
	     * @readOnly
	     * @return {String[]}
	     */
	
	  }, {
	    key: 'tokens',
	    get: function get() {
	      return this.targetString.split(this.wordDeleminatorRegex);
	    }
	
	    /**
	     * The size of a rendered space with current
	     * fontMetricSize and family
	     * @readOnly
	     * @return {Number}
	     */
	
	  }, {
	    key: 'spaceSize',
	    get: function get() {
	      return this.context.measureText(' ').width;
	    }
	
	    /**
	     * A cumulative list of target string length, by word
	     * when rendered with current fontMetricSize and family
	     * @readOnly
	     * @return {Number[]}
	     */
	
	  }, {
	    key: 'offsets',
	    get: function get() {
	      var offsets = new Array(this.tokens.length + 1);
	      offsets[0] = 0;
	      for (var i = 0; i < this.tokens.length; i++) {
	        var token = this.tokens[i];
	        offsets[i + 1] = offsets[i] + this.context.measureText(token).width;
	      }
	      return offsets;
	    }
	
	    /**
	     * Metrics
	     * @readOnly
	     * @type {module:fontfill~TextMetric}
	     */
	
	  }, {
	    key: 'metrics',
	    get: function get() {
	      var bestFit = (0, _ShortestPath.getBestFit)(this.tokens, this.spaceSize, this.offsets, this.width, this.height, this.fontMetricsSize, this.lineHeight);
	
	      var lines = bestFit.results.map(function (_ref2) {
	        var line = _ref2.line;
	        return line;
	      });
	      var targetLines = bestFit.targetLines;
	      var fillRatio = 1;
	      if (targetLines > lines.length) {
	        var widthRatio = bestFit.maxLineWidth / bestFit.largestLineSize;
	        var heightRatio = targetLines / lines.length;
	        fillRatio = Math.min(widthRatio, heightRatio);
	      }
	
	      return new TextMetric({
	        lines: lines,
	        fillRatio: fillRatio,
	        maxLineWidth: bestFit.maxLineWidth,
	        largestLineSize: bestFit.largestLineSize,
	        targetLines: targetLines,
	        fontSize: roundDown(fillRatio * this.height / (targetLines * this.lineHeight))
	      });
	    }
	
	    /**
	     * AutoFittingText Constructor
	     * @param  {Number} width                   - Width to fit in px
	     * @param  {Number} height                  - Height to fit in px
	     * @param  {Object} options                 - Options:
	     * @param  {Number} options.lineHeight=1.2  - Scalar value for text line height
	     * @param  {String} options.family='Arial'  - Name of the font family to use
	     * @param  {String} options.targetString='' - String to fit
	     * @return {AutoFittingText}                - Instance of AutoFittingText
	     */
	
	  }]);
	
	  function AutoFittingText(width, height, _ref3) {
	    var lineHeight = _ref3.lineHeight,
	        family = _ref3.family,
	        targetString = _ref3.targetString;
	    (0, _classCallCheck3.default)(this, AutoFittingText);
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, (AutoFittingText.__proto__ || (0, _getPrototypeOf2.default)(AutoFittingText)).call(this));
	
	    _this.fontMetricsSize = _this.defaultFontMetricSize;
	    _this.width = width;
	    _this.height = height;
	
	    _this.lineHeight = lineHeight || 1.2;
	    _this.family = family || 'Arial';
	    _this.targetString = targetString || '';
	    _this.reactive();
	    return _this;
	  }
	
	  /**
	   * Helper function to validate value of property when set
	   * @private
	   * @param  {String}  prop  - Property name to validate
	   * @param  {Any}     val   - the value to validate
	   * @param  {String}  type  - the type the value should be
	   * @return {Boolean}       - Whether prop assignment was valid
	   * @throws {Error}         - If typeof val is not type
	   */
	
	
	  (0, _createClass3.default)(AutoFittingText, [{
	    key: '_setProperty',
	    value: function _setProperty(prop, val, type) {
	      var shouldBeString = type;
	
	      if (type && (typeof val === 'undefined' ? 'undefined' : (0, _typeof3.default)(val)) === type) {
	        // if ((params.validator && params.validator(val)) || (params.type && typeof val === params.type)) {
	        this[prop] = val;
	      } else {
	        throw new Error('AutoFittingText prop: ' + prop + ' should be ' + shouldBeString);
	      }
	
	      return true;
	    }
	  }]);
	  return AutoFittingText;
	}(_ReactiveClass2.ReactiveClass);
	
	function roundDown(n) {
	  return Math.floor(n * 100) / 100;
	}
	
	exports.AutoFittingText = AutoFittingText;

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(81), __esModule: true };

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(82), __esModule: true };

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(83), __esModule: true };

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(85), __esModule: true };

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(86), __esModule: true };

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(89), __esModule: true };

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(90), __esModule: true };

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(91), __esModule: true };

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _setPrototypeOf = __webpack_require__(75);
	
	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);
	
	var _create = __webpack_require__(72);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _typeof2 = __webpack_require__(26);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }
	
	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _typeof2 = __webpack_require__(26);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }
	
	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(44);
	__webpack_require__(43);
	module.exports = __webpack_require__(114);

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(62);
	__webpack_require__(43);
	__webpack_require__(44);
	__webpack_require__(116);
	__webpack_require__(126);
	module.exports = __webpack_require__(1).Map;

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(117);
	module.exports = __webpack_require__(1).Object.assign;

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(118);
	var $Object = __webpack_require__(1).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(119);
	var $Object = __webpack_require__(1).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(120);
	var $Object = __webpack_require__(1).Object;
	module.exports = function getOwnPropertyDescriptor(it, key){
	  return $Object.getOwnPropertyDescriptor(it, key);
	};

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(121);
	var $Object = __webpack_require__(1).Object;
	module.exports = function getOwnPropertyNames(it){
	  return $Object.getOwnPropertyNames(it);
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(122);
	module.exports = __webpack_require__(1).Object.getPrototypeOf;

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(123);
	module.exports = __webpack_require__(1).Object.keys;

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(124);
	module.exports = __webpack_require__(1).Object.setPrototypeOf;

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(125);
	__webpack_require__(62);
	__webpack_require__(127);
	__webpack_require__(128);
	module.exports = __webpack_require__(1).Symbol;

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(43);
	__webpack_require__(44);
	module.exports = __webpack_require__(42).f('iterator');

/***/ },
/* 92 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 93 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	var forOf = __webpack_require__(29);
	
	module.exports = function(iter, ITERATOR){
	  var result = [];
	  forOf(iter, false, result.push, result, ITERATOR);
	  return result;
	};


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(9)
	  , toLength  = __webpack_require__(39)
	  , toIndex   = __webpack_require__(113);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
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

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	// 0 -> Array#forEach
	// 1 -> Array#map
	// 2 -> Array#filter
	// 3 -> Array#some
	// 4 -> Array#every
	// 5 -> Array#find
	// 6 -> Array#findIndex
	var ctx      = __webpack_require__(16)
	  , IObject  = __webpack_require__(30)
	  , toObject = __webpack_require__(18)
	  , toLength = __webpack_require__(39)
	  , asc      = __webpack_require__(98);
	module.exports = function(TYPE, $create){
	  var IS_MAP        = TYPE == 1
	    , IS_FILTER     = TYPE == 2
	    , IS_SOME       = TYPE == 3
	    , IS_EVERY      = TYPE == 4
	    , IS_FIND_INDEX = TYPE == 6
	    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
	    , create        = $create || asc;
	  return function($this, callbackfn, that){
	    var O      = toObject($this)
	      , self   = IObject(O)
	      , f      = ctx(callbackfn, that, 3)
	      , length = toLength(self.length)
	      , index  = 0
	      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
	      , val, res;
	    for(;length > index; index++)if(NO_HOLES || index in self){
	      val = self[index];
	      res = f(val, index, O);
	      if(TYPE){
	        if(IS_MAP)result[index] = res;            // map
	        else if(res)switch(TYPE){
	          case 3: return true;                    // some
	          case 5: return val;                     // find
	          case 6: return index;                   // findIndex
	          case 2: result.push(val);               // filter
	        } else if(IS_EVERY)return false;          // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
	  };
	};

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(12)
	  , isArray  = __webpack_require__(53)
	  , SPECIES  = __webpack_require__(2)('species');
	
	module.exports = function(original){
	  var C;
	  if(isArray(original)){
	    C = original.constructor;
	    // cross-realm fallback
	    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
	    if(isObject(C)){
	      C = C[SPECIES];
	      if(C === null)C = undefined;
	    }
	  } return C === undefined ? Array : C;
	};

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
	var speciesConstructor = __webpack_require__(97);
	
	module.exports = function(original, length){
	  return new (speciesConstructor(original))(length);
	};

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var dP          = __webpack_require__(5).f
	  , create      = __webpack_require__(20)
	  , redefineAll = __webpack_require__(59)
	  , ctx         = __webpack_require__(16)
	  , anInstance  = __webpack_require__(49)
	  , defined     = __webpack_require__(19)
	  , forOf       = __webpack_require__(29)
	  , $iterDefine = __webpack_require__(31)
	  , step        = __webpack_require__(54)
	  , setSpecies  = __webpack_require__(111)
	  , DESCRIPTORS = __webpack_require__(3)
	  , fastKey     = __webpack_require__(33).fastKey
	  , SIZE        = DESCRIPTORS ? '_s' : 'size';
	
	var getEntry = function(that, key){
	  // fast case
	  var index = fastKey(key), entry;
	  if(index !== 'F')return that._i[index];
	  // frozen object case
	  for(entry = that._f; entry; entry = entry.n){
	    if(entry.k == key)return entry;
	  }
	};
	
	module.exports = {
	  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
	    var C = wrapper(function(that, iterable){
	      anInstance(that, C, NAME, '_i');
	      that._i = create(null); // index
	      that._f = undefined;    // first entry
	      that._l = undefined;    // last entry
	      that[SIZE] = 0;         // size
	      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    redefineAll(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear(){
	        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
	          entry.r = true;
	          if(entry.p)entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }
	        that._f = that._l = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function(key){
	        var that  = this
	          , entry = getEntry(that, key);
	        if(entry){
	          var next = entry.n
	            , prev = entry.p;
	          delete that._i[entry.i];
	          entry.r = true;
	          if(prev)prev.n = next;
	          if(next)next.p = prev;
	          if(that._f == entry)that._f = next;
	          if(that._l == entry)that._l = prev;
	          that[SIZE]--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /*, that = undefined */){
	        anInstance(this, C, 'forEach');
	        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
	          , entry;
	        while(entry = entry ? entry.n : this._f){
	          f(entry.v, entry.k, this);
	          // revert to the last existing entry
	          while(entry && entry.r)entry = entry.p;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key){
	        return !!getEntry(this, key);
	      }
	    });
	    if(DESCRIPTORS)dP(C.prototype, 'size', {
	      get: function(){
	        return defined(this[SIZE]);
	      }
	    });
	    return C;
	  },
	  def: function(that, key, value){
	    var entry = getEntry(that, key)
	      , prev, index;
	    // change existing entry
	    if(entry){
	      entry.v = value;
	    // create new entry
	    } else {
	      that._l = entry = {
	        i: index = fastKey(key, true), // <- index
	        k: key,                        // <- key
	        v: value,                      // <- value
	        p: prev = that._l,             // <- previous entry
	        n: undefined,                  // <- next entry
	        r: false                       // <- removed
	      };
	      if(!that._f)that._f = entry;
	      if(prev)prev.n = entry;
	      that[SIZE]++;
	      // add to index
	      if(index !== 'F')that._i[index] = entry;
	    } return that;
	  },
	  getEntry: getEntry,
	  setStrong: function(C, NAME, IS_MAP){
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    $iterDefine(C, NAME, function(iterated, kind){
	      this._t = iterated;  // target
	      this._k = kind;      // kind
	      this._l = undefined; // previous
	    }, function(){
	      var that  = this
	        , kind  = that._k
	        , entry = that._l;
	      // revert to the last existing entry
	      while(entry && entry.r)entry = entry.p;
	      // get next entry
	      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
	        // or finish the iteration
	        that._t = undefined;
	        return step(1);
	      }
	      // return step by kind
	      if(kind == 'keys'  )return step(0, entry.k);
	      if(kind == 'values')return step(0, entry.v);
	      return step(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);
	
	    // add [@@species], 23.1.2.2, 23.2.2.2
	    setSpecies(NAME);
	  }
	};

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var classof = __webpack_require__(50)
	  , from    = __webpack_require__(94);
	module.exports = function(NAME){
	  return function toJSON(){
	    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
	    return from(this);
	  };
	};

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global         = __webpack_require__(4)
	  , $export        = __webpack_require__(6)
	  , meta           = __webpack_require__(33)
	  , fails          = __webpack_require__(10)
	  , hide           = __webpack_require__(8)
	  , redefineAll    = __webpack_require__(59)
	  , forOf          = __webpack_require__(29)
	  , anInstance     = __webpack_require__(49)
	  , isObject       = __webpack_require__(12)
	  , setToStringTag = __webpack_require__(24)
	  , dP             = __webpack_require__(5).f
	  , each           = __webpack_require__(96)(0)
	  , DESCRIPTORS    = __webpack_require__(3);
	
	module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
	  var Base  = global[NAME]
	    , C     = Base
	    , ADDER = IS_MAP ? 'set' : 'add'
	    , proto = C && C.prototype
	    , O     = {};
	  if(!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
	    new C().entries().next();
	  }))){
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    redefineAll(C.prototype, methods);
	    meta.NEED = true;
	  } else {
	    C = wrapper(function(target, iterable){
	      anInstance(target, C, NAME, '_c');
	      target._c = new Base;
	      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
	    });
	    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','),function(KEY){
	      var IS_ADDER = KEY == 'add' || KEY == 'set';
	      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
	        anInstance(this, C, KEY);
	        if(!IS_ADDER && IS_WEAK && !isObject(a))return KEY == 'get' ? undefined : false;
	        var result = this._c[KEY](a === 0 ? 0 : a, b);
	        return IS_ADDER ? this : result;
	      });
	    });
	    if('size' in proto)dP(C.prototype, 'size', {
	      get: function(){
	        return this._c.size;
	      }
	    });
	  }
	
	  setToStringTag(C, NAME);
	
	  O[NAME] = C;
	  $export($export.G + $export.W + $export.F, O);
	
	  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);
	
	  return C;
	};

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(13)
	  , gOPS    = __webpack_require__(35)
	  , pIE     = __webpack_require__(21);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(4).document && document.documentElement;

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(17)
	  , ITERATOR   = __webpack_require__(2)('iterator')
	  , ArrayProto = Array.prototype;
	
	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(7);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(20)
	  , descriptor     = __webpack_require__(23)
	  , setToStringTag = __webpack_require__(24)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(8)(IteratorPrototype, __webpack_require__(2)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(13)
	  , toIObject = __webpack_require__(9);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(13)
	  , gOPS     = __webpack_require__(35)
	  , pIE      = __webpack_require__(21)
	  , toObject = __webpack_require__(18)
	  , IObject  = __webpack_require__(30)
	  , $assign  = Object.assign;
	
	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(10)(function(){
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

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(5)
	  , anObject = __webpack_require__(7)
	  , getKeys  = __webpack_require__(13);
	
	module.exports = __webpack_require__(3) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(12)
	  , anObject = __webpack_require__(7);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(16)(Function.call, __webpack_require__(34).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global      = __webpack_require__(4)
	  , core        = __webpack_require__(1)
	  , dP          = __webpack_require__(5)
	  , DESCRIPTORS = __webpack_require__(3)
	  , SPECIES     = __webpack_require__(2)('species');
	
	module.exports = function(KEY){
	  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
	  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
	    configurable: true,
	    get: function(){ return this; }
	  });
	};

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(38)
	  , defined   = __webpack_require__(19);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(38)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(7)
	  , get      = __webpack_require__(61);
	module.exports = __webpack_require__(1).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(93)
	  , step             = __webpack_require__(54)
	  , Iterators        = __webpack_require__(17)
	  , toIObject        = __webpack_require__(9);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(31)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(99);
	
	// 23.1 Map Objects
	module.exports = __webpack_require__(101)('Map', function(get){
	  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.1.3.6 Map.prototype.get(key)
	  get: function get(key){
	    var entry = strong.getEntry(this, key);
	    return entry && entry.v;
	  },
	  // 23.1.3.9 Map.prototype.set(key, value)
	  set: function set(key, value){
	    return strong.def(this, key === 0 ? 0 : key, value);
	  }
	}, strong, true);

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(6);
	
	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(108)});

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(6)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(20)});

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(6);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(3), 'Object', {defineProperty: __webpack_require__(5).f});

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject                 = __webpack_require__(9)
	  , $getOwnPropertyDescriptor = __webpack_require__(34).f;
	
	__webpack_require__(22)('getOwnPropertyDescriptor', function(){
	  return function getOwnPropertyDescriptor(it, key){
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 Object.getOwnPropertyNames(O)
	__webpack_require__(22)('getOwnPropertyNames', function(){
	  return __webpack_require__(55).f;
	});

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(18)
	  , $getPrototypeOf = __webpack_require__(57);
	
	__webpack_require__(22)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(18)
	  , $keys    = __webpack_require__(13);
	
	__webpack_require__(22)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(6);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(110).set});

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(4)
	  , has            = __webpack_require__(11)
	  , DESCRIPTORS    = __webpack_require__(3)
	  , $export        = __webpack_require__(6)
	  , redefine       = __webpack_require__(60)
	  , META           = __webpack_require__(33).KEY
	  , $fails         = __webpack_require__(10)
	  , shared         = __webpack_require__(37)
	  , setToStringTag = __webpack_require__(24)
	  , uid            = __webpack_require__(25)
	  , wks            = __webpack_require__(2)
	  , wksExt         = __webpack_require__(42)
	  , wksDefine      = __webpack_require__(41)
	  , keyOf          = __webpack_require__(107)
	  , enumKeys       = __webpack_require__(102)
	  , isArray        = __webpack_require__(53)
	  , anObject       = __webpack_require__(7)
	  , toIObject      = __webpack_require__(9)
	  , toPrimitive    = __webpack_require__(40)
	  , createDesc     = __webpack_require__(23)
	  , _create        = __webpack_require__(20)
	  , gOPNExt        = __webpack_require__(55)
	  , $GOPD          = __webpack_require__(34)
	  , $DP            = __webpack_require__(5)
	  , $keys          = __webpack_require__(13)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
	
	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;
	
	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};
	
	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};
	
	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};
	
	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });
	
	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(56).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(21).f  = $propertyIsEnumerable;
	  __webpack_require__(35).f = $getOwnPropertySymbols;
	
	  if(DESCRIPTORS && !__webpack_require__(32)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	
	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});
	
	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);
	
	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);
	
	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});
	
	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});
	
	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});
	
	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(8)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $export  = __webpack_require__(6);
	
	$export($export.P + $export.R, 'Map', {toJSON: __webpack_require__(100)('Map')});

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(41)('asyncIterator');

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(41)('observable');

/***/ }
/******/ ]);
//# sourceMappingURL=fontfill.global.js.map