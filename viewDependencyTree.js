var madge = require('madge');
var dependencyObject = madge('./app');
console.log(dependencyObject.tree);

dependencyObject.image({imageColors: {
	bgcolor: 'white',
	edge: 'green',
	dependencies: 'purple',
	fontColor: 'black'
}}, function (renderedImage) {
	console.log('hey!');
	console.log(renderedImage);
})