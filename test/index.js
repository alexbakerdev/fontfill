// Polyfill fn.bind() for PhantomJS
/* eslint-disable no-extend-native */
Function.prototype.bind = require('function-bind')

// require all test files (files that ends with .spec.js)
var testsContext = require.context('./e2e', true, /\.spec\.js$/)
testsContext.keys().forEach(testsContext)
