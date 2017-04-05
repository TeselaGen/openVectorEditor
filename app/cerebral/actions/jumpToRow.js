export default function jumpToRow({input: {rowToJumpTo}, state, output}) {
    state.set(['rowToJumpTo'], rowToJumpTo);
}
