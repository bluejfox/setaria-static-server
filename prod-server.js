/* eslint-disable */
require('./check-versions')()

process.env.NODE_ENV = 'production'

var config = require('./config.json')
var path = require('path')
var express = require('express')
var proxyMiddleware = require('http-proxy-middleware')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.proxyTable

var app = express()

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
// app.use(require('connect-history-api-fallback')())

// serve pure static assets
app.use(config.contextPath, express.static('./static'))

console.log('> Starting prod server...')

app.listen(port)
