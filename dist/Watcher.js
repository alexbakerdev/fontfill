"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var singleton = void 0;

/**
 * A class that uses amimation frames, and a settimeout fallback
 * to call a watched properties watcher callbacks
 */

var OptimizedWatcher = function () {
  function OptimizedWatcher() {
    _classCallCheck(this, OptimizedWatcher);

    this.observers = {};
    this.cachedValues = {};
  }

  OptimizedWatcher.prototype._loop = function _loop() {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(this._runWatches.bind(this));
    } else {
      setTimeout(this._runWatches.bind(this), 0);
    }
  };

  OptimizedWatcher.prototype._runWatches = function _runWatches() {
    var _this = this;

    Object.keys(this.observers).forEach(function (observerId) {
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
  };

  OptimizedWatcher.getSingleton = function getSingleton() {
    if (!singleton) {
      singleton = new this();
      singleton._loop();
    }
    return singleton;
  };

  return OptimizedWatcher;
}();

exports.OptimizedWatcher = OptimizedWatcher;