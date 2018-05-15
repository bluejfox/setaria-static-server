# setaria-static-server

> A tool for call CORS web service

## Install

Using npm:

``` bash
# install dependencies
npm i
```

Using yarn:

``` bash
# install dependencies
yarn
```

## Quick Start

``` bash
node prod-server.js
open browser and goto http://localhost:8085
```

## Config

``` javascript
{
  // 'contextPath' is the path for static resource which in public folder
  "contextPath": "/",
  // 'port' is the server port
  "port": 8085,
  // 'proxyTable' is the proxy server setting which is the same as https://github.com/chimurai/http-proxy-middleware
  "proxyTable": {
    "/api": {
      "target": "http://39.107.242.134:8080/ume-quickstart-boot-uac/capi/sys/",
      "pathRewrite": {
        "^/api": ""
      }
    }
  }
}
```

## ToDo

## License
MIT
