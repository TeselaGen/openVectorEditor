var checkLayerIsSelected = require('./checkLayerIsSelected');
describe('checkLayerIsSelected', function() {
    it('should call success when selectionLayer.selected = true', function(done) {
        var testTree = {
            selectionLayer: {
                selected: true
            }
        };
        checkLayerIsSelected({}, testTree, {
            selected: function() {
                done()
            },
            notSelected: function() {
                throw new Error();
            }
        });
    });
    it('should call error when selectionLayer.selected = false', function(done) {
        var testTree = {
            selectionLayer: {
                selected: false
            }
        };        
        checkLayerIsSelected({}, testTree, {
            selected: function() {
                throw new Error();
            },
            notSelected: function() {
                done()
            }
        });
    });

});