module.exports = function sidebarDisplay({input, state, output}) {
    var { type } = input;
    if(type == 'Features' | type == 'Cutsites'| type=='Orfs') {
        state.set('sidebarType', type);
    } else {
        console.log("invalid sidebar type");
    }
}