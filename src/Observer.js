import { Dependency } from './Dependency'
import { OptimizedWatcher } from './Watcher'

const watcher = OptimizedWatcher.getSingleton()
const dependencyStack = []
let uid = 0

class Observer {
  constructor (owner, key, getter, setter) {
    this.owner = owner
    this.key = key
    this.getter = this.getterFactory(getter)
    this.setter = setter && this.setterFactory(setter)
    this.dependencies = new Dependency(key)
    this.uid = uid++
    this.watchers = []
    this.observed = true
  }

  addWatcher (callback) {
    if (!watcher.observers[this.uid]) {
      watcher.observers[this.uid] = this
      watcher.cachedValues[this.uid] = this.getter()
    }
    if (!this.dependencies.watched) {
      this.dependencies.watch(this)
    }
    this.watchers.push(callback)
  }

  getterFactory (get) {
    return () => {
      if (!this.dependencies.valid) {
        this._value = this.captureDependencies(get)
        this.dependencies.valid = true
      }
      const activeDependency = dependencyStack[dependencyStack.length - 1]
      if (activeDependency) {
        activeDependency.addDep(this.dependencies)
      }
      return this._value
    }
  }

  setterFactory (set) {
    return (value) => {
      set.bind(this.owner)(value)
      this.dependencies.valid = false
    }
  }

  captureDependencies (get) {
    dependencyStack.push(this.dependencies)
    this.dependencies.recalc()
    const val = get.bind(this.owner)()
    dependencyStack.pop()
    return val
  }
}

module.exports = { Observer }
