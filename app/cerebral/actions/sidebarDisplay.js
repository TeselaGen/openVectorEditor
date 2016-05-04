module.exports = function sidebarDisplay({input, state, output}) {
    var { type } = input;
    if(type in ('Features'|'Cutsites'|'Orfs')) {
        state.set('sidebarType', type);
    } else {
        console.log("invalid sidebar type");
    }
}