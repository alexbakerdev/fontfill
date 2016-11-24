let uid = 0

class Dependency {
  constructor (key) {
    this.dependencies = {}
    this.dependents = {}
    this.key = key
    this.uid = uid++
    this.valid = false
    this.invalidationSubscriber = false
  }

  recalc () {
    for (let dependencyID of Object.keys(this.dependencies)) {
      let dependency = this.dependencies[dependencyID].dependency
      delete dependency.dependents[this.uid]
    }
    this.dependencies = {}
    if (this._valid) {
      this.valid = false
    }
  }

  addDep (dependency) {
    if (!this.dependencies[dependency.uid]) {
      this.dependencies[dependency.uid] = { dependency: dependency, valid: true }
    }
    dependency.subscribeDependent(this)
  }

  subscribeDependent (dependency) {
    this.dependents[dependency.uid] = dependency
  }

  invalidateDependency (uid) {
    this.dependencies[uid].valid = false
  }

  watch (observer) {
    this.watched = true
    this.observer = observer
  }

  invalidateSelf () {
    if (this.watched && this._valid) {
      this.observer.changeObserved = false
    }

    for (let dependencyID of Object.keys(this.dependents)) {
      let dependency = this.dependents[dependencyID]
      dependency.invalidateDependency(this.uid)
      dependency.valid = false
    }
  }

  set valid (bool) {
    if (!bool) {
      this.invalidateSelf()
    }
    this._valid = bool
  }

  get valid () {
    if (!this._valid) {
      return false
    }
    for (let dependencyID of Object.keys(this.dependencies)) {
      let dependencyData = this.dependencies[dependencyID]
      if (!dependencyData.valid || !dependencyData.dependency.valid) {
        return false
      }
    }
    return true
  }
}

module.exports = { Dependency }
