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
 * A type that stores the data of the calculated best fit text.
 * @typedef    {Object} TextMetric
 * @property   {String[]}   lines           - An array of strings, that represent the fitted text line breaks.
 * @property   {Number}     fillRatio       - a ratio that can be used to fill as much space as possible (by scaling the font)
 * @property   {Number}     maxLineWidth    - The maximum (scaled) line width allowed
 * @property   {Number}     largestLineSize - The larget line width used
 * @property   {Number}     targetLines     - The number of lines of the fitted text
 * @property   {Number}     fontSize        - The fontSize to use for the fitted text, this has been scaled by the fillratio.
 * @return     {TextMetric}                 - New instance of TextMetric
 */

/**
 * AutoFittingText is a ReactiveClass, all of its computed getters are memoized, but also correctly invalidated and recalculated when a dependency is changed.
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
    this._setProperty('_targetString', txt, 'string')
  }

  get targetString () {
    return this._targetString
  }

  /**
   * FontFamiy to fit text with
   * @type {String}
   */
  set family (family) {
    this._setProperty('_family', family, 'string')
  }

  get family () {
    return this._family
  }

  /**
   * Font Weight to use when calculating token size.
   * @type {Number}
   */
  set weight (weight) {
    this._setProperty('_weight', weight, 'string')
  }

  get weight () {
    return this._weight
  }

  /**
   * The fontSize to use for calculating fontMetrics (small is
   * faster, bigger is more precise)
   * @type {Number}
   */
  set fontMetricsSize (size) {
    this._setProperty('_fontMetricsSize', size, 'number')
  }

  get fontMetricsSize () {
    return this._fontMetricsSize
  }

  /**
   * The line height to use when fitting text, as a scalar
   * @type {Number}
   */
  set lineHeight (lineHeight) {
    this._setProperty('_lineHeight', lineHeight, 'number')
  }

  get lineHeight () {
    return this._lineHeight
  }

  /**
   * Height to constrain text fit to, as a `px` value.
   * @type {Number}
   */
  set height (height) {
    this._setProperty('_height', height, 'number')
  }

  get height () {
    return this._height
  }

  /**
   * Width to constrain text fit to, as a `px` value.
   * @type {Number}
   */
  set width (width) {
    this._setProperty('_width', width, 'number')
  }

  get width () {
    return this._width
  }

  // Computed Getters
  // Memoized and Updateable thanks to ReactiveClass

  /**
   * The string to use when setting context font weight
   * @return {String} - A string that describes the CanvasRenderingContext2D font style
   */
  get contextFontString () {
    return `${this.weight} ${this.fontMetricsSize}px ${this.family}`
  }

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
    this.context.font = this.contextFontString
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
    this.context.font = this.contextFontString
    offsets[0] = 0
    this._maxTokenSize = 0
    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i]
      const tokenWidth = this.context.measureText(token).width
      offsets[i + 1] = offsets[i] + tokenWidth
      this._maxTokenSize = Math.max(this._maxTokenSize, tokenWidth)
    }
    return offsets
  }

  /**
   * The biggest token size of current targetString
   * @return {Number} - the largest token size using current fontFamily
   */
  get maxTokenSize () {
    if (this.offsets) {
      return this._maxTokenSize
    }
    return 0
  }

  /**
   * The fitted text TextMetric. This is where the calculated best-fit information is stored.
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
      this.lineHeight,
      this.maxTokenSize
    )

    const lines = bestFit.results.map(({line}) => line)
    const targetLines = bestFit.targetLines
    let fillRatio = 1
    if (targetLines > lines.length) {
      let widthRatio = bestFit.maxLineWidth / bestFit.largestLineSize
      let heightRatio = targetLines / lines.length
      fillRatio = Math.min(widthRatio, heightRatio)
    }

    return {
      lines,
      fillRatio,
      maxLineWidth: bestFit.maxLineWidth,
      largestLineSize: bestFit.largestLineSize,
      targetLines: targetLines,
      fontSize: roundDown(fillRatio * this.height / (targetLines * this.lineHeight))
    }
  }

  /**
   * AutoFittingText Constructor
   * @param  {Number} width                   - Width to fit in px
   * @param  {Number} height                  - Height to fit in px
   * @param  {Object} options                 - Options:
   * @param  {Number} options.lineHeight=1.2  - Scalar value for text line height
   * @param  {String} options.family='Arial'  - Name of the font family to use
   * @param  {String} options.targetString='' - String to fit
   * @param  {String} options.weight='normal' - weight of string
   * @return {AutoFittingText}                - Instance of AutoFittingText
   */
  constructor (width, height, {lineHeight, family, targetString, weight}) {
    super()
    this.fontMetricsSize = this.defaultFontMetricSize
    this.width = width
    this.height = height

    this.lineHeight = lineHeight || 1.2
    this.family = family || 'Arial'
    this.targetString = targetString || ''
    this.weight = weight || 'normal'
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
