'use strict';

exports.__esModule = true;
exports.AutoFittingText = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ShortestPath = require('./ShortestPath');

var _ReactiveClass2 = require('./ReactiveClass');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * A canvas 2D Rendering Context element.
                                                                                                                                                           * @external CanvasRenderingContext2D
                                                                                                                                                           * @see {@link http://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D}
                                                                                                                                                           */

/**
 * @module fontfill
 */

var ctx = document.createElement('canvas').getContext('2d');
var wordDeleminatorRegex = /[ ]/;

/**
 * A Class that represents the FittedText
 * Metrics
 */

var TextMetric =
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
function TextMetric(_ref) {
  var lines = _ref.lines,
      fillRatio = _ref.fillRatio,
      maxLineWidth = _ref.maxLineWidth,
      largestLineSize = _ref.largestLineSize,
      targetLines = _ref.targetLines,
      fontSize = _ref.fontSize;

  _classCallCheck(this, TextMetric);

  Object.assign(this, arguments[0]);
};

/**
 * AutoFittingText is a ReactiveClass, all of its computed
 * getters are memoized, but also correctly invalidated and
 * recalculated when a dependency is changed.
 * @extends module:ReactiveClass~ReactiveClass
 * @link ReactiveClass~ReactiveClass
 */


var AutoFittingText = function (_ReactiveClass) {
  _inherits(AutoFittingText, _ReactiveClass);

  _createClass(AutoFittingText, [{
    key: 'context',

    /**
     * Static property that stores a shared shadow Canvas 2D Rendering Context element.
     * @readOnly
     * @const {external:CanvasRenderingContext2D}
     */
    get: function get() {
      return ctx;
    }

    /**
     * default fontMetricSize
     * @readOnly
     * @const {Number}
     * @default 100
     */

  }, {
    key: 'defaultFontMetricSize',
    get: function get() {
      return 100;
    }

    /**
     * Regular Expression for splitting string into words
     * @readOnly
     * @const {RegExp}
     */

  }, {
    key: 'wordDeleminatorRegex',
    get: function get() {
      return wordDeleminatorRegex;
    }

    /**
     * String to fit
     * @type {String}
     */

  }, {
    key: 'targetString',
    set: function set(txt) {
      if (this._setProperty('_targetString', txt, 'string')) {
        this._invalidTokens = true;
      }
    },
    get: function get() {
      return this._targetString;
    }

    /**
     * FontFamiy to fit text with
     * @type {String}
     */

  }, {
    key: 'family',
    set: function set(family) {
      if (this._setProperty('_family', family, 'string')) {
        this._invalidOffsets = true;
        this.context.font = this.fontMetricsSize + 'px ' + this.family;
      }
    },
    get: function get() {
      return this._family;
    }

    /**
     * The fontSize to use for calculating fontMetrics (small is
     * faster, bigger is more precise)
     * @type {Number}
     */

  }, {
    key: 'fontMetricsSize',
    set: function set(size) {
      if (this._setProperty('_fontMetricsSize', size, 'number')) {
        this._invalidSolution = true;
        this.context.font = this.fontMetricsSize + 'px ' + this.family;
      }
    },
    get: function get() {
      return this._fontMetricsSize;
    }

    /**
     * The line height to use when fitting text, as a scalar
     * @type {Number}
     */

  }, {
    key: 'lineHeight',
    set: function set(lineHeight) {
      if (this._setProperty('_lineHeight', lineHeight, 'number')) {
        this._invalidSolution = true;
      }
    },
    get: function get() {
      return this._lineHeight;
    }

    /**
     * Height to constrain text fit to, as a `px` value.
     * @type {Number}
     */

  }, {
    key: 'height',
    set: function set(height) {
      if (this._setProperty('_height', height, 'number')) {
        this._invalidSolution = true;
      }
    },
    get: function get() {
      return this._height;
    }

    /**
     * Width to constrain text fit to, as a `px` value.
     * @type {Number}
     */

  }, {
    key: 'width',
    set: function set(width) {
      if (this._setProperty('_width', width, 'number')) {
        this._invalidSolution = true;
      }
    },
    get: function get() {
      return this._width;
    }

    // Computed Getters
    // Memoized and Updateable thanks to ReactiveClass

    /**
     * The target string broken into an array of words split
     * by wordDeleminatorRegex
     * @readOnly
     * @return {String[]}
     */

  }, {
    key: 'tokens',
    get: function get() {
      return this.targetString.split(this.wordDeleminatorRegex);
    }

    /**
     * The size of a rendered space with current
     * fontMetricSize and family
     * @readOnly
     * @return {Number}
     */

  }, {
    key: 'spaceSize',
    get: function get() {
      return this.context.measureText(' ').width;
    }

    /**
     * A cumulative list of target string length, by word
     * when rendered with current fontMetricSize and family
     * @readOnly
     * @return {Number[]}
     */

  }, {
    key: 'offsets',
    get: function get() {
      var offsets = new Array(this.tokens.length + 1);
      offsets[0] = 0;
      for (var i = 0; i < this.tokens.length; i++) {
        var token = this.tokens[i];
        offsets[i + 1] = offsets[i] + this.context.measureText(token).width;
      }
      return offsets;
    }

    /**
     * Metrics
     * @readOnly
     * @type {module:fontfill~TextMetric}
     */

  }, {
    key: 'metrics',
    get: function get() {
      var bestFit = (0, _ShortestPath.getBestFit)(this.tokens, this.spaceSize, this.offsets, this.width, this.height, this.fontMetricsSize, this.lineHeight);

      var lines = bestFit.results.map(function (_ref2) {
        var line = _ref2.line;
        return line;
      });
      var targetLines = bestFit.targetLines;
      var fillRatio = 1;
      if (targetLines > lines.length) {
        var widthRatio = bestFit.maxLineWidth / bestFit.largestLineSize;
        var heightRatio = targetLines / lines.length;
        fillRatio = Math.min(widthRatio, heightRatio);
      }

      return new TextMetric({
        lines: lines,
        fillRatio: fillRatio,
        maxLineWidth: bestFit.maxLineWidth,
        largestLineSize: bestFit.largestLineSize,
        targetLines: targetLines,
        fontSize: roundDown(fillRatio * this.height / (targetLines * this.lineHeight))
      });
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

  }]);

  function AutoFittingText(width, height, _ref3) {
    var lineHeight = _ref3.lineHeight,
        family = _ref3.family,
        targetString = _ref3.targetString;

    _classCallCheck(this, AutoFittingText);

    var _this = _possibleConstructorReturn(this, _ReactiveClass.call(this));

    _this.fontMetricsSize = _this.defaultFontMetricSize;
    _this.width = width;
    _this.height = height;

    _this.lineHeight = lineHeight || 1.2;
    _this.family = family || 'Arial';
    _this.targetString = targetString || '';
    _this.reactive();
    return _this;
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


  AutoFittingText.prototype._setProperty = function _setProperty(prop, val, type) {
    var shouldBeString = type;

    if (type && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === type) {
      // if ((params.validator && params.validator(val)) || (params.type && typeof val === params.type)) {
      this[prop] = val;
    } else {
      throw new Error('AutoFittingText prop: ' + prop + ' should be ' + shouldBeString);
    }

    return true;
  };

  return AutoFittingText;
}(_ReactiveClass2.ReactiveClass);

function roundDown(n) {
  return Math.floor(n * 100) / 100;
}

exports.AutoFittingText = AutoFittingText;