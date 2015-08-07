//tnr: half finished test. 
var tap = require('tap');
tap.mochaGlobals();
var setCaretPosition = require('../../app/actions/setCaretPosition');
var insertSequenceData = require('../../app/actions/insertSequenceData');
var setSelectionLayer = require('../../app/actions/setSelectionLayer');
var tree = require('../helpers/baobabTestTree.js');
var assert = require('assert');

var sequenceToInsert = {
    sequence: 'atgagagaga',
};
describe('insertSequenceData', function () {
    it ('inserts characters at correct caret position', function () {
        // console.log('tree!: ' +  JSON.stringify(tree.get(), null, 4));
        var sequenceLengthPreInsert = tree.get('$sequenceLength');
        // console.log('sequenceLengthPreInsert: ' + sequenceLengthPreInsert);
        setSelectionLayer(false);//make sure there's no selection layer
        setCaretPosition(0);
        insertSequenceData(sequenceToInsert);
        var sequenceLengthPostInsert = tree.get('$sequenceLength');
        // console.log('sequenceLengthPostInsert: ' + sequenceLengthPostInsert);
        assert.equal(sequenceLengthPostInsert, sequenceLengthPreInsert + sequenceToInsert.sequence.length);
    });
});
