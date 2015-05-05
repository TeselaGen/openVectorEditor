var baobab = require('baobab');
var sequenceData = require('./sequenceData');
var string = "atgtgtgatg";
// var reallyLongFakeSequence = "";
// for (var i = 0; i < 1000000; i++) {
// 	reallyLongFakeSequence+=string;
// };
// sequenceData.sequence = reallyLongFakeSequence

var tree = new baobab({
	vectorEditorState: {
		visibilityParameters: {
			averageRowHeight: 100,
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
		selectionLayer: {
			start: 46,
			end: 8900,
		},
		cursorPosition: 8,
		sequenceData: sequenceData,
	},
});

module.exports = tree;