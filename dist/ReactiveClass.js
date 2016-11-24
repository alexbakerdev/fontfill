'use strict';

exports.__esModule = true;
exports.ReactiveClass = undefined;

var _Observer = require('./Observer');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * @module ReactiveClass
                                                                                                                                                           */


var shadowValues = {};
var observers = {};
var reactiveIds = new Map();
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
    _classCallCheck(this, ReactiveClass);

    reactiveIds.set(this, uid++);
    shadowValues[reactiveIds.get(this)] = {};
    observers[reactiveIds.get(this)] = {};
  }

  /**
   * Converts instance of class into a reactive object.
   * @private
   */


  ReactiveClass.prototype.reactive = function reactive() {
    for (var _iterator = Object.getOwnPropertyNames(this), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var property = _ref;

      this.$set(property, { value: this[property] });
    }

    var myPrototype = Object.getPrototypeOf(this);
    for (var _iterator2 = Object.getOwnPropertyNames(myPrototype), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var _property = _ref2;

      if (['constructor'].indexOf(_property) < 0) {
        var descriptor = Object.getOwnPropertyDescriptor(myPrototype, _property);
        this.$set(_property, descriptor);
      }
    }
  };

  /**
   * Watch an instance property
   * @param  {String}                      key      - Name of reactive property on instance to watch
   * @param  {ReactiveClass~watchCallback} callback - Callback to use
   */


  ReactiveClass.prototype.$watch = function $watch(key, callback) {
    observers[reactiveIds.get(this)][key].addWatcher(callback);
  };

  /**
   * Set a new, reactive instance property. Should be used instead of
   * Object.defineProperty()
   * @param {String} key        - Property key
   * @param {Object} descriptor - Property descriptor
   */


  ReactiveClass.prototype.$set = function $set(key, descriptor) {
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
    Object.defineProperty(this, key, reactiveDescriptor);
  };

  return ReactiveClass;
}();

/**
 * This callback is displayed as part of the Requester class.
 * @callback ReactiveClass~watchCallback
 * @param {Any} newValue
 * @param {Any} oldValue
 */

exports.ReactiveClass = ReactiveClass;