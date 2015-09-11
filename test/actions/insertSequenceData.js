//tnr: half finished test. 
// var tap = require('tap');
// tap.mochaGlobals();
var setCaretPosition = require('../../app/actions/setCaretPosition');
var insertSequenceData = require('../../app/actions/insertSequenceData');
var setSelectionLayer = require('../../app/actions/setSelectionLayer');
var setCaretPosition = require('../../app/actions/setCaretPosition');
var addAnnotations = require('../../app/actions/addAnnotations');
var setSelectionLayer = require('../../app/actions/setSelectionLayer');
var tree = require('../helpers/baobabTestTree.js');
var seedTreeWithSimpleSequenceData = require('../helpers/seedTreeWithSimpleSequenceData.js');
var chai = require("chai");
chai.should();
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);


describe('insertSequenceData', function () {
    it ('inserts characters at correct caret position', function () {
        var sequenceToInsert = {
            sequence: 'atgagagaga',
        };
        // console.log('tree!: ' +  JSON.stringify(tree.get(), null, 4));
        var sequenceLengthPreInsert = tree.get('$sequenceLength');
        // console.log('sequenceLengthPreInsert: ' + sequenceLengthPreInsert);
        setSelectionLayer(false);//make sure there's no selection layer
        setCaretPosition(0);
        insertSequenceData(sequenceToInsert);
        var sequenceLengthPostInsert = tree.get('$sequenceLength');
        // console.log('sequenceLengthPostInsert: ' + sequenceLengthPostInsert);
        sequenceLengthPostInsert.should.equal(sequenceLengthPreInsert + sequenceToInsert.sequence.length);
    });
});

describe('insertSequenceData', function () {
    it ('moves existing annotations correctly', function () {
        var sequenceToInsert = {
            sequence: 'atgagagaga',
        };
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
        var sequenceLengthPreInsert = tree.get('$sequenceLength');
        setSelectionLayer(false);//make sure there's no selection layer
        setCaretPosition(0);
        debugger;
        insertSequenceData(sequenceToInsert);
        var sequenceLengthPostInsert = tree.get('$sequenceLength');
        sequenceLengthPostInsert.should.equal(sequenceLengthPreInsert + sequenceToInsert.sequence.length);
        tree.get('sequenceData', 'features').should.containSubset([{
            start: 10,
            end: 13
        }, {
            start: 13,
            end: 11
        }])
        tree.get('sequenceData', 'parts').should.containSubset([{
            start: 10,
            end: 13
        }])
        tree.get('sequenceData', 'translations').should.containSubset([{
            start: 10,
            end: 13
        }])
    });
});
