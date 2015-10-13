import {testSequenceData} from '../../test/testSetup.js';
var insertSequenceData = require('./insertSequenceData.js');
var tidyUpSequenceData = require('ve-sequence-utils/tidyUpSequenceData');

describe('insertSequenceData', function() {
    it('inserts sequence sequence at start of sequence and adjusts annotations correctly', function() {
        insertSequenceData({
            sequenceData: testSequenceData,
            newSequenceData: tidyUpSequenceData({
                sequence: 'atgagagaga'
            }),
            caretPosition: 0,
        }, {}, function({
            caretPosition, sequenceData
        }) {
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
        });
    });

    it('inserts mid-sequence and adjusts entire sequence and annotations correctly', function() {
        insertSequenceData({
            sequenceData: testSequenceData,
            newSequenceData: tidyUpSequenceData({
                sequence: 'atgagagaga',
                features: [{
                    start: 0,
                    end: 5
                }]
            }),
            caretPosition: 1,
        }, {}, function({
            caretPosition, sequenceData
        }) {
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
        });
    });
});