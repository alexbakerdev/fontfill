let singleton

/**
 * A class that uses amimation frames, and a settimeout fallback
 * to call a watched properties watcher callbacks
 * @private
 */
class OptimizedWatcher {
  constructor () {
    this.observers = {}
    this.cachedValues = {}
  }

  _loop () {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(this._runWatches.bind(this))
    } else {
      setTimeout(this._runWatches.bind(this), 0)
    }
  }

  _runWatches () {
    Object.keys(this.observers).forEach(observerId => {
      const observer = this.observers[observerId]
      if (!observer.changeObserved) {
        const oldValue = this.cachedValues[observerId]
        let newValue = observer.getter()
        this.cachedValues[observerId] = newValue
        observer.changeObserved = true
        if (oldValue !== newValue) {
          observer.watchers.forEach(watcher => {
            watcher(newValue, oldValue)
          })
        }
      }
    })
    this._loop()
  }

  static getSingleton () {
    if (!singleton) {
      singleton = new this()
      singleton._loop()
    }
    return singleton
  }
}

export { OptimizedWatcher }
