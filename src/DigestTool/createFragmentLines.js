// let {getCutsitesFromSequence} = require('@teselagen/sequence-utils');
// let {assign} = require('lodash');

// module.exports = function createFragmentsLines({input: {geneRuler, enzymes}, state, output}) {
//     if (geneRuler === "geneRuler1kb") {
//         geneRuler = [20000, 10000, 7000, 5000, 4000, 3000, 2000, 1500, 1000, 700, 500, 400, 300, 200, 75];
//     } else {
//         geneRuler = [3000, 2000, 1500, 1200, 1000, 900, 800, 700, 600, 500, 400, 300, 200, 100];
//     }

//     let cutsites = state.get('digestCutsites');
//     if (cutsites.length === 0) {
//         state.set('fragmentsNum', 0);
//         state.set('fragments', []);
//         return;
//     }

//     let sequenceLength = state.get(['sequenceData', 'sequence']).length;
//     let circular = state.get(['sequenceData', 'circular']);

//     function sortNumber(a,b) {
//         if (a.position) {
//             return a.position - b.position;
//         }
//         if (a.segmentLength) {
//             return a.segmentLength - b.segmentLength;
//         }
//     }

//     let cutsitesData = [];
//     let position;
//     let cutsite;
//     for (let i = 0; i < cutsites.length; i++) {
//         cutsite = Object.assign({}, cutsites[i]);
//         position = Math.floor((cutsite.end + cutsite.start)/2);
//         cutsite.position = position;
//         cutsitesData.push(cutsite);
//     }

//     // circular or linear
//     cutsitesData = cutsitesData.sort(sortNumber);
//     if (circular) {
//         var lines = [ // if circular, fragment wraps around origin
//             {
//                 segmentLength: sequenceLength - cutsitesData[cutsitesData.length-1].start + cutsitesData[0].end,
//                 enzyme1: cutsitesData[cutsitesData.length-1].start + '('+cutsitesData[cutsitesData.length-1].name+')',
//                 enzyme2: cutsitesData[0].end + '('+cutsitesData[0].name+')'
//             }
//         ];
//     } else {
//         var lines = [ // if not ciruclar, need to split into two seperate fragments
//             {
//                 segmentLength: sequenceLength - cutsitesData[cutsitesData.length-1].start,
//                 enzyme1: cutsitesData[cutsitesData.length-1].start + '('+cutsitesData[cutsitesData.length-1].name+')',
//                 enzyme2: sequenceLength
//             },
//             {
//                 segmentLength: cutsitesData[0].end,
//                 enzyme1: 0,
//                 enzyme2: cutsitesData[0].end + '('+cutsitesData[0].name+')'
//             }
//         ];
//     }

//     // get fragments
//     for (let i=0; i<cutsitesData.length-1; i++) {
//         lines.push({
//             segmentLength: Math.abs(cutsitesData[i+1].end - cutsitesData[i].start),
//             enzyme1: cutsitesData[i].start + ' ('+cutsitesData[i].name+')',
//             enzyme2: cutsitesData[i+1].end + ' ('+cutsitesData[i+1].name+')'
//         });
//     }

//     lines = lines.sort(sortNumber).reverse();

//     let fragmentsNum = 0; // counter for number of fragments
//     let lineWidth = 1;
//     let boxHeight = 275;
//     let upperBoundary = lines[0].segmentLength > geneRuler[0] ? lines[0].segmentLength : geneRuler[0];
//     let fragments = [];

//     // position fragments on the ladder
//     for (let iLeft = 0, iRight = 0; ; ) {
//         if (iLeft == geneRuler.length && iRight === lines.length) {
//             break;

//         } else if (iRight == lines.length || geneRuler[iLeft] >= lines[iRight].segmentLength) {
//             fragments.push({
//                 align: "left",
//                 bottom: (boxHeight * Math.log(geneRuler[iLeft]) / Math.log(upperBoundary)) - 25,
//                 left: 15,
//                 width: '25%',
//                 borderWidth: 1,
//                 position: geneRuler[iLeft],
//                 tooltip: geneRuler[iLeft]
//             });
//             iLeft++;

//         } else if (iLeft == geneRuler.length || geneRuler[iLeft] < lines[iRight].segmentLength) {
//             fragments.push({
//                 align: "right",
//                 bottom: (boxHeight * Math.log(lines[iRight].segmentLength) / Math.log(upperBoundary)) - 25,
//                 left: 75,
//                 width: '75%',
//                 borderWidth: lineWidth,
//                 position: lines[iRight].segmentLength,
//                 tooltip: lines[iRight].segmentLength + ' : ' + lines[iRight].enzyme1 + ' .. ' + lines[iRight].enzyme2
//             });
//             fragmentsNum++;
//             iRight++;

//         } else {
//             console.warn("error getting digest fragments");
//             break;
//         }
//     }

//     state.set('fragmentsNum', fragmentsNum);
//     state.set('fragments', fragments);
// };
