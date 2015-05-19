var baobab = require('baobab');
var sequenceData = require('./sequenceData');
var ObjectID = require("bson-objectid");
var prepareRowData = require('./prepareRowData');
var computeRowRepresentationOfSequence = require('./computeRowRepresentationOfSequence');

//tnr: this is used to generate a very large, fake, multi-featured sequence

// sequenceData.features = {};
// sequenceData.parts = {};

var string = "atgtgtgatg";
var reallyLongFakeSequence = "";
for (var i = 0; i < 10000; i++) {
	reallyLongFakeSequence+=string;
	if (i%100 === 0) {

		sequenceData.features[i] = {
		            id: i,
		            start: i,
		            end: i+100,
		            name: 'cooljim',
		            color: 'green',
		            topStrand: true,
		            annotationType: "feature"
		          };
		}
};
sequenceData.sequence = reallyLongFakeSequence;

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
		topSpacerHeight: 0,
		bottomSpacerHeight:0,
		averageRowHeight: 100,
		// preloadBasepairStart: 300,
		CHAR_WIDTH: 15,
		preloadRowStart: 0,
		// preloadRowEnd: 9,
		showOrfs: true,
		showCutsites: true,
		showParts: true,
		showFeatures: true,
		showReverseSequence: true,
		viewportDimensions: {
			height: 500, //come back and make these dynamic
			width: 400
		},
		selectionLayer: {
			start: 0,
			end: 5,
			sequenceSelected: true,
		},
		mouse: {
			isDown: false,
			isSelecting: false,
		},
		cursorPosition: 8,
		sequenceData: sequenceData,
	},
	// sequencesMegaStore: fakeSequences,
	partsMegaStore: { //
		//tnrtodo: make a fake part generator
	},
	designMegaStore: {
		//tnrtodo: make a fake design generator
	},
	assemblyMakerState: {
		
	},
}, {
	facets: {
		bpsPerRow: {
			cursors: {
				viewportDimensionsWidth: ['vectorEditorState', 'viewportDimensions', 'width'],
				CHAR_WIDTH: ['vectorEditorState', 'CHAR_WIDTH'],
			},
			get: function (state) {
				return Math.floor(state.viewportDimensionsWidth/state.CHAR_WIDTH);
			}
		},
		sequenceLength: {
			cursors: {
				sequenceData: ['vectorEditorState','sequenceData'],
			},
			get: function (state) {
				return state.sequenceData.sequence ? state.sequenceData.sequence.length : 0;
			}
		},
		rowData: {
			cursors: {
				sequenceData: ['vectorEditorState','sequenceData'],
				// bpsPerRow: ['vectorEditorState','bpsPerRow'],
			},
			facets: {
				bpsPerRow: 'bpsPerRow',
			},
			get: function (state) {
				return prepareRowData(state.sequenceData, state.bpsPerRow);
			}
		}
	}
});

module.exports = tree;