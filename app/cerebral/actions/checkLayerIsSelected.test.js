var checkLayerIsSelected = require('./checkLayerIsSelected');
var controller = require('../controller')({
    //instantiate some default val's here:
    state: {
        selectionLayer: {
            selected: false,
        }
    }
});

describe('checkLayerIsSelected', function() {
    it('should call success when selectionLayer.selected = true', function(done) {
        controller.reset();
        controller.tree.set(['selectionLayer', 'selected'], true);     
        checkLayerIsSelected({}, controller.tree, {
            selected: function() {
                done()
            },
            notSelected: function() {
                throw new Error();
            }
        });
    });
    it('should call error when selectionLayer.selected = false', function(done) {
        controller.reset();
        controller.tree.set(['selectionLayer', 'selected'], false);         
        checkLayerIsSelected({}, controller.tree, {
            selected: function() {
                throw new Error();
            },
            notSelected: function() {
                done()
            }
        });
    });

});