export default function getCaretPostion({}, tree, output) {
    output({
        selectionLayer: tree.get(['selectionLayer'])
    });
}