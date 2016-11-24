// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack

process.env.BUILD_ENV = 'test'

const path = require('path')
const baseConfig = require('../webpack.config')

const projectRoot = path.resolve(__dirname, '../')

// no need for app entry during tests
delete baseConfig.entry

// no need for app output during tests
delete baseConfig.output

delete baseConfig.module.preLoaders

baseConfig.resolve = {
  alias: {
    dist: path.resolve(projectRoot, 'dist'),
    src: path.resolve(projectRoot, 'src')
  },
}

var reporters = [process.env.KARMA_REPORTER || 'spec']

module.exports = function (config) {
  config.set(
    { browsers: ['PhantomJS']
    , frameworks: ['mocha', 'sinon-chai']
    , reporters: reporters
    , files: ['./index.js']
    , preprocessors: { './index.js': ['webpack', 'sourcemap'] }
    , webpack: baseConfig
    , webpackMiddleware: { noInfo: true }
    , client:
      { 'mocha':
        { timeout: '5000'
        }
      }
    , specReporter: { }
    })
}
