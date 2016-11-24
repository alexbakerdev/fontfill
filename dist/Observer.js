'use strict';

var _Dependency = require('./Dependency');

var _Watcher = require('./Watcher');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var watcher = _Watcher.OptimizedWatcher.getSingleton();
var dependencyStack = [];
var uid = 0;

var Observer = function () {
  function Observer(owner, key, getter, setter) {
    _classCallCheck(this, Observer);

    this.owner = owner;
    this.key = key;
    this.getter = this.getterFactory(getter);
    this.setter = setter && this.setterFactory(setter);
    this.dependencies = new _Dependency.Dependency(key);
    this.uid = uid++;
    this.watchers = [];
    this.observed = true;
  }

  Observer.prototype.addWatcher = function addWatcher(callback) {
    if (!watcher.observers[this.uid]) {
      watcher.observers[this.uid] = this;
      watcher.cachedValues[this.uid] = this.getter();
    }
    if (!this.dependencies.watched) {
      this.dependencies.watch(this);
    }
    this.watchers.push(callback);
  };

  Observer.prototype.getterFactory = function getterFactory(get) {
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
  };

  Observer.prototype.setterFactory = function setterFactory(set) {
    var _this2 = this;

    return function (value) {
      set.bind(_this2.owner)(value);
      _this2.dependencies.valid = false;
    };
  };

  Observer.prototype.captureDependencies = function captureDependencies(get) {
    dependencyStack.push(this.dependencies);
    this.dependencies.recalc();
    var val = get.bind(this.owner)();
    dependencyStack.pop();
    return val;
  };

  return Observer;
}();

module.exports = { Observer: Observer };