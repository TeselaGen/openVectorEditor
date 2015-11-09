var checkLayerIsSelected = require('./checkLayerIsSelected');
describe('checkLayerIsSelected', function() {
    it('should call success when selectionLayer.selected = true', function(done) {
        checkLayerIsSelected({
            selectionLayer: {
                selected: true
            }
        }, {}, {
            selected: function() {
                done()
            },
            notSelected: function() {
                throw new Error();
            }
        });
    });
    it('should call error when selectionLayer.selected = false', function(done) {
        checkLayerIsSelected({
            selectionLayer: {
                selected: false
            }
        }, {}, {
            selected: function() {
                throw new Error();
            },
            notSelected: function() {
                done()
            }
        });
    });

});