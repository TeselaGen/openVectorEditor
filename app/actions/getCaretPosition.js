export default function getCaretPostion({}, tree, output) {
    output({
        caretPosition: tree.get(['caretPosition'])
    });
}