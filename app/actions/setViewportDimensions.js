var deepEqual = require('deep-equal');
export default function setViewportDimensions({newViewportDimensions}, tree, output) {
	if (newViewportDimensions.width > 0 && newViewportDimensions.height > 0) {
		var viewportDimensions = tree.select('viewportDimensions');
		if (!deepEqual(viewportDimensions.get(), newViewportDimensions)) {
			viewportDimensions.set(newViewportDimensions);
			tree.select('rowViewDimensions').set({
				height: newViewportDimensions.height * 0.7,
				width: newViewportDimensions.width * 0.7
			});
			//tnr: enable this to get char width resizing as well (probably not desired)
			tree.select('charWidth').set(Math.floor(newViewportDimensions.width/50));
		}
	}
};