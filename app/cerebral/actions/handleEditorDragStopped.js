var copySelectionModule = require('./copySelectionModule');

export default function handleEditorDragStopped({input, state}) {
    // console.log('something cray: ');
    state.set(['editorDrag', 'inProgress'], false);

    copySelectionModule(state); // earavina: added as a workaround for async calls
}