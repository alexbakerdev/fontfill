/**
 * @module ReactiveClass
 * @private
 */
import { Observer } from './Observer'

const shadowValues = {}
const observers = {}
const reactiveIds = new Map()
let uid = 0

/**
 * A Class that is reactive
 * @private
 */
class ReactiveClass {

  /**
   * ReactiveClass Constructor
   * @return {ReactiveClass} - new instance of ReactiveClass
   */
  constructor () {
    reactiveIds.set(this, uid++)
    shadowValues[reactiveIds.get(this)] = {}
    observers[reactiveIds.get(this)] = {}
  }

  /**
   * Converts instance of class into a reactive object.
   * @private
   */
  reactive () {
    for (const property of Object.getOwnPropertyNames(this)) {
      this.$set(property, {value: this[property]})
    }

    const myPrototype = Object.getPrototypeOf(this)
    for (const property of Object.getOwnPropertyNames(myPrototype)) {
      if (['constructor'].indexOf(property) < 0) {
        const descriptor = Object.getOwnPropertyDescriptor(myPrototype, property)
        this.$set(property, descriptor)
      }
    }
  }

  /**
   * Watch an instance property
   * @param  {String}                      key      - Name of reactive property on instance to watch
   * @param  {ReactiveClass~watchCallback} callback - Callback to use
   */
  $watch (key, callback) {
    observers[reactiveIds.get(this)][key].addWatcher(callback)
  }

  /**
   * Set a new, reactive instance property. Should be used instead of
   * Object.defineProperty()
   * @param {String} key        - Property key
   * @param {Object} descriptor - Property descriptor
   */
  $set (key, descriptor) {
    let reactiveDescriptor = {}
    let observer
    if (!descriptor || (!descriptor.get && !descriptor.set)) {
      observer =
        new Observer(
          this,
          key,
          () => {
            return shadowValues[reactiveIds.get(this)][key]
          },
          (val) => {
            shadowValues[reactiveIds.get(this)][key] = val
          }
        )
      if (descriptor && (descriptor.value || descriptor.value === 0)) {
        shadowValues[reactiveIds.get(this)][key] = descriptor.value
      }
    } else if (descriptor) {
      observer = new Observer(this, key, descriptor.get, descriptor.set)
    }
    observers[reactiveIds.get(this)][key] = observer
    reactiveDescriptor.get = observer.getter
    reactiveDescriptor.set = observer.setter
    Object.defineProperty(this, key, reactiveDescriptor)
  }
}

/**
 * This callback is called when a watched property is changed.
 * @callback ReactiveClass~watchCallback
 * @param {Any} newValue
 * @param {Any} oldValue
 */

export { ReactiveClass }
