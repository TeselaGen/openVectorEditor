export default function setCaretPosition({input: {caretPosition}, state, output}) {
    if (typeof caretPosition==='number' && (caretPosition%1)===0) {
        state.set('caretPosition', caretPosition);
    } else {
        state.set('caretPosition', -1);
    }
}