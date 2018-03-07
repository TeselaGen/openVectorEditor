import { tidyUpSequenceData, generateSequenceData } from "ve-sequence-utils";

import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";

// ------------------------------------
// Actions
// ------------------------------------
export const upsertAlignmentRun = createAction("upsertAlignmentRun");
//eg: annotationSupportToggle('features')

// let alignment = [
//   {
//     sequenceData: {
//       id: 1,
//       sequence:
//         "gtagagtagagagaGAGATAGAGAgaggtagagta------GAGATAGAGAgaggtagagtagagagaGAGATAGAGAgaggtagagtagagagaGAGATAGAGAgag"
//     }
//   },
//   {
//     sequenceData: {
//       id: 2,
//       features: [
//         {start: 3, end: 12},
//         {start: 20, end: 12},
//       ],
//       sequence:
//         "--agagt---gagaGAGATAGAGAgaggtagagtagagagaGAGATAGAGAgaggtagagtagagagaGAGATAGAGAgaggtagagtagagagaGAGATAGAGAgag"
//     }
//   },
//   {
//     sequenceData: {
//       id: 3,
//       sequence:
//         "gtagagtagagagaGAG-----GAgaggtagagtagagagaGAGATAGAGAgaggtagagtagagagaGAGATAGAGAgaggtagagtagagagaGAGATAGAGAgag"
//     }
//   }
// ];

function shuffle(string, n, char) {
  let arr = string.split("");
  let charToUse = char || " ";

  while (n--) {
    arr.splice(Math.floor(Math.random() * (arr.length + 1)), 0, charToUse);
  }

  return arr.join("");
} //shuffle

let alignmentTracks = [1, 2, 3].map(() => {
  const sequenceData = generateSequenceData({ sequenceLength: 10 });
  // sequenceData.orfs = [{ start: 2, end: 5, id: "orf" }]
  return {
    sequenceData,
    alignmentData: { sequence: shuffle(sequenceData.sequence, 50, "-") }
  };
});

function addHighlightedDifferences(alignmentTracks) {
  return alignmentTracks.map(track => {
    const sequenceData = tidyUpSequenceData(track.sequenceData);
    const matchHighlightRanges = getRangeMatchesBetweenTemplateAndNonTemplate(
      alignmentTracks[0].alignmentData.sequence,
      track.alignmentData.sequence
    );
    return {
      ...track,
      sequenceData,
      matchHighlightRanges,
      selectionLayer: matchHighlightRanges
        .filter(({ isMatch }) => !isMatch)
        .map(range => {
          return { ...range, color: "red", hideCarets: true, ignoreGaps: true };
        })
    };
  });
}

alignmentTracks = addHighlightedDifferences(alignmentTracks);

// ------------------------------------
// Reducer
// ------------------------------------
export default createMergedDefaultStateReducer(
  {
    [upsertAlignmentRun]: (state, payload) => {
      let payloadToUse = { ...payload };
      if (payloadToUse.alignmentTracks)
        payloadToUse.alignmentTracks = addHighlightedDifferences(
          payloadToUse.alignmentTracks
        );
      return {
        ...state,
        [payload.id]: payloadToUse
      };
    }
  },
  {
    alignmentRun1: {
      alignmentTracks
    }
  }
);

//returns an array like so: [{start: 0, end: 4, isMatch: false}, {start,end,isMatch} ... etc]
function getRangeMatchesBetweenTemplateAndNonTemplate(tempSeq, nonTempSeq) {
  //assume all sequences are the same length (with gap characters "-" in some places)
  //loop through all non template sequences and compare them with the template

  const seqLength = nonTempSeq.length;
  const ranges = [];
  for (let index = 0; index < seqLength; index++) {
    const isMatch =
      tempSeq[index].toLowerCase() === nonTempSeq[index].toLowerCase();
    const lastRange = ranges[ranges.length - 1];
    if (lastRange) {
      if (lastRange.isMatch === isMatch) {
        lastRange.end++;
      } else {
        ranges.push({
          start: index,
          end: index,
          isMatch
        });
      }
    } else {
      ranges.push({
        start: 0,
        end: 0,
        isMatch
      });
    }
  }
  return ranges;
}
