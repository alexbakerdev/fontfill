var path = require('path')
var webpack = require('webpack')

process.env.BUILD_ENV = process.env.BUILD_ENV || 'prod'

const projectRoot = path.resolve(__dirname, 'src')
const outputPath = path.resolve(__dirname, 'dist')

function minifyConfig (config) {
  config.output.filename = config.output.filename.replace(/\.js$/, '.min.js')
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }))
  return config
}

function devServerConfig (config) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  config.devServer = {
    inline: true,
    host: '0.0.0.0',
    port: 8080,
  }
  return config
}

function commonJs2Target (config) {
  config.output.filename = "./fontfill.commonjs.js"
  config.output.libraryTarget = 'commonjs2'
  return config
}

function globalTarget (config) {
  config.output.filename = "./fontfill.global.js"
  config.output.libraryTarget = 'var'
  return config
}

function productionConfig (config) {
  config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin())
  return config
}

function configurator (config, fArr) {
  for (f of fArr) {
    config = f(config)
  }
  return config
}


function baseConfig () {
  return {
    entry: ["./src/index.js"],
    output: {
      publicPath: "",
      path: outputPath,
      library: "fontfill",
    },
    devtool: process.env.BUILD_ENV.toLowerCase() === 'dev' ? 'eval' : 'source-map',
    plugins: [ ],
    module: {
      preLoaders: [ { test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/ } ],
      loaders: [
        { test: /\.css$/, loader: "style!css" },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            presets: ['es2015'],
            plugins: ['transform-runtime'],
          }
        },
      ]
    }
  }
}

function prodConfigs () {
  return [
    configurator(baseConfig(), [productionConfig, commonJs2Target]),
    configurator(baseConfig(), [productionConfig, commonJs2Target, minifyConfig]),
    configurator(baseConfig(), [productionConfig, globalTarget]),
    configurator(baseConfig(), [productionConfig, globalTarget, minifyConfig]),
  ]
}

function devConfig () {
  return prodConfigs().map((config) => {
    return configurator(config, [devServerConfig])
  })
}

let moduleExports
if (process.env.BUILD_ENV === 'prod') {
  moduleExports = prodConfigs()
} else if (process.env.BUILD_ENV === 'dev') {
  moduleExports = devConfig()
} else if (process.env.BUILD_ENV === 'test') {
  moduleExports = baseConfig()
} else {
  moduleExports = []
}

module.exports = moduleExports
