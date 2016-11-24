/**
 * @module ShortestPath
 */

/*eslint-disable*/
import { fillArray } from './Array.fill'

let prevTime = Date.now()

/**
 * @todo tidy code
 * @todo implement faster algorithm (SMAWK)
 */
function getBestFit(tokens, spaceSize, offsets, width, height, fontSize, lineHeight) {
    let currentTime = Date.now()
    prevTime = currentTime
    // for now assume one line desired
    const count = tokens.length
    let lines = 1
    let heightRatio = height/(fontSize*lineHeight)
    // figure out minimum lines
    // should implement a binary search for this
    let i = lines
    let finished = false
    let scale = false
    let previousBreakpoint
    while (!finished) {
        let maxSpace = width/heightRatio * i * i
        for (let j = previousBreakpoint || 0; j < count+1; j++) {
            if (offsets[j] + (j + i - 1) * spaceSize > maxSpace) {
                let needsNewLine = false
                let newMaxSpace = width/heightRatio * (i + 1) * i // scale width as if new line, but don't actually use an i + 1 th line
                for (let k = j+1; k < count+1; k++) {
                    if (offsets[k] + ( k + i - 1) * spaceSize > newMaxSpace) {
                        needsNewLine = true
                        previousBreakpoint = k // shouldn't find the breakpoint earlier than this
                        break
                    }
                }
                if (!needsNewLine) {
                    // we have min
                    finished = true // finish the while
                    break // from the for, not the while
                } else {
                    // we need moar lines
                    i++
                }
                break // from the for, not the while
            } else if (j === count) {
                // from the for, and end while
                finished = true
                break
            }
        }
    }
    let minLines = i
    let maxLineWidth
    let largestLineSize
    function findMinima(scale, targetLines) {
        let scaledWidth = scale * width/heightRatio
        let minima = [0].concat(fillArray(Array(count), Infinity))
        let breaks = fillArray(Array(count + 1), 0)
        maxLineWidth = scaledWidth
        largestLineSize = 0
        for (let i = 0; i < count; i++) {
            let j = i + 1
            while (j <= count) {
                let w = offsets[j] - offsets[i] + (j - i) *spaceSize
                let cost
                if (w > scaledWidth) {
                    break
                } else {
                    cost = minima[i] + Math.pow((scaledWidth - w), 2)
                }
                if (cost < minima[j]) {
                    minima[j] = cost
                    breaks[j] = i
                }
                j += 1
            }
        }

        let lines = []
        let j = count
        while (j > 0) {
            let i = breaks[j]
            let width = offsets[j] - offsets[i] + (j - i) *spaceSize
            lines.push({line: tokens.slice(i, j).join(' ')})
            largestLineSize = Math.max(largestLineSize, width)
            if (lines.length > targetLines) return false
            j = i
        }
        return lines
    }
    let currentLines = minLines
    let results
    let trying = true
    while (trying) {
        let scale = currentLines
        results = findMinima(scale, currentLines)
        if (!results) {
            currentLines++
        } else {
            trying = false
        }
    }
    return {
        results: results.reverse(),
        targetLines: currentLines,
        maxLineWidth: maxLineWidth,
        largestLineSize: largestLineSize
    }
}

export { getBestFit }
