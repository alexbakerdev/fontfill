'use strict';

exports.__esModule = true;
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