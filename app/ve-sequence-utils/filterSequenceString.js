import ac from 've-api-check';
export default function filterSequenceString(sequenceString) {
    ac.throw(ac.string,sequenceString);
    return sequenceString.replace(/[^atgcyrswkmbvdhn]/ig, '');
}
