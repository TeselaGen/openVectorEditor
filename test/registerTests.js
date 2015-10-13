var reqContext = require.context('../app/', true, /.*\.test\.js/);
reqContext.keys().forEach(reqContext);
