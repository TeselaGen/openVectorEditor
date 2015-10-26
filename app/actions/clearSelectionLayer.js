import setSelectionLayer from './setSelectionLayer';
export default function clearSelectionLayer({}, tree) {
    setSelectionLayer({selectionLayer: false},tree)
}