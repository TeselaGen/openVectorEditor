var reqContext = require.context('../app/', true, /.*\.test\.js/);
var a = {};
reqContext.keys().forEach(reqContext);
