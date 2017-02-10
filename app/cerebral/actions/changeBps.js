export default function changeBps({input, state, output}) {
    if (!input.width) {
        var draggable = document.getElementById("draggable");
        var width = draggable.clientWidth;
    } else {
        var width = input.width;
    }

    if (width === 0) {
        return;
    }

    let charWidth = state.get('charWidth');
    let newBps = Math.round( width / (charWidth-1) );
    state.set('bpsPerRow', newBps);
}
