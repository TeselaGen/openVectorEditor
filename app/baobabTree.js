var baobab = require('baobab');
var sequenceData = require('./sequenceData');

var tree = new baobab({
	vectorEditorState: {
		visibilityParameters: {
			preloadBasepairStart: 300,
			rowLength: 30,
			preloadRowStart: 9,
			// preloadRowEnd: 9,
			showOrfs: true,
			showCutsites: true,
			showParts: true,
			showFeatures: true,
			showReverseSequence: true,
			viewportDimensions: {
				height: 700, //come back and make these dynamic
				width: 400
			}
		},
		sequenceData: sequenceData,
	},
	surname: 'Talbot'
});

module.exports = tree;