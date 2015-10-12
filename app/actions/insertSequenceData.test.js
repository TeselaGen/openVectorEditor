require('../../testSetup.js');
var insertSequenceData = require('./insertSequenceData.js');
var tidyUpSequenceData = require('ve-sequence-utils/tidyUpSequenceData');

describe('insertSequenceData', function() {
    it('inserts sequence sequence at start of sequence and adjusts annotations correctly', function() {
        insertSequenceData({
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
            newSequenceData: {
                start: 0,
                end: 3,
            },
            caretPosition: 0,
        }, {}, function({caretPosition, sequenceData }) {
            sequenceData.sequence.length.should.equal(0);
            sequenceData.features.should.deep.equal([])
            sequenceData.parts.should.deep.equal([])
            sequenceData.translations.should.deep.equal([])
            caretPosition.should.equal(0);
        });
    });
    it('adjusts entire sequence and annotations correctly', function() {
        insertSequenceData({
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

// //tnr: half finished test. 
// // var tap = require('tap');
// // tap.mochaGlobals();
// var setCaretPosition = require('./setCaretPosition');
// var insertSequenceData = require('./insertSequenceData');
// var setSelectionLayer = require('./setSelectionLayer');
// var setCaretPosition = require('./setCaretPosition');
// var addAnnotations = require('./addAnnotations');
// var setSelectionLayer = require('./setSelectionLayer');
// var tree = require('../testHelpers/baobabTestTree');
// var seedTreeWithSimpleSequenceData = require('../testHelpers/seedTreeWithSimpleSequenceData');
// var chai = require("chai");
// chai.should();
// var chaiSubset = require('chai-subset');
// chai.use(chaiSubset);

// describe('insertSequenceData', function () {
//     it ('inserts characters at correct caret position', function () {
//         var sequenceToInsert = {
//             sequence: 'atgagagaga'
//         };
//         var sequenceLengthPreInsert = tree.get('sequenceLength');
//         setSelectionLayer(false);//make sure there's no selection layer
//         setCaretPosition(0);
//         insertSequenceData(sequenceToInsert);
//         var sequenceLengthPostInsert = tree.get('sequenceLength');
//         sequenceLengthPostInsert.should.equal(sequenceLengthPreInsert + sequenceToInsert.sequence.length);
//     });
// });

// describe('insertSequenceData', function () {
//     it ('moves existing annotations correctly', function () {
//         var sequenceToInsert = {
//             sequence: 'atgagagaga',
//         };
//         seedTreeWithSimpleSequenceData({
//             sequence: 'atgc'
//         });
//         addAnnotations('features', [{
//             start: 0,
//             end: 3
//         }]);
//         addAnnotations('features', [{
//             start: 3,
//             end: 1
//         }]);
//         addAnnotations('parts', [{
//             start: 0,
//             end: 3
//         }]);
//         addAnnotations('translations', [{
//             start: 0,
//             end: 3
//         }]);
//         var sequenceLengthPreInsert = tree.get('sequenceLength');
//         setSelectionLayer(false);//make sure there's no selection layer
//         setCaretPosition(0);
//         insertSequenceData(sequenceToInsert);
//         var sequenceLengthPostInsert = tree.get('sequenceLength');
//         sequenceLengthPostInsert.should.equal(sequenceLengthPreInsert + sequenceToInsert.sequence.length);
//         tree.get('sequenceData', 'features').should.containSubset([{
//             start: 10,
//             end: 13
//         }, {
//             start: 13,
//             end: 11
//         }])
//         tree.get('sequenceData', 'parts').should.containSubset([{
//             start: 10,
//             end: 13
//         }])
//         tree.get('sequenceData', 'translations').should.containSubset([{
//             start: 10,
//             end: 13
//         }])
//     });
// });