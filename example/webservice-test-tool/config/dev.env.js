var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PROXY_KEY: '"/api"',
  TARGET_WEBSERVICE_SERVER: '"http://localhost:7000/todo-manager/capi/sys/"'
})
