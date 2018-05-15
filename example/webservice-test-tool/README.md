# webservice-test-tool

> A tool for WebService test

## Install
``` bash
# install dependencies
npm install
```

## Quick Start
``` bash
# modify TARGET_WEBSERVICE_SERVER's value which in ./config/dev.env.js file
e.g:
# TARGET_WEBSERVICE_SERVER: '"http://example.com/"'
TARGET_WEBSERVICE_SERVER: '"http://www.myservice.com/api"'

# serve with hot reload at localhost:5555
npm run dev
```

## Browser Support
Modern browsers and Internet Explorer 9+.

## Internal Dependencies
* [vue](https://github.com/vuejs/vue)
* [setaria-ui](https://github.com/bluejfox/setaria-ui) - A Vue.js 2.0 UI Toolkit for Web.
* [jsoneditor](https://github.com/josdejong/jsoneditor) - A web-based tool to view, edit, format, and validate JSON.
* [lodash](https://github.com/lodash/lodash/) - A modern JavaScript utility library delivering modularity, performance, & extras.
* [moment](https://github.com/moment/moment/) - Parse, validate, manipulate, and display dates in javascript.

## ToDo
- [X] Store Service History in local/server by user
- [ ] Display Service History Item detail information on the left pane

## License
MIT
