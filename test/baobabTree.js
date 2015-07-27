var tree = require('../app/baobabTree.js');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');

var assert = require('assert');
describe('baobabTree visible rows', function() {
	it('holds sequence data', function() {
		assert(tree.get('vectorEditorState', 'sequenceData'));
    });
    it('that sequence data gets converted into rows', function() {
		assert(tree.get('$rowData'));
    });
    it('has visible rows defined', function() {
		var visibleRows = tree.get('vectorEditorState','visibleRows');
        assert(areNonNegativeIntegers([visibleRows.start, visibleRows.end]));
    });
    it('only the subset of visible rows make it into visibleRowsData', function() {
		var visibleRows = tree.get('vectorEditorState','visibleRows');
        var visibleRowsData = tree.get('$visibleRowsData');
        var computedVisibleRows = tree.get('$rowData').slice(visibleRows.start, visibleRows.end + 1);
        console.log('visibleRows', visibleRows);
        console.log('visibleRowsData', visibleRowsData);
        console.log('computedVisibleRows', computedVisibleRows);
        assert.deepEqual(computedVisibleRows, visibleRowsData);
    });
});

tree.set(['vectorEditorState','visibleRows'],{start: 0, end: 5});
describe('baobabTree with shifted visible rows! should still pass all tests!', function() {
	it('holds sequence data', function() {
		assert(tree.get('vectorEditorState', 'sequenceData'));
    });
    it('that sequence data gets converted into rows', function() {
		assert(tree.get('$rowData'));
    });
    it('has visible rows defined', function() {
		var visibleRows = tree.get('vectorEditorState','visibleRows');
        assert(areNonNegativeIntegers([visibleRows.start, visibleRows.end]));
    });
    it('only the subset of visible rows make it into visibleRowsData', function() {
		var visibleRows = tree.get('vectorEditorState','visibleRows');
        var visibleRowsData = tree.get('$visibleRowsData');
        var computedVisibleRows = tree.get('$rowData').slice(visibleRows.start, visibleRows.end + 1);
        console.log('visibleRows', visibleRows);
        console.log('visibleRowsData', visibleRowsData);
        console.log('computedVisibleRows', computedVisibleRows);
        assert.deepEqual(computedVisibleRows, visibleRowsData);
    });
});

tree.set(['vectorEditorState','visibleRows'],{start: 5, end: 10});
describe('baobabTree with shifted visible rows! should still pass all tests!', function() {
	it('holds sequence data', function() {
		assert(tree.get('vectorEditorState', 'sequenceData'));
    });
    it('that sequence data gets converted into rows', function() {
		assert(tree.get('$rowData'));
    });
    it('has visible rows defined', function() {
		var visibleRows = tree.get('vectorEditorState','visibleRows');
        assert(areNonNegativeIntegers([visibleRows.start, visibleRows.end]));
    });
    it('only the subset of visible rows make it into visibleRowsData', function() {
		var visibleRows = tree.get('vectorEditorState','visibleRows');
        var visibleRowsData = tree.get('$visibleRowsData');
        var computedVisibleRows = tree.get('$rowData').slice(visibleRows.start, visibleRows.end + 1);
        console.log('visibleRows', visibleRows);
        console.log('visibleRowsData', visibleRowsData);
        console.log('computedVisibleRows', computedVisibleRows);
        assert.deepEqual(computedVisibleRows, visibleRowsData);
    });
});

describe('baobabTree cursor and selection layer', function() {
	it('holds sequence data', function() {
		assert(tree.get('vectorEditorState', 'sequenceData'));
    });
    it('that sequence data gets converted into rows', function() {
		assert(tree.get('$rowData'));
    });
    it('has visible rows defined', function() {
		var visibleRows = tree.get('vectorEditorState','visibleRows');
        assert(areNonNegativeIntegers([visibleRows.start, visibleRows.end]));
    });
    it('only the subset of visible rows make it into visibleRowsData', function() {
		var visibleRows = tree.get('vectorEditorState','visibleRows');
        var visibleRowsData = tree.get('$visibleRowsData');
        var computedVisibleRows = tree.get('$rowData').slice(visibleRows.start, visibleRows.end + 1);
        console.log('visibleRows', visibleRows);
        console.log('visibleRowsData', visibleRowsData);
        console.log('computedVisibleRows', computedVisibleRows);
        assert.deepEqual(computedVisibleRows, visibleRowsData);
    });
});