var setSelectionLayer = require('./setSelectionLayer');
export default function clearSelectionLayer({state}) {
    setSelectionLayer({input: {selectionLayer: false},state})
}