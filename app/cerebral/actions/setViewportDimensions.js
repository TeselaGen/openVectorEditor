//tnr: deprecated/just for show
var deepEqual = require('deep-equal');
export default function setViewportDimensions({input: {newViewportDimensions}, state, output}) {
    if (newViewportDimensions.width > 0 && newViewportDimensions.height > 0) {
        if (!deepEqual(state.get('viewportDimensions'), newViewportDimensions)) {
            state.set('viewportDimensions', newViewportDimensions);
            state.set('rowViewDimensions', {
                height: newViewportDimensions.height * 0.7,
                width: newViewportDimensions.width * 0.7
            });
            //tnr: enable this to get char width resizing as well (probably not desired)
            state.select('charWidth').set(Math.floor(newViewportDimensions.width/50));
        }
    }
}