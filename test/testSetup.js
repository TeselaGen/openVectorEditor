//tnr: uncomment following line to allow errors to pass through to the browser! (helpful while debugging!)
mocha.allowUncaught()

var chai = require("chai");
chai.should();
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);
// chai.use(require('chai-things'));


var tidyUpSequenceData = require('ve-sequence-utils/tidyUpSequenceData');

var testSequenceData = tidyUpSequenceData({
    sequence: 'atgc',
    features: [{
        start: 0,
        end: 3
    }, {
        start: 1,
        end: 1
    }],
    parts: [{
        start: 0,
        end: 3
    }, {
        start: 1,
        end: 1
    }],
    translations: [{
        start: 3,
        end: 3
    }, {
        start: 0,
        end: 0
    }]
});

var blankSelectionLayer = {
	selected: false,
	start: -1,
	end: -1,
	cursorAtEnd: false
}

module.exports = {
    testSequenceData: testSequenceData,
    blankSelectionLayer: blankSelectionLayer
}

