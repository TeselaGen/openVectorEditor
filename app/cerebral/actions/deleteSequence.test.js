require('../../../test/testSetup.js');
var deleteSequence = require('./deleteSequence.js');
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
var controller = require('../controller')({
    //instantiate some default val's here:
    state: {
        sequenceData: testSequence,
        selectionLayer: {
            start: 0,
            end: 3
        }
    }
});

describe('deleteSequence', function() {
    it('deletes entire sequence and annotations correctly', function() {
        deleteSequence({state: controller.state, output: function({
                    caretPosition, sequenceData
                }) {
                    sequenceData.sequence.length.should.equal(0);
                    sequenceData.features.should.deep.equal([])
                    sequenceData.parts.should.deep.equal([])
                    sequenceData.translations.should.deep.equal([])
                    caretPosition.should.equal(0);
                }});
    });
    it('deletes end of sequence and adjusts annotations correctly', function() {
        controller.reset();
        controller.state.set(['selectionLayer', 'start'], 3);     
        deleteSequence({state: controller.state, output: function({
                    caretPosition, sequenceData
                }) {
                    console.log('sequenceData: ' + JSON.stringify(sequenceData.features,null,4));
                    sequenceData.sequence.length.should.equal(3);
                    sequenceData.features.should.containSubset([{
                        start: 0,
                        end: 2
                    }, {
                        start: 1,
                        end: 1
                    }])
                    sequenceData.parts.should.containSubset([{
                        start: 0,
                        end: 2
                    }, {
                        start: 1,
                        end: 1
                    }])
                    caretPosition.should.equal(3);
                }});
    });
});