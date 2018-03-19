import {
  tidyUpSequenceData /* generateSequenceData */
} from "ve-sequence-utils";

import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";
// import ab1ParsedGFPuv54 from "../ToolBar/ab1ParsedGFPuv54.json";
import ab1ParsedGFPuv58 from "../ToolBar/ab1ParsedGFPuv58.json";
import alignmentsData from "./alignments_data.json";

// import { magicDownload } from "teselagen-react-components";
// import { magicDownload } from "teselagen-react-components";

const defaultAlignmentAnnotationVisibility = {
  features: false,
  translations: false,
  parts: false,
  orfs: false,
  orfTranslations: false,
  axis: false,
  cutsites: false,
  primers: false,
  reverseSequence: false,
  lineageLines: false,
  axisNumbers: false,
  yellowAxis: false
};

const defaultAlignmentAnnotationLabelVisibility = {
  features: false,
  parts: false,
  cutsites: false
};

// ------------------------------------
// Actions
// ------------------------------------
export const upsertAlignmentRun = createAction("UPSERT_ALIGNMENT_RUN");
// export const alignmentAnnotationVisibilityToggle = createAction("alignmentAnnotationVisibilityToggle");
//eg: annotationSupportToggle('features')

// let alignmentTracks = [
//   {
//     //JBEI sequence 'GFPuv54'
//     // chromatogramData: ab1ParsedGFPuv54,
//     sequenceData: {
//       id: "1",
//       name: "GFPuv54",
//       sequence:
//         "CAGAAAGCGTCACAAAAGATGGAATCAAAGCTAACTTCAAAATTCGCCACAACATTGAAGATGGATCTGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCAGACAACCATTACCTGTCGACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGCGTGACCACATGGTCCTTCTTGAGTTTGTAACTGCTGCTGGGATTACACATGGCATGGATGAGCTCGGCGGCGGCGGCAGCAAGGTCTACGGCAAGGAACAGTTTTTGCGGATGCGCCAGAGCATGTTCCCCGATCGCTAAATCGAGTAAGGATCTCCAGGCATCAAATAAAACGAAAGGCTCAGTCGAAAGACTGGGCCTTTCGTTTTATCTGTTGTTTGTCGGTGAACGCTCTCTACTAGAGTCACACTGGCTCACCTTCGGGTGGGCCTTTCTGCGTTTATACCTAGGGTACGGGTTTTGCTGCCCGCAAACGGGCTGTTCTGGTGTTGCTAGTTTGTTATCAGAATCGCAGATCCGGCTTCAGCCGGTTTGCCGGCTGAAAGCGCTATTTCTTCCAGAATTGCCATGATTTTTTCCCCACGGGAGGCGTCACTGGCTCCCGTGTTGTCGGCAGCTTTGATTCGATAAGCAGCATCGCCTGTTTCAGGCTGTCTATGTGTGACTGTTGAGCTGTAACAAGTTGTCTCAGGTGTTCAATTTCATGTTCTAGTTGCTTTGTTTTACTGGTTTCACCTGTTCTATTAGGTGTTACATGCTGTTCATCTGTTACATTGTCGATCTGTTCATGGTGAACAGCTTTGAATGCACCAAAAACTCGTAAAAGCTCTGATGTATCTATCTTTTTTACACCGTTTTCATCTGTGCATATGGACAGTTTTCCCTTTGATATGTAACGGTGAACAGTTGTTCTACTTTTGTTTGTTAGTCTTGATGCTTCACTGATAGATACAAGAGCCATAAGAACCTCAGATCCTTCCGTATTTAGCCAGTATGTTCTCTAGTGTGGTTCGTTGTTTTGCCGTGGAGCAATGAGAACGAGCCATTGAGATCATACTTACCTTTGCATGTCACTCAAAATTTTGCCTCAAAACTGGGTGAGCTGAATTTTTGCAGTAGGCATCGTGTAAGTTTTTCTAGTCGGAATGATGATAGATCGTAAGTTATGGATGGTTGGCATTTGTCCAGTTCATGTTATCTGGGGTGTTCGTCAGTCGGTCAGCAGATCCACATAGTGGTTCATCTAGATCACAC"
//     },
//     alignmentData: {
//       id: "1",
//       sequence:
//         "---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------cagaaagcgtcacaaaagatggaatcaaagctaacttcaaaattcgccacaacattgaagatggatctgttcaactagcagaccattatcaacaaaatactccaattggcgatggccctgtccttttaccagacaaccattacctgtcgacacaatctgccctttcgaaagatcccaacgaaaagcgtgaccacatggtccttcttgagtttgtaactgctgctgggattacacatggcatggatgagctcggcggcggcggcagcaaggtctacggcaaggaacag-tttttgcggatgcgccagagcatgttccccgatcgctaaatcgagtaaggatctccaggcatcaaataaaacgaaaggctcagtcgaaagactgggcctttcgttttatctgttgtttgtcggtgaacgctctctactagagtcacactggctcaccttcgggtgggcctttctgcgtttatacctagggtacgggttttgctgcccgcaaacgggctgttctggtgttgctagtttgttatcagaatcgcagatccggcttcagccggtttgccggctgaaagcgctatttcttccagaattgccatgattttttccccacgggaggcgtcactggctcccgtgttgtcggcagctttgattcgataagcagcatcgcctgtttcaggctgtctatgtgtgactgttgagctgtaacaagttgtctcaggtgttcaatttcatgttctagttgctttgttttactggtttcacctgttctattaggtgttacatgctgttcatctgttacattgtcgatctgttcatggtgaacagctttgaatgcaccaaaaactcgtaaaagctctgatgtatctatcttttttacaccgttttcatctgtgcatatggacagttttccctttgatatgtaacggtgaacagttgttctacttttgtttgttagtcttgatgcttcactgatagatacaagagccataagaacctcagatccttccgtatttagccagtatgttctctagtgtggttcgttgttttgccgtggagcaatgagaacgagccattgagatcatacttacctttgcatgtcactcaaaattttgcctcaaaactgggtgagctgaatttttgcagtaggcatcgtgtaagtttttctagtcggaatgatgatagatcgtaagttatggatggttggcatttgtccagttcatgttatctggggtgttcgtcagtcggtcagcagatccacatagtggttcatctagatcacac"
//     }
//   },
//   {
//     //JBEI sequence 'GFPuv58'
//     chromatogramData: ab1ParsedGFPuv58,
//     sequenceData: {
//       id: "2",
//       name: "GFPuv58",
//       sequence:
//         "CGAAAAATGTCAATTCTTGTTGATTAGATGGTGATGTTAATGGGCACAAATTTTCTGTCAGTGGAGAGGGTGAAGGTGAAGCAACATACGGAAAACTTACCCTTAAATTTATTTGCACTACTGGAAAACTACCTGTTCCATGGCCAACACTTGTCACTACTTTCTCTTATGGTGTTCAATGCTTTTCCCGTTATCCGGATCATATGAAACGGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACAGGAACGCACTATATCTTTCAAAGATGACGGGAACTACAAGACGCGTGCTGAAGTCAAGTTTGAAGGTGATACCCTTGTTAATCGTATCGAGTTAAAAGGTATTGATTTTAAAGAAGATGGAAACATTCTCGGACACAAACTCGAATACAACTATAACTCACACAATGTATACATCACGGCAGACAAACAAAAGAATGGAATCAAAGCTAACTTCAAAATTCGCCACAACATTGAAGATGGATCTGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCACACAACCATTACCTGTCGACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGCGTGACCACATGGTCCTTCTTGAGTTTGTAACTGCTGCTGGGATTACACATGGCATGGATGATCTCGGCGGCGGCGTCAGCAAGGTCTACGGCAAGGAACAGTTTTTTGCGGATGCCCCATATCATGTTCCCCGATCGCTAAATCGAGTAAGGATCTCCAGGCATCAAATAAAACCACAGGCTCAGTCTAAAGACTGGCCCTTTCTTTGATCTGTTGTTTGCC"
//     },
//     alignmentData: {
//       id: "2",
//       sequence:
//         "cgaaaaatgtcaattcttgttgattagatggtgatgttaatgggcacaaattttctgtcagtggagagggtgaaggtgaagcaacatacggaaaacttacccttaaatttatttgcactactggaaaactacctgttccatggccaacacttgtcactactttctcttatggtgttcaatgcttttcccgttatccggatcatatgaaacggcatgactttttcaagagtgccatgcccgaaggttatgtacaggaacgcactatatctttcaaagatgacgggaactacaagacgcgtgctgaagtcaagtttgaaggtgatacccttgttaatcgtatcgagttaaaaggtattgattttaaagaagatggaaacattctcggacacaaactcgaatacaactataactcacacaatgtatacatcacggcagacaaacaaaagaatggaatcaaagctaacttcaaaattcgccacaacattgaagatggatctgttcaactagcagaccattatcaacaaaatactccaattggcgatggccctgtccttttaccacacaaccattacctgtcgacacaatctgccctttcgaaagatcccaacgaaaagcgtgaccacatggtccttcttgagtttgtaactgctgctgggattacacatggcatggatgatctcggcggcggcgtcagcaaggtctacggcaaggaacagttttttgcggatgccccatatcatgttccccgatcgctaaatcgagtaaggatctccaggcatcaaataaaaccacaggctcagtctaaagactggccctttc-tttgatctgttgtttgcc--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------"
//     }
//   }
// ];

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

// alignmentTracks = addHighlightedDifferences(alignmentTracks);

// ------------------------------------
// Reducer
// ------------------------------------
export default createMergedDefaultStateReducer(
  {
    // [alignmentAnnotationVisibilityToggle]: (state, {id, name})=> {
    //   return {
    //     ...state,
    //     [id]: {...state[id], alignmentAnnotationVisibility: {
    //       ...state[id].alignmentAnnotationVisibility,
    //       [name]: !state[id].alignmentAnnotationVisibility.alignmentAnnotationVisibility[name]
    //     }}

    //   }
    // },
    [upsertAlignmentRun]: (state, payload) => {
      let payloadToUse = {
        alignmentAnnotationVisibility: defaultAlignmentAnnotationVisibility,
        alignmentAnnotationLabelVisibility: defaultAlignmentAnnotationLabelVisibility,
        ...payload
      };
      if (payloadToUse.pairwiseAlignments) {
        //we need to get all of the sequences in a single alignment (turning inserts into single BP red highlights)
        const pairwiseOverviewAlignmentTracks = [payloadToUse.pairwiseAlignments[0][0]] // start with just the template seq in there!
        payloadToUse.pairwiseAlignments.forEach(([template, alignedSeq], index) => {
          const alignedSeqMinusInserts = {...alignedSeq, alignmentData: {sequence: turnInsertsIntoSingleBpMutations(alignedSeq.alignmentData.sequence, template.alignmentData.sequence)}}
          pairwiseOverviewAlignmentTracks.push(alignedSeqMinusInserts)
        })
        payloadToUse.pairwiseOverviewAlignmentTracks = pairwiseOverviewAlignmentTracks

        payloadToUse.pairwiseAlignments = payloadToUse.pairwiseAlignments.map((alignmentTracks) => {
          return addHighlightedDifferences(
            alignmentTracks
          );
        })
      }
      if (payloadToUse.alignmentTracks)
        payloadToUse.alignmentTracks = addHighlightedDifferences(
          payloadToUse.alignmentTracks
        );
        // payloadToUse.pairwiseAlignments && magicDownload(JSON.stringify(payloadToUse), 'myFile.json')
      return {
        ...state,
        [payload.id]: payloadToUse
      };
    }
  },
  {
    alignmentRun1: alignmentsData
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


function turnInsertsIntoSingleBpMutations(alignedSeq, referenceSeq){

}