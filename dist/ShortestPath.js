'use strict';

exports.__esModule = true;
exports.getBestFit = undefined;

var _Array = require('./Array.fill');

var prevTime = Date.now();

/**
 * @todo tidy code
 * @todo implement faster algorithm (SMAWK)
 */
/**
 * @module ShortestPath
 */

/*eslint-disable*/
function getBestFit(tokens, spaceSize, offsets, width, height, fontSize, lineHeight) {
    var currentTime = Date.now();
    prevTime = currentTime;
    // for now assume one line desired
    var count = tokens.length;
    var lines = 1;
    var heightRatio = height / (fontSize * lineHeight);
    // figure out minimum lines
    // should implement a binary search for this
    var i = lines;
    var finished = false;
    var scale = false;
    var previousBreakpoint = void 0;
    while (!finished) {
        var maxSpace = width / heightRatio * i * i;
        for (var j = previousBreakpoint || 0; j < count + 1; j++) {
            if (offsets[j] + (j + i - 1) * spaceSize > maxSpace) {
                var needsNewLine = false;
                var newMaxSpace = width / heightRatio * (i + 1) * i; // scale width as if new line, but don't actually use an i + 1 th line
                for (var k = j + 1; k < count + 1; k++) {
                    if (offsets[k] + (k + i - 1) * spaceSize > newMaxSpace) {
                        needsNewLine = true;
                        previousBreakpoint = k; // shouldn't find the breakpoint earlier than this
                        break;
                    }
                }
                if (!needsNewLine) {
                    // we have min
                    finished = true; // finish the while
                    break; // from the for, not the while
                } else {
                    // we need moar lines
                    i++;
                }
                break; // from the for, not the while
            } else if (j === count) {
                // from the for, and end while
                finished = true;
                break;
            }
        }
    }
    var minLines = i;
    var maxLineWidth = void 0;
    var largestLineSize = void 0;
    function findMinima(scale, targetLines) {
        var scaledWidth = scale * width / heightRatio;
        var minima = [0].concat((0, _Array.fillArray)(Array(count), Infinity));
        var breaks = (0, _Array.fillArray)(Array(count + 1), 0);
        maxLineWidth = scaledWidth;
        largestLineSize = 0;
        for (var _i = 0; _i < count; _i++) {
            var _j = _i + 1;
            while (_j <= count) {
                var w = offsets[_j] - offsets[_i] + (_j - _i) * spaceSize;
                var cost = void 0;
                if (w > scaledWidth) {
                    break;
                } else {
                    cost = minima[_i] + Math.pow(scaledWidth - w, 2);
                }
                if (cost < minima[_j]) {
                    minima[_j] = cost;
                    breaks[_j] = _i;
                }
                _j += 1;
            }
        }

        var lines = [];
        var j = count;
        while (j > 0) {
            var _i2 = breaks[j];
            var _width = offsets[j] - offsets[_i2] + (j - _i2) * spaceSize;
            lines.push({ line: tokens.slice(_i2, j).join(' ') });
            largestLineSize = Math.max(largestLineSize, _width);
            if (lines.length > targetLines) return false;
            j = _i2;
        }
        return lines;
    }
    var currentLines = minLines;
    var results = void 0;
    var trying = true;
    while (trying) {
        var _scale = currentLines;
        results = findMinima(_scale, currentLines);
        if (!results) {
            currentLines++;
        } else {
            trying = false;
        }
    }
    return {
        results: results.reverse(),
        targetLines: currentLines,
        maxLineWidth: maxLineWidth,
        largestLineSize: largestLineSize
    };
}

exports.getBestFit = getBestFit;