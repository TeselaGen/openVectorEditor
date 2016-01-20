export default function insertSequenceData({input: {rowToJumpTo}, state, output}) {
    state.set(['rowToJumpTo'], rowToJumpTo);
}