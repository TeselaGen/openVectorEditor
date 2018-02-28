import { tidyUpSequenceData, generateSequenceData } from "ve-sequence-utils";

// import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";

// ------------------------------------
// Actions
// ------------------------------------
// export const annotationSupportToggle = createAction("annotationSupportToggle");
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

let alignmentTracks = [1, 2].map(() => {
  const sequenceData = generateSequenceData({ sequenceLength: 10 });
  return {
    sequenceData,
    alignmentData: { sequence: shuffle(sequenceData.sequence, 50, "-") }
  };
});

alignmentTracks = alignmentTracks.map(track => {
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

// ------------------------------------
// Reducer
// ------------------------------------
export default createMergedDefaultStateReducer(
  {
    // [annotationSupportToggle]: (state, payload) => {
    //   return {
    //     ...state,
    //     [payload]: !state[payload]
    //   };
    // },
  },
  {
    alignmentTracks
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
