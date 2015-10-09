//tnr: half finished test. 
// var tap = require('tap');
// tap.mochaGlobals();
var setCaretPosition = require('../../app/actions/setCaretPosition');
var deleteSequence = require('../../app/actions/deleteSequence');
var addAnnotations = require('../../app/actions/addAnnotations');
var setSelectionLayer = require('../../app/actions/setSelectionLayer');
var tree = require('../testHelpers/baobabTestTree.js');
var chai = require("chai");
chai.should();
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);

chai.use(require('chai-things'));
var seedTreeWithSimpleSequenceData = require('../testHelpers/seedTreeWithSimpleSequenceData.js');
describe('deleteSequence', function() {
    it('deletes entire sequence and annotations correctly', function() {
        seedTreeWithSimpleSequenceData({
            sequence: 'atgc'
        });
        addAnnotations('features', [{
            start: 0,
            end: 3
        }]);
        addAnnotations('features', [{
            start: 3,
            end: 1
        }]);
        addAnnotations('parts', [{
            start: 0,
            end: 3
        }]);
        addAnnotations('translations', [{
            start: 0,
            end: 3
        }]);
        var sequenceLengthPreInsert = tree.get('sequenceLength');
        setSelectionLayer(false); //make sure there's no selection layer
        setCaretPosition(0);
        deleteSequence({
            start: 0,
            end: 3
        });
        var sequenceLengthPostInsert = tree.get('sequenceLength');
        sequenceLengthPostInsert.should.equal(0);
        tree.get('sequenceData', 'features').should.deep.equal([])
        tree.get('sequenceData', 'parts').should.deep.equal([])
    });
    it('adjusts entire sequence and annotations correctly', function() {
        seedTreeWithSimpleSequenceData({
            sequence: 'atgc'
        });
        addAnnotations('features', [{
            start: 0,
            end: 3
        }]);
        addAnnotations('features', [{
            start: 3,
            end: 1
        }]);
        addAnnotations('parts', [{
            start: 0,
            end: 3
        }]);
        addAnnotations('translations', [{
            start: 0,
            end: 3
        }]);
        var sequenceLengthPreInsert = tree.get('sequenceLength');
        setSelectionLayer(false); //make sure there's no selection layer
        setCaretPosition(0);
        deleteSequence({
            start: 3,
            end: 3
        });
        var sequenceLengthPostInsert = tree.get('sequenceLength');
        sequenceLengthPostInsert.should.equal(3);
        tree.get('sequenceData', 'parts').should.containSubset([{
            start: 0,
            end: 2
        }])
        tree.get('sequenceData', 'features').should.containSubset([{
            start: 0,
            end: 2
        }, {
            start: 0,
            end: 1
        }])
    });
});