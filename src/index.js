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
   * @private
   * @const {external:CanvasRenderingContext2D}
   */
  get context () {
    return ctx
  }

  /**
   * default fontMetricSize
   * @readOnly
   * @private
   * @const {Number}
   * @default 100
   */
  get defaultFontMetricSize () {
    return 100
  }

  /**
   * Regular Expression for splitting string into words
   * @readOnly
   * @private
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

  /**
   * The maximum font size to use when best fitting text as a px value.
   * @type  {Number}
   */
  set maxFontSize (size) {
    this._setProperty('_maxFontSize', size, 'number')
  }

  get maxFontSize () {
    return this._maxFontSize
  }

  /**
   * The minimum font size to use when best fitting text as a px value.
   * @type  {Number}
   */
  set minFontSize (size) {
    this._setProperty('_minFontSize', size, 'number')
  }

  get minFontSize () {
    return this._minFontSize
  }

  /**
   * Token to use when text has to be truncated to fit minimum font size
   * @type {String}
   */
  set truncatedToken (token) {
    this._setProperty('_truncatedToken', token, 'string')
  }

  get truncatedToken () {
    return this._truncatedToken
  }

  // Computed Getters
  // Memoized and Updateable thanks to ReactiveClass

  /**
   * The string to use when setting context font weight
   * @type {String} - A string that describes the CanvasRenderingContext2D font style
   */
  get contextFontString () {
    return `${this.weight} ${this.fontMetricsSize}px ${this.family}`
  }

  /**
   * The target string broken into an array of words split
   * by wordDeleminatorRegex
   * @readOnly
   * @type {String[]}
   */
  get tokens () {
    return this.targetString.split(this.wordDeleminatorRegex)
  }

  /**
   * The size of a rendered space with current
   * fontMetricSize and family
   * @readOnly
   * @private
   * @type {Number}
   */
  get spaceSize () {
    this.context.font = this.contextFontString
    return this.context.measureText(' ').width
  }

  /**
   * The size of a rendered space with current
   * fontMetricSize and family
   * @readOnly
   * @private
   * @type {Number}
   */
  get truncatedTokenSize () {
    this.context.font = this.contextFontString
    return this.context.measureText(this.truncatedToken).width
  }

  /**
   * A cumulative list of target string length, by word
   * when rendered with current fontMetricSize and family
   * @readOnly
   * @private
   * @type {Number[]}
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
   * @readOnly
   * @private
   * @type {Number}
   */
  get maxTokenSize () {
    if (this.offsets) {
      return this._maxTokenSize
    }
    return 0
  }

  /**
   * The maximum line height is calculatied using line height ratio and maxFontSize
   * @readOnly
   * @private
   * @type {Number}
   */
  get maxLineHeight () {
    return this.maxFontSize * this.lineHeight
  }

  /**
   * The minimum line height is calculatied using line height ratio and minFontSize
   * @readOnly
   * @private
   * @type {Number}
   */
  get minLineHeight () {
    return this.minFontSize * this.lineHeight
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
      this.maxTokenSize,
      this.maxLineHeight,
      this.minLineHeight,
      this.truncatedToken,
      this.truncatedTokenSize,
      this.context
    )

    const lines = bestFit.results.map(({line}) => line)
    const targetLines = bestFit.targetLines
    let fillRatio = 1
    if (targetLines > lines.length) {
      let widthRatio = bestFit.maxLineWidth / bestFit.largestLineSize
      let heightRatio = targetLines / lines.length
      fillRatio = roundDown(Math.min(widthRatio, heightRatio))
    }

    let fontSize
    fontSize = roundDown(fillRatio * this.height / (targetLines * this.lineHeight))

    if (this.maxLineHeight > 0) {
      fontSize = Math.min(fontSize, this.maxFontSize)
    }

    return {
      lines,
      fillRatio,
      maxLineWidth: bestFit.maxLineWidth,
      largestLineSize: bestFit.largestLineSize,
      targetLines: targetLines,
      fontSize: fontSize
    }
  }

  /**
   * AutoFittingText Constructor
   * @param  {Number} width                        - Width to fit in px
   * @param  {Number} height                       - Height to fit in px
   * @param  {Object} options                      - Options:
   * @param  {Number} options.lineHeight=1.2       - Scalar value for text line height
   * @param  {String} options.family='Arial'       - Name of the font family to use
   * @param  {String} options.targetString=''      - String to fit
   * @param  {String} options.weight='normal'      - Weight of string
   * @param  {Number} options.maxFontSize=0        - Maximum font size to use when fitting text in px, (use 0 to disable).
   * @param  {Number} options.minFontSize=0        - Minimum font size to use when fitting text in px, (use 0 to disable).
   * @param  {String} options.truncatedToken='...' - String inserted to end of visible text to indicate truncation.
   * @return {AutoFittingText}                     - Instance of AutoFittingText
   */
  constructor (width, height, {lineHeight, family, targetString, weight, maxFontSize, minFontSize, truncatedToken}) {
    super()
    this.fontMetricsSize = this.defaultFontMetricSize
    this.width = width
    this.height = height

    this.lineHeight = lineHeight || 1.2
    this.family = family || 'Arial'
    this.targetString = targetString || ''
    this.weight = weight || 'normal'
    this.maxFontSize = maxFontSize || 0
    this.minFontSize = minFontSize || 0
    this.truncatedToken = truncatedToken || '...'
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
