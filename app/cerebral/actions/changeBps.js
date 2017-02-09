export default function changeBps({input, state, output}) {
    let charWidth = state.get('charWidth');
    let newBps = input.width / (charWidth-1);
    console.log(newBps);
    state.set('bpsPerRow', Math.floor(newBps));
}
