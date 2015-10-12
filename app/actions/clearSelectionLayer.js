var setSelectionLayer = require('./setSelectionLayer');
export default function clearSelectionLayer({}, tree) {
    setSelectionLayer({selectionLayer: false},tree)
}