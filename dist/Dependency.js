"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uid = 0;

var Dependency = function () {
  function Dependency(key) {
    _classCallCheck(this, Dependency);

    this.dependencies = {};
    this.dependents = {};
    this.key = key;
    this.uid = uid++;
    this.valid = false;
    this.invalidationSubscriber = false;
  }

  Dependency.prototype.recalc = function recalc() {
    for (var _iterator = Object.keys(this.dependencies), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var dependencyID = _ref;

      var dependency = this.dependencies[dependencyID].dependency;
      delete dependency.dependents[this.uid];
    }
    this.dependencies = {};
    if (this._valid) {
      this.valid = false;
    }
  };

  Dependency.prototype.addDep = function addDep(dependency) {
    if (!this.dependencies[dependency.uid]) {
      this.dependencies[dependency.uid] = { dependency: dependency, valid: true };
    }
    dependency.subscribeDependent(this);
  };

  Dependency.prototype.subscribeDependent = function subscribeDependent(dependency) {
    this.dependents[dependency.uid] = dependency;
  };

  Dependency.prototype.invalidateDependency = function invalidateDependency(uid) {
    this.dependencies[uid].valid = false;
  };

  Dependency.prototype.watch = function watch(observer) {
    this.watched = true;
    this.observer = observer;
  };

  Dependency.prototype.invalidateSelf = function invalidateSelf() {
    if (this.watched && this._valid) {
      this.observer.changeObserved = false;
    }

    for (var _iterator2 = Object.keys(this.dependents), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var dependencyID = _ref2;

      var dependency = this.dependents[dependencyID];
      dependency.invalidateDependency(this.uid);
      dependency.valid = false;
    }
  };

  _createClass(Dependency, [{
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
      for (var _iterator3 = Object.keys(this.dependencies), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
        var _ref3;

        if (_isArray3) {
          if (_i3 >= _iterator3.length) break;
          _ref3 = _iterator3[_i3++];
        } else {
          _i3 = _iterator3.next();
          if (_i3.done) break;
          _ref3 = _i3.value;
        }

        var dependencyID = _ref3;

        var dependencyData = this.dependencies[dependencyID];
        if (!dependencyData.valid || !dependencyData.dependency.valid) {
          return false;
        }
      }
      return true;
    }
  }]);

  return Dependency;
}();

module.exports = { Dependency: Dependency };