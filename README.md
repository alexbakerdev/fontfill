# fontfill.js
![fontfill logo](https://cdn.rawgit.com/Xanderite/fontfill/master/images/big-wide-logo.svg "fontfill Logo Title")
[![npm](https://img.shields.io/npm/v/fontfill.svg)]() [![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php) [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Best-fit any string into a box of arbitrary dimensions. Its a great solution for dynamic display text, responsive websites or a combination of both. Its pretty fast too, resizing a box will look smooth. It also implements a reactive state, so its possible to watch for changes to the fit, such as when the box is resized.

## Install

```
npm install --save fontfill
```

## Getting Started

The primary interface for this library is through a class called `AutoFittingText` which is detailed below. This package comes with multiple builds that are suitable for a range of use cases, and build tools.

### ECMAScript2015

This library was written in ECMAScript2015 and the source can be referenced directly like so:

``` es6
import { AutoFittingText } from 'fontfill/src'
```

You will need your own bundler and transpiler for this to work.

### ES5

If you are using your own bundler, but don't want to setup an es6 transpiler
use the transpiled to ES5 version of this library like so:

``` js
var AutoFittingText = require('fontfill').AutoFittingText
```

### commonjs2

If you have some requirement for a standalone commonjs2 module:
``` js
var AutoFittingText = require('fontfill').AutoFittingText
```

### Global

if you want to access this module globally
``` js
var AutoFittingText = window.fontfill.AutoFittingText
```

## Example

Here is a pretty straightforward example for a one-time fit

``` es6
import { AutoFittingText } from 'fontfill/src'

const targetString = `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 11032.`

const targetDiv = document.body.querySelector('.target-div')
const bestFit = new AutoFittingText(targetDiv.width, targetDiv.height, {
  targetString: targetString,
  family: targetDiv.style.fontFamily
  lineHeight: targetDiv.style.lineHeight // this should be a scalar
})

targetDiv.innerHTML = bestFit.metrics.lines.join('<br/>')
targetDiv.style.fontSize = bestFit.metrics.fontSize
```

# API Reference

* [fontfill](#module_fontfill)
    * [~TextMetric](#module_fontfill..TextMetric)
        * [new TextMetric(options)](#new_module_fontfill..TextMetric_new)
    * [~AutoFittingText](#module_fontfill..AutoFittingText) ⇐ <code>[ReactiveClass](#module_ReactiveClass..ReactiveClass)</code>
        * [new AutoFittingText(width, height, options)](#new_module_fontfill..AutoFittingText_new)
        * [.targetString](#module_fontfill..AutoFittingText+targetString) : <code>String</code>
        * [.family](#module_fontfill..AutoFittingText+family) : <code>String</code>
        * [.fontMetricsSize](#module_fontfill..AutoFittingText+fontMetricsSize) : <code>Number</code>
        * [.lineHeight](#module_fontfill..AutoFittingText+lineHeight) : <code>Number</code>
        * [.height](#module_fontfill..AutoFittingText+height) : <code>Number</code>
        * [.width](#module_fontfill..AutoFittingText+width) : <code>Number</code>
        * [.tokens](#module_fontfill..AutoFittingText+tokens) ⇒ <code>Array.&lt;String&gt;</code>
        * [.spaceSize](#module_fontfill..AutoFittingText+spaceSize) ⇒ <code>Number</code>
        * [.offsets](#module_fontfill..AutoFittingText+offsets) ⇒ <code>Array.&lt;Number&gt;</code>
        * [.maxTokenSize](#module_fontfill..AutoFittingText+maxTokenSize) ⇒ <code>Number</code>
        * [.metrics](#module_fontfill..AutoFittingText+metrics) : <code>[TextMetric](#module_fontfill..TextMetric)</code>
        * [.context](#module_fontfill..AutoFittingText+context) : <code>[CanvasRenderingContext2D](#external_CanvasRenderingContext2D)</code>
        * [.defaultFontMetricSize](#module_fontfill..AutoFittingText+defaultFontMetricSize) : <code>Number</code>
        * [.wordDeleminatorRegex](#module_fontfill..AutoFittingText+wordDeleminatorRegex) : <code>RegExp</code>
        * [.$watch(key, callback)](#module_ReactiveClass..ReactiveClass+$watch)
        * [.$set(key, descriptor)](#module_ReactiveClass..ReactiveClass+$set)

<a name="module_fontfill..TextMetric"></a>
## Class: TextMetric
A Class that represents the calculated best fit text.

<a name="new_module_fontfill..TextMetric_new"></a>
#### new TextMetric(options)



TextMetric Constructor


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Constructor Options |
| options.lines | <code>Array.&lt;String&gt;</code> | An array of strings, that represent the fitted text                                              line breaks. |
| options.fillRatio | <code>Number</code> | a ratio that can be used to fill as much space                                              as possible (by scaling the font) |
| options.maxLineWidth | <code>Number</code> | The maximum (scaled) line width allowed |
| options.largestLineSize | <code>Number</code> | The larget line width used |
| options.targetLines | <code>Number</code> | The number of lines of the fitted text |
| options.fontSize | <code>Number</code> | The fontSize to use for the fitted text |

<a name="module_fontfill..AutoFittingText"></a>
## Class: AutoFittingText
AutoFittingText is a ReactiveClass, all of its computed getters are memoized, but also correctly invalidated and recalculated when a dependency is changed.

<a name="new_module_fontfill..AutoFittingText_new"></a>
#### new AutoFittingText(width, height, options)



AutoFittingText Constructor


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| width | <code>Number</code> |  | Width to fit in px |
| height | <code>Number</code> |  | Height to fit in px |
| options | <code>Object</code> |  | Options: |
| options.lineHeight | <code>Number</code> | <code>1.2</code> | Scalar value for text line height |
| options.family | <code>String</code> | <code>&#x27;Arial&#x27;</code> | Name of the font family to use |
| options.targetString | <code>String</code> | <code>&#x27;&#x27;</code> | String to fit |

<a name="module_fontfill..AutoFittingText+targetString"></a>
#### .targetString : <code>String</code>



String to fit

<a name="module_fontfill..AutoFittingText+family"></a>
#### .family : <code>String</code>



FontFamiy to fit text with

<a name="module_fontfill..AutoFittingText+fontMetricsSize"></a>
#### .fontMetricsSize : <code>Number</code>



The fontSize to use for calculating fontMetrics (small is
faster, bigger is more precise)

<a name="module_fontfill..AutoFittingText+lineHeight"></a>
#### .lineHeight : <code>Number</code>



The line height to use when fitting text, as a scalar

<a name="module_fontfill..AutoFittingText+height"></a>
#### .height : <code>Number</code>



Height to constrain text fit to, as a `px` value.

<a name="module_fontfill..AutoFittingText+width"></a>
#### .width : <code>Number</code>



Width to constrain text fit to, as a `px` value.

<a name="module_fontfill..AutoFittingText+tokens"></a>
#### .tokens: `(readonly)` ⇒ <code>Array.&lt;String&gt;</code>



The target string broken into an array of words split
by wordDeleminatorRegex

<a name="module_fontfill..AutoFittingText+spaceSize"></a>
#### .spaceSize: `(readonly)` ⇒ <code>Number</code>



The size of a rendered space with current
fontMetricSize and family

<a name="module_fontfill..AutoFittingText+offsets"></a>
#### .offsets: `(readonly)` ⇒ <code>Array.&lt;Number&gt;</code>



A cumulative list of target string length, by word
when rendered with current fontMetricSize and family

<a name="module_fontfill..AutoFittingText+maxTokenSize"></a>
#### .maxTokenSize ⇒ <code>Number</code>



**Returns**: <code>Number</code> - - the largest token size using current fontFamily  
The biggest token size of current targetString

<a name="module_fontfill..AutoFittingText+metrics"></a>
#### .metrics: `(readonly)` : <code>[TextMetric](#module_fontfill..TextMetric)</code>



The fitted text TextMetric. This is where the calculated best-fit information is stored.

<a name="module_fontfill..AutoFittingText+context"></a>
#### .context: `(constant)` : <code>[CanvasRenderingContext2D](#external_CanvasRenderingContext2D)</code>



Static property that stores a shared shadow Canvas 2D Rendering Context element.

<a name="module_fontfill..AutoFittingText+defaultFontMetricSize"></a>
#### .defaultFontMetricSize: `(constant)` : <code>Number</code> : _(default = _<code>100</code>_)_



default fontMetricSize

<a name="module_fontfill..AutoFittingText+wordDeleminatorRegex"></a>
#### .wordDeleminatorRegex: `(constant)` : <code>RegExp</code>



Regular Expression for splitting string into words

<a name="module_ReactiveClass..ReactiveClass+$watch"></a>
#### .$watch(key, callback)



Watch an instance property


| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Name of reactive property on instance to watch |
| callback | <code>[watchCallback](#ReactiveClass..watchCallback)</code> | Callback to use |

<a name="module_ReactiveClass..ReactiveClass+$set"></a>
#### .$set(key, descriptor)



Set a new, reactive instance property. Should be used instead of
Object.defineProperty()


| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Property key |
| descriptor | <code>Object</code> | Property descriptor |



# Externals


<a name="external_CanvasRenderingContext2D"></a>

## CanvasRenderingContext2D
A canvas 2D Rendering Context element.

**Kind**: global external  
**See**: [http://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D](http://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)  


___

&copy; 2016 Alex Baker. Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown).
