export default function getSequenceLength({}, tree, output) {
    output({
        sequenceLength: tree.get(['sequenceLength'])
    });
}