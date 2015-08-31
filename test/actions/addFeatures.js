var addFeatures = require('../../app/actions/addFeatures');
var expect = require('chai').expect;
var tree = require('../helpers/baobabTestTree.js');

describe('addFeatures', function() {
    it('adds features to sequence object', function() {
        //clear the selectionLayer
        var newFeatures = [{name: 'hey',
        start: 1,end:3}]
        addFeatures(newFeatures);
        expect(tree.get('features')).to.exist;
        expect(tree.get('features')).to.equal(-1);
    });
    //tnrtodo: add more tests to make sure other cases are working
});