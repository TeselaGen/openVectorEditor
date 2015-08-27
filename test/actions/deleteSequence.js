//tnr: half finished test. 
//var tap = require('tap');
//tap.mochaGlobals();
var setCaretPosition = require('../../app/actions/setCaretPosition');
var deleteSequence = require('../../app/actions/deleteSequence');
var setSelectionLayer = require('../../app/actions/setSelectionLayer');
var tree = require('../helpers/baobabTestTree.js');
var assert = require('assert');

var sequenceToInsert = {
    sequence: 'atgagagaga',
};
describe('deleteSequence', function () {
    it ('deletes characters correctly', function () {
        // console.log('tree!: ' +  JSON.stringify(tree.get(), null, 4));
        var sequenceLengthPreInsert = tree.get('$sequenceLength');
        // console.log('sequenceLengthPreInsert: ' + sequenceLengthPreInsert);
        setSelectionLayer(false);//make sure there's no selection layer
        setCaretPosition(0);
        deleteSequence({start: 0, end: 10});
        var sequenceLengthPostInsert = tree.get('$sequenceLength');
        // console.log('sequenceLengthPostInsert: ' + sequenceLengthPostInsert);
        assert.equal(sequenceLengthPostInsert, sequenceLengthPreInsert + sequenceToInsert.sequence.length);
    });
});
