var reqContext = require.context('../app/', false, /.*\.test\.js/);
var a = {};
reqContext.keys().forEach(function(key) {
    a[key.substring(2)] = reqContext(key)
});
var reqContext = require.context('../app/actions', false, /.*\.test\.js/);
var a = {};
reqContext.keys().forEach(function(key) {
    a[key.substring(2)] = reqContext(key)
});

console.log('hello moto')
