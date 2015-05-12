var baobab = require('baobab');
var sequenceData = require('./sequenceData');
var string = "atgtgtgatg";
var ObjectID = require("bson-objectid");

//tnr: this is used to generate a very large, fake, multi-featured sequence

var reallyLongFakeSequence = "";
for (var i = 0; i < 1000000; i++) {
	reallyLongFakeSequence+=string;
	if (i%100 === 0) {

		sequenceData.features[i] = {
		            id: "12355134",
		            start: i,
		            end: i+100,
		            name: 'cooljim',
		            color: 'green',
		            topStrand: true,
		            annotationType: "feature"
		          }
		}
};
sequenceData.sequence = reallyLongFakeSequence

var fakeSequences = makeFakeSequences(20);
console.log(fakeSequences);

function makeFakeSequences (numberOfFakesSequencesToGenerate) {
	var fakeSequences = {};
	for (var i = 0; i < numberOfFakesSequencesToGenerate; i++) {
		console.log(ObjectID().str);
		fakeSequences[ObjectID().str] = sequenceData;
	}
	return fakeSequences;
	console.log(fakeSequences); 
}


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
		mouse: {
			isDown: false,
			isSelecting: false,
		},
		cursorPosition: 8,
		sequenceData: sequenceData,
	},
	sequencesMegaStore: fakeSequences,
	partsMegaStore: { //
		//tnrtodo: make a fake part generator
	},
	designMegaStore: {
		//tnrtodo: make a fake design generator
	},
	assemblyMakerState: {
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
		mouse: {
			isDown: false,
			isSelecting: false,
		},
		cursorPosition: 8,
		sequenceData: sequenceData,
	},
});

module.exports = tree;