const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')

const HOST = 'http://localhost:3030'
// const HOST = 'http://swj.io'

var config = {}

config.entry = './entry.js'

config.output = {
  path: path.resolve(__dirname, '../build'),
  filename: 'bundle.js'
}

config.module = {
  preLoaders: [],
  loaders: [
    {
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['es2015']
      }
    },
    { test: /\.tag.html$/, loader: 'tag' },
    { test: /\.scss$/, loader: 'style!css!sass' },
    { test: /\.(ttf|eot|svg|woff)/, loaders: ['url?limit=100000'] }
  ]
}

const jade = require('jade')
const rootTemplate = jade.renderFile('./index.jade', {
  pretty: true,
  host: HOST
})

var templateCfg = {
  templateContent: rootTemplate,
  inject: 'body'
}

config.plugins = [
  new HtmlWebpackPlugin(templateCfg),
  new CleanPlugin(['build']),
  new webpack.DefinePlugin({
    HOST: '"' + (HOST || '') + '"'
  })
]

config.resolve = {
  modulesDirectories: ['bower_components', 'node_modules']
}

module.exports = config
