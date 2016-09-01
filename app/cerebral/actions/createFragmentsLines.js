module.exports = function createFragmentsLines({input, state, output}) {
    var geneRuler = state.get('currentGeneRuler');
    var cutsites = state.get('cutsites');
    var upperBoundary = geneRuler[0]; // offsets start from this position

    function sortNumber(a,b) {
        return a - b;
    }
    let cutsitesData = []; // cutsites positions
    for (let i = 0; i < cutsites.length; i++) {
        cutsitesData.push(Math.abs(cutsites[i].end - cutsites[i].start));

        /* Making cutsitesData an array of objects doesn't work - script gets unresponsive :( */
            // {
            // position: Math.abs(cutsites[i].end - cutsites[i].start),
            // start: cutsites[i].start,
            // end: cutsites[i].end,
            // enzyme: cutsites[i].restrictionEnzyme,
        // }
        // );
    }
    cutsitesData.sort(sortNumber);
    cutsitesData.reverse();

    let yCount = 0; // accumulated global offset from the top of the box
    let fragmentsNum = 0; // counter for number of fragments
    let fragments = []; // data about all cutsites that will help to render them
    let lineWidth = 1; // counter to take into account the fragments with the same range
    let boxHeight = 200;

    for (let iLeft = 0, iRight = 0; ; ) {
        if (iLeft == geneRuler.length && iRight == cutsitesData.length) {
            break;
        } else if (iRight == cutsitesData.length || geneRuler[iLeft] >= cutsitesData[iRight]) {
            let globalOffsetPercent = (upperBoundary - geneRuler[iLeft]) / upperBoundary;
            let localOffsetPixels = globalOffsetPercent.toFixed(2) * boxHeight - yCount;
            yCount += localOffsetPixels; // update global offset
            localOffsetPixels = localOffsetPixels + "px";
            fragments.push({align: "left", marginTop: localOffsetPixels, borderWidth: 1, position: geneRuler[iLeft]});
            iLeft++;
        } else if (iLeft == geneRuler.length || geneRuler[iLeft] < cutsitesData[iRight]) {
            let globalOffsetPercent = (upperBoundary - cutsitesData[iRight]) / upperBoundary;
            let localOffsetPixels = globalOffsetPercent.toFixed(2) * boxHeight - yCount;
            if (localOffsetPixels == 0 && fragments[fragments.length - 1].align != "left") { // same range -> make the line "stick" to the previous
                lineWidth++;
                fragments.pop();
            } else { // independent line
                lineWidth = 1;
                fragmentsNum++;
            }
            yCount += localOffsetPixels; // update global offset
            localOffsetPixels = localOffsetPixels + "px";
            fragments.push({
                align: "right",
                marginTop: localOffsetPixels,
                borderWidth: lineWidth,
                position: cutsitesData[iRight],

                /* too much data (for tooltips) make script unresponsive */
                // position: cutsitesData[iRight].position,
                // start: cutsitesData[iRight].start,
                // end: cutsitesData[iRight].end,
                // enzyme: cutsitesData[iRight].enzyme,
            });
            iRight++;
        }
    }

    state.set('fragmentsNum', fragmentsNum);
    state.set('fragments', fragments);
};