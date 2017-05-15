export default function adjustWidth({input, state, output}) {
    var charWidth = state.get('charWidth');
    var draggable = document.getElementById("draggable");
    var rowView = document.getElementById("rowView");

    if (draggable && rowView) {
        var rowWidth = rowView.clientWidth;
        rowWidth -= (rowWidth % (charWidth - 1));
        rowWidth = Math.round(rowWidth/3) * 3;
        var newBps =  rowWidth / (charWidth - 1);
        newBps = Math.round(newBps/3) * 3;// forces bpsPerRow to be multiple of 3, which makes amino acids cleaner
        rowWidth = newBps * (charWidth - 1);

        if (rowWidth <= 0) {
            return;
        }

        draggable.style.width = rowWidth + 'px';
        state.set('bpsPerRow', newBps);
    }
}
