//tnr: deprecated/just for show
var deepEqual = require('deep-equal');
export default function setViewportDimensions({newViewportDimensions}, tree, output) {
    if (newViewportDimensions.width > 0 && newViewportDimensions.height > 0) {
        if (!deepEqual(tree.get('viewportDimensions'), newViewportDimensions)) {
            tree.set('viewportDimensions', newViewportDimensions);
            tree.set('rowViewDimensions', {
                height: newViewportDimensions.height * 0.7,
                width: newViewportDimensions.width * 0.7
            });
            //tnr: enable this to get char width resizing as well (probably not desired)
            tree.select('charWidth').set(Math.floor(newViewportDimensions.width/50));
        }
    }
};