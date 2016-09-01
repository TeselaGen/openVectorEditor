module.exports = function createFragmentsLines({input, state, output}) {
    var geneRuler = state.get('currentGeneRuler');
    var cutsites = state.get('cutsites');
    var upperBoundary = geneRuler[0];

    function sortNumber(a,b) {
        return a - b;
    }
    let cutsitesData = [];
    for (let i = 0; i < cutsites.length; i++) {
        cutsitesData.push(Math.abs(cutsites[i].end - cutsites[i].start));
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

    let yCount = 0;
    let fragmentsNum = 0;
    let fragments = [];
    let lineWidth = 1;

    for (let iLeft = 0, iRight = 0; ; ) {
        if (iLeft == geneRuler.length && iRight == cutsitesData.length) {
            break;
        } else if (iRight == cutsitesData.length || geneRuler[iLeft] >= cutsitesData[iRight]) {
            let offset = (upperBoundary - geneRuler[iLeft]) / upperBoundary;
            let offPix = offset.toFixed(2) * 300;
            offPix = (offPix - yCount);
            yCount += offPix;
            offPix = offPix + "px";
            fragments.push({align: "left", marginTop: offPix, borderWidth: 1, position: geneRuler[iLeft]});
            iLeft++;
        } else if (iLeft == geneRuler.length || geneRuler[iLeft] < cutsitesData[iRight]) {
            let offset = (upperBoundary - cutsitesData[iRight]) / upperBoundary;
            let offPix = offset.toFixed(2) * 300;
            // console.log("Offset fact:" + offPix);
            // console.log(yCount);
            offPix = (offPix - yCount);
            if (offPix == 0) {
                lineWidth++;
                fragments.pop();
            } else {
                lineWidth = 1;
                fragmentsNum++;
            }
            yCount += offPix;
            offPix = offPix + "px";
            // console.log("Offpix " + offPix);
            fragments.push({
                align: "right",
                marginTop: offPix,
                borderWidth: lineWidth,
                position: cutsitesData[iRight],
                // position: cutsitesData[iRight].position,
                // start: cutsitesData[iRight].start,
                // end: cutsitesData[iRight].end,
                // enzyme: cutsitesData[iRight].enzyme,
            });
            iRight++;
        }
    }
    if (fragmentsNum > 0) {
        fragmentsNum++;
    }
    state.set('fragmentsNum', fragmentsNum);
    state.set('fragments', fragments);
};