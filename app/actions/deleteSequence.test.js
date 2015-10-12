require('../../testSetup.js');
var deleteSequence = require('./deleteSequence.js');
var tidyUpSequenceData = require('ve-sequence-utils/tidyUpSequenceData');

describe('deleteSequence', function() {
    it('deletes entire sequence and annotations correctly', function() {
        deleteSequence({
            sequenceData: tidyUpSequenceData({
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
            }),
            selectionLayer: {
                start: 0,
                end: 3,
            },
        }, {}, function({
            caretPosition, sequenceData
        }) {
            sequenceData.sequence.length.should.equal(0);
            sequenceData.features.should.deep.equal([])
            sequenceData.parts.should.deep.equal([])
            sequenceData.translations.should.deep.equal([])
            caretPosition.should.equal(0);
        });
    });
    it('adjusts entire sequence and annotations correctly', function() {
        deleteSequence({
            sequenceData: tidyUpSequenceData({
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
                }]
            }),
            selectionLayer: {
                start: 3,
                end: 3,
            },
        }, {}, function({
            caretPosition, sequenceData
        }) {
            sequenceData.sequence.length.should.equal(0);
            sequenceData.features.should.should.containSubset([{
                start: 0,
                end: 2
            }, {
                start: 1,
                end: 1
            }])
            sequenceData.parts.should.should.containSubset([{
                start: 0,
                end: 2
            }, {
                start: 1,
                end: 1
            }])
            sequenceData.translations.should.deep.equal([])
            caretPosition.should.equal(0);
        });
    });
});