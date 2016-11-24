/**
 * Taken and adapted from https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
 */
let fillArray

if (!Array.prototype.fill) {
  fillArray = function (arr, ...args) {
    if (arr == null) {
      throw new TypeError('arr is null or not defined')
    }

    let O = Object(arr)

    let len = O.length >>> 0

    let start = arguments[1]
    let relativeStart = start >> 0

    let k = relativeStart < 0
      ? Math.max(len + relativeStart, 0)
      : Math.min(relativeStart, len)

    let end = arguments[2]
    let relativeEnd = end === undefined
      ? len : end >> 0

    let final = relativeEnd < 0
      ? Math.max(len + relativeEnd, 0)
      : Math.min(relativeEnd, len)

    let value = args[0]

    while (k < final) {
      O[k] = value
      k++
    }

    return O
  }
} else {
  fillArray = function (arr, ...args) {
    return arr.fill(...args)
  }
}

export { fillArray }
