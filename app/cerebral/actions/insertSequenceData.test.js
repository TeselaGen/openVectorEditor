var insertSequenceData = require('./insertSequenceData.js');
var tidyUpSequenceData = require('ve-sequence-utils/tidyUpSequenceData');
var testSequence = tidyUpSequenceData({
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
        start: 0,
        end: 3
    }, {
        start: 1,
        end: 1
    }]
});

var newSequenceData = tidyUpSequenceData({
    sequence: 'atgagagaga',
    features: [{
        start: 0,
        end: 5
    }]
});
var controller = require('../controller')({
    //instantiate some default val's here:
    state: {
        sequenceData: testSequence,
        caretPosition: 0
    }
});


describe('insertSequenceData', function() {
    it('inserts data at start of sequence and adjusts annotations correctly', function() {
        insertSequenceData({input: {newSequenceData}, state: controller.state, output: function({ caretPosition, sequenceData }) {
            sequenceData.sequence.length.should.equal(14);
            sequenceData.features.should.containSubset([{
                start: 10,
                end: 13
            }, {
                start: 11,
                end: 11
            }])
            sequenceData.parts.should.containSubset([{
                start: 10,
                end: 13
            }, {
                start: 11,
                end: 11
            }])
            sequenceData.translations.should.containSubset([{
                start: 10,
                end: 10
            }, {
                start: 13,
                end: 13
            }])
            caretPosition.should.equal(10);
        }});
    });

    it('inserts mid-sequence and adjusts entire sequence and annotations correctly', function() {
        controller.reset();
        controller.state.set(['sequenceData'], testSequence); 
        controller.state.set('caretPosition', 1);
        insertSequenceData({input: {newSequenceData}, state: controller.state, output: function({ caretPosition, sequenceData }) {
            sequenceData.sequence.length.should.equal(14);
            sequenceData.features.should.containSubset([{
                start: 0,
                end: 13
            }, {
                start: 11,
                end: 11
            }, {
                start: 1,
                end: 6
            }])
            sequenceData.parts.should.containSubset([{
                start: 0,
                end: 13
            }, {
                start: 11,
                end: 11
            }])
            sequenceData.translations.should.containSubset([{
                start: 0,
                end: 0
            }, {
                start: 13,
                end: 13
            }])
            caretPosition.should.equal(11);
        }});
    });
});