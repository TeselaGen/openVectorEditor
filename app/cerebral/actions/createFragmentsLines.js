module.exports = function createFragmentsLines({input, state, output}) {
    var geneRuler = state.get('currentGeneRuler');
    var cutsites = state.get('cutsites');
    var upperBoundary = geneRuler[0];

    function sortNumber(a,b) {
        return a - b;
    }
    let ranges = [];
    for (let i = 0; i < cutsites.length; i++) {
        ranges.push(Math.abs(cutsites[i].end - cutsites[i].start));
    }
    ranges.sort(sortNumber);
    ranges.reverse();

    let yCount = 0;
    let fragmentsNum = 1;
    let fragments = [];
    let lineWidth = 1;

    for (let iLeft = 0, iRight = 0; ; ) {
        if (iLeft == geneRuler.length && iRight == ranges.length) {
            break;
        } else if (iRight == ranges.length || geneRuler[iLeft] >= ranges[iRight]) {
            let offset = (upperBoundary - geneRuler[iLeft]) / upperBoundary;
            let offPix = offset.toFixed(2) * 300;
            offPix = (offPix - yCount);
            yCount += offPix;
            offPix = offPix + "px";
            fragments.push({style: "left", marginTop: offPix, borderWidth: 1});
            iLeft++;
        } else if (iLeft == geneRuler.length || geneRuler[iLeft] < ranges[iRight]) {
            let offset = (upperBoundary - ranges[iRight]) / upperBoundary;
            let offPix = offset.toFixed(2) * 300;
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
            fragments.push({style: "right", marginTop: offPix, borderWidth: lineWidth});
            iRight++;
        }
    }
    if (fragmentsNum > 0) {
        fragmentsNum++;
    }
    state.set('fragmentsNum', fragmentsNum);
    state.set('fragments', fragments);
};