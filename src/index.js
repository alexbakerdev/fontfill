/**
 * A canvas 2D Rendering Context element.
 * @external CanvasRenderingContext2D
 * @see {@link http://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D}
 */

/**
 * @module fontfill
 */

import { getBestFit } from './ShortestPath'
import { ReactiveClass } from './ReactiveClass'

const ctx = document.createElement('canvas').getContext('2d')
const wordDeleminatorRegex = /[ ]/

/**
 * A Class that represents the FittedText
 * Metrics
 */
class TextMetric {
  /**
   * TextMetric Constructor
   * @param  {Object}   options                 - Constructor Options
   * @param  {String[]} options.lines           - An array of strings, that represent the fitted text
   * @param  {Number}   options.fillRatio       - a ratio that can be used to fill as much space
   *                                              as possible (by scaling the font)
   * @param  {Number}   options.maxLineWidth    - The maximum (scaled) line width allowed
   * @param  {Number}   options.largestLineSize - The larget line width used
   * @param  {Number}   options.targetLines     - The number of lines of the fitted text
   * @param  {Number}   options.fontSize        - The fontSize to use for the fitted text
   * @return {TextMetric}                       - New instance of TextMetric
   */
  constructor ({
    lines,
    fillRatio,
    maxLineWidth,
    largestLineSize,
    targetLines,
    fontSize
  }) {
    Object.assign(this, arguments[0])
  }
}

/**
 * AutoFittingText is a ReactiveClass, all of its computed
 * getters are memoized, but also correctly invalidated and
 * recalculated when a dependency is changed.
 * @extends module:ReactiveClass~ReactiveClass
 * @link ReactiveClass~ReactiveClass
 */
class AutoFittingText extends ReactiveClass {
  /**
   * Static property that stores a shared shadow Canvas 2D Rendering Context element.
   * @readOnly
   * @const {external:CanvasRenderingContext2D}
   */
  get context () {
    return ctx
  }

  /**
   * default fontMetricSize
   * @readOnly
   * @const {Number}
   * @default 100
   */
  get defaultFontMetricSize () {
    return 100
  }

  /**
   * Regular Expression for splitting string into words
   * @readOnly
   * @const {RegExp}
   */
  get wordDeleminatorRegex () {
    return wordDeleminatorRegex
  }

  /**
   * String to fit
   * @type {String}
   */
  set targetString (txt) {
    if (this._setProperty('_targetString', txt, 'string')) {
      this._invalidTokens = true
    }
  }

  get targetString () {
    return this._targetString
  }

  /**
   * FontFamiy to fit text with
   * @type {String}
   */
  set family (family) {
    if (this._setProperty('_family', family, 'string')) {
      this._invalidOffsets = true
      this.context.font = `${this.fontMetricsSize}px ${this.family}`
    }
  }

  get family () {
    return this._family
  }

  /**
   * The fontSize to use for calculating fontMetrics (small is
   * faster, bigger is more precise)
   * @type {Number}
   */
  set fontMetricsSize (size) {
    if (this._setProperty('_fontMetricsSize', size, 'number')) {
      this._invalidSolution = true
      this.context.font = `${this.fontMetricsSize}px ${this.family}`
    }
  }

  get fontMetricsSize () {
    return this._fontMetricsSize
  }

  /**
   * The line height to use when fitting text, as a scalar
   * @type {Number}
   */
  set lineHeight (lineHeight) {
    if (this._setProperty('_lineHeight', lineHeight, 'number')) {
      this._invalidSolution = true
    }
  }

  get lineHeight () {
    return this._lineHeight
  }

  /**
   * Height to constrain text fit to, as a `px` value.
   * @type {Number}
   */
  set height (height) {
    if (this._setProperty('_height', height, 'number')) {
      this._invalidSolution = true
    }
  }

  get height () {
    return this._height
  }

  /**
   * Width to constrain text fit to, as a `px` value.
   * @type {Number}
   */
  set width (width) {
    if (this._setProperty('_width', width, 'number')) {
      this._invalidSolution = true
    }
  }

  get width () {
    return this._width
  }

  // Computed Getters
  // Memoized and Updateable thanks to ReactiveClass

  /**
   * The target string broken into an array of words split
   * by wordDeleminatorRegex
   * @readOnly
   * @return {String[]}
   */
  get tokens () {
    return this.targetString.split(this.wordDeleminatorRegex)
  }

  /**
   * The size of a rendered space with current
   * fontMetricSize and family
   * @readOnly
   * @return {Number}
   */
  get spaceSize () {
    return this.context.measureText(' ').width
  }

  /**
   * A cumulative list of target string length, by word
   * when rendered with current fontMetricSize and family
   * @readOnly
   * @return {Number[]}
   */
  get offsets () {
    let offsets = new Array(this.tokens.length + 1)
    offsets[0] = 0
    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i]
      offsets[i + 1] = offsets[i] + this.context.measureText(token).width
    }
    return offsets
  }

  /**
   * Metrics
   * @readOnly
   * @type {module:fontfill~TextMetric}
   */
  get metrics () {
    const bestFit = getBestFit(
      this.tokens,
      this.spaceSize,
      this.offsets,
      this.width,
      this.height,
      this.fontMetricsSize,
      this.lineHeight
    )

    const lines = bestFit.results.map(({line}) => line)
    const targetLines = bestFit.targetLines
    let fillRatio = 1
    if (targetLines > lines.length) {
      let widthRatio = bestFit.maxLineWidth / bestFit.largestLineSize
      let heightRatio = targetLines / lines.length
      fillRatio = Math.min(widthRatio, heightRatio)
    }

    return new TextMetric({
      lines,
      fillRatio,
      maxLineWidth: bestFit.maxLineWidth,
      largestLineSize: bestFit.largestLineSize,
      targetLines: targetLines,
      fontSize: roundDown(fillRatio * this.height / (targetLines * this.lineHeight))
    })
  }

  /**
   * AutoFittingText Constructor
   * @param  {Number} width                   - Width to fit in px
   * @param  {Number} height                  - Height to fit in px
   * @param  {Object} options                 - Options:
   * @param  {Number} options.lineHeight=1.2  - Scalar value for text line height
   * @param  {String} options.family='Arial'  - Name of the font family to use
   * @param  {String} options.targetString='' - String to fit
   * @return {AutoFittingText}                - Instance of AutoFittingText
   */
  constructor (width, height, {lineHeight, family, targetString}) {
    super()
    this.fontMetricsSize = this.defaultFontMetricSize
    this.width = width
    this.height = height

    this.lineHeight = lineHeight || 1.2
    this.family = family || 'Arial'
    this.targetString = targetString || ''
    this.reactive()
  }

  /**
   * Helper function to validate value of property when set
   * @private
   * @param  {String}  prop  - Property name to validate
   * @param  {Any}     val   - the value to validate
   * @param  {String}  type  - the type the value should be
   * @return {Boolean}       - Whether prop assignment was valid
   * @throws {Error}         - If typeof val is not type
   */
  _setProperty (prop, val, type) {
    let shouldBeString = type

    if (type && typeof val === type) {
    // if ((params.validator && params.validator(val)) || (params.type && typeof val === params.type)) {
      this[prop] = val
    } else {
      throw new Error(`AutoFittingText prop: ${prop} should be ${shouldBeString}`)
    }

    return true
  }
}

function roundDown (n) {
  return Math.floor(n * 100) / 100
}

export { AutoFittingText }
