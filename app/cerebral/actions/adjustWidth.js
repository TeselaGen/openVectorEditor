export default function adjustWidth({input, state, output}) {
    var charWidth = state.get('charWidth');

    var draggable = document.getElementById("draggable");
    var dragWidth = draggable.clientWidth;

    var rowView = document.getElementById("rowView");
    var rowWidth = rowView.clientWidth;

    rowWidth -= (rowWidth % (charWidth - 1));
    draggable.style.width = rowWidth + 'px';

    if (rowWidth === 0) {
        return;
    }

    let newBps =  rowWidth / (charWidth - 1);
    state.set('bpsPerRow', newBps);
}
