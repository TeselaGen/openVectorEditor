
export default function handleEditorDragStopped({input, state}) {
    // console.log('something cray: ');
    state.set(['editorDrag', 'inProgress'], false);
}
