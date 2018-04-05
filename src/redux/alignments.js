import {
  tidyUpSequenceData /* generateSequenceData */,
  condensePairwiseAlignmentDifferences
} from "ve-sequence-utils";

import createAction from "./utils/createMetaAction";
import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";
// import ab1ParsedGFPuv54 from "../ToolBar/ab1ParsedGFPuv54.json";
// import ab1ParsedGFPuv58 from "../ToolBar/ab1ParsedGFPuv58.json";
import ab1ParsedGFPvv50 from "../ToolBar/ab1ParsedGFPvv50.json";
import ab1ParsedGFPvv60 from "../ToolBar/ab1ParsedGFPvv60.json";
import alignmentsData from "./alignments_data.json";
// import { magicDownload } from "teselagen-react-components";

const defaultAlignmentAnnotationVisibility = {
  features: false,
  translations: false,
  parts: false,
  orfs: false,
  orfTranslations: false,
  cdsFeatureTranslations: false,
  axis: true,
  cutsites: false,
  primers: false,
  reverseSequence: false,
  lineageLines: false,
  axisNumbers: true,
  yellowAxis: false
};

const defaultPairwiseAlignmentAnnotationVisibility = {
  features: true,
  yellowAxis: false,
  translations: false,
  parts: true,
  orfs: true,
  orfTranslations: false,
  cdsFeatureTranslations: false,
  axis: true,
  cutsites: false,
  primers: true,
  reverseSequence: false,
  lineageLines: true,
  axisNumbers: true
};

const defaultAlignmentAnnotationLabelVisibility = {
  features: false,
  parts: false,
  cutsites: false
};

const defaultPairwiseAlignmentAnnotationLabelVisibility = {
  features: true,
  parts: true,
  cutsites: false
};

// ------------------------------------
// Actions
// ------------------------------------
export const upsertAlignmentRun = createAction("UPSERT_ALIGNMENT_RUN");
// export const alignmentAnnotationVisibilityToggle = createAction("alignmentAnnotationVisibilityToggle");
//eg: annotationSupportToggle('features')

let alignmentTracks = [
  {
    //JBEI sequence 'GFPvv50'
    chromatogramData: ab1ParsedGFPvv50,
    sequenceData: {
      id: "1",
      name: "GFPvv50",
      sequence:
        "TTGTACACTTTTTTGTTGATATGTCATTCTTGTTGATTACATGGTGATGTTAATGGGCACAAATTTTCTGTCAGTGGAGAGGGTGAAGGTGATGCAACATACGGAAAACTTACCCTTAAATTTATTTGCACTACTGGAAAACTACCTGTTCCATGGCCAACACTTGTCACTACTTTCTCTTATGGTGTTCAATGCTTTTCCCGTTATCCGGATCATATGAAACGGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACAGGAACGCACTATATCTTTCAAAGATGACGGGAACTACAAGACGCGTGCTGAAGTCAAGTTTGAAGGTGATACCCTTGTTAATCGTATCGAGTTAAAAGGTATTGATTTTAAAGAAGATGGAAACATTCTCGGACACAAACTCGAATACAACTATAACTCACACAATGTATACATCACGGCAGACAAACAAAAGAATGGAATCAAAGCTAACTTCAAAATTCGCCACAACATTGAAGATGGATCTGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCAGACAACCATTACCTGTCGACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGCGTGACCACATGGTCCTTCTTGAGTTTGTAACTGCTGCTGGGATTACACATGGCATGGATGAGCTCGGCGGCGGCGGCAGCAAGGTCTACGGCAAGGAACAGTTTTTGCGGATGCGCCAGAGCATGTTCCCCGATCGCTAAATCGAGTAAGGATCTCCAGGCATCAAATAAAACGAAAGGCTCAGTCGAAAGACTGGGCCTTTCGTTTTATCTGTTGTTTGTCGGTGAACGCTCTCTACTAGAGTCACACTGGCTCACCTTCGGGTGGGCCTTTCTGCGTTTATACCTAGGGTACGGGTTTTGCTGCCCGCAAACGGGCTGTTCTGGTGTTGCTAGTTTGTTATCAGAATCGCAGATCCCGGCTTCAGCCGGG"
    },
    alignmentData: {
      id: "1",
      sequence:
        "ttgtacact------------------------------------------------------------------------------------------------------------------------------------------tttttgttgatatgtcattcttgttgattacatgg-----------------tgatgttaatgggcacaaattttctgtcagtggagagggtgaa-----ggtgatgcaacatacggaaaacttacccttaaatttatttgcactactg------gaaaactacctgttccatggccaacacttgtcactactttctcttatggtgttcaatgcttttcccgttatccggatcatatgaaacggcatgactttttcaagagtgccatgcccgaaggttatgtacaggaacgcactatatctttcaaagatgacgggaactacaagacgcgtgctgaagtcaagtttgaaggtgatacccttgttaatcgtatcgagttaaaaggtattgattttaaagaagatggaaacattctcggacacaaactcgaatacaactataactcacacaatgtatacatcacggcagacaaacaaaagaatggaatcaaagctaacttcaaaattcgccacaacattgaagatggatctgttcaactagcaga----------ccattatca--acaaaatactccaattggcgatggccctgtccttttaccagacaaccattacctgtcgacaca-atctgccctttcgaaagatcccaacgaaaagcgtgaccacatggtccttcttgagtttgtaactgctgctgggattacacatggcatggatgagctcggcggcggcggcagcaaggtctacggcaaggaacagtttttgcggatgcgccagagcatgttccccgatcgctaaatcgagtaaggatctccaggcatcaaataaaacgaaaggctcagtcgaaagactgggcctttcgttttatctgttgtttgtcggtgaacgctctctactagagtcacactggctcaccttcgggtgggcctttctgcgtttatacctagggtacgggttttgctgcccgcaaacgggctgttctggtgttgctagtttgttatcagaatcgcagatcccggcttcagccggg"
    }
  },
  {
    //JBEI sequence 'GFPvv60'
    chromatogramData: ab1ParsedGFPvv60,
    sequenceData: {
      id: "2",
      name: "GFPvv60",
      sequence:
        "CTGTCTGCTACGACGCACTGTTCTTGCCGTAGACCTTGCTGCCGCCGCCGCCGAGCTCATCCATGCCATGTGTAATCCCAGCAGCAGTTACAAACTCAAGAAGGACCATGTGGTCACGCTTTTCGTTGGGATCTTTCGAAAGGGCAGATTGTGTCGACAGGTAATGGTTGTCTGGTAAAAGGACAGGGCCATCGCCAATTGGAGTATTTTGTTGATAATGGTCTGCTAGTTGAACAGATCCATCTTCAATGTTGTGGCGAATTTTGAAGTTAGCTTTGATTCCATTCTTTTGTTTGTCTGCCGTGATGTATACATTGTGTGAGTTATAGTTGTATTCGAGTTTGTGTCCGAGAATGTTTCCATCTTCTTTAAAATCAATACCTTTTAACTCGATACGATTAACAAGGGTATCACCTTCAAACTTGACTTCAGCACGCGTCTTGTAGTTCCCGTCATCTTTGAAAGATATAGTGCGTTCCTGTACATAACCTTCGGGCATGGCACTCTTGAAAAAGTCATGCCGTTTCATATGATCCGGATAACGGGAAAAGCATTGAACACCATAAGAGAAAGTAGTGACAAGTGTTGGCCATGGAACAGGTAGTTTTCCAGTAGTGCAAATAAATTTAAGGGTAAGTTTTCCGTATGTTGCATCACCTTCACCCTCTCCACTGACAGAAAATTTGTGCCCATTAACATCACCATCTAATTCAACAAGAATTGGGACAACTCCAGTGAAAAGTTCTTCTCCTTTACTCATATGTATATCTCCTTCTTAAAAATTCCCAAAAAAACGGGTATGGAGAAACAGTAGAGAGTTGCGATAAAAAGCGTCAGGTAGAATCCGCTAATCTTATGGATAAAAATGCTATGGCATAGCAAAGTGTGACGCCGTGCAAATAATCAATGTGGACTTTTTCTGCCGTGATTATAGACACTTTTGTTACGCGTTTTTGTCATGGGCTTGGGTCCCGCTTTGTTACAGAATGCTTTTAATAAG"
    },
    alignmentData: {
      id: "2",
      sequence:
        "ctgtctgctacgacgcactgttcttgccgtagaccttgctgccgccgccgccgagctcatccatgccatgtgtaatcccagcagcagttacaaactcaagaaggaccatgtggtcacgcttttcgttgggatctttcgaaagggcagattgtgtcgacaggtaatggttgtctggtaaaaggacagggccatcgccaattggagtattttgttgataatggtctgctagttgaacagatccatcttcaatgttgtggcgaattttgaagttagctttgattccattcttttgtttgtctgccgtgatgtatacattgtgtgagttatagttgtattcgagtttgtgtccgagaatgtttccatcttctttaaaatcaataccttttaactcgatacgattaacaagggtatcaccttcaaacttgacttcagcacgcgtcttgtagttcccgtcatctttgaaagatatagtgcgttcctgtacataaccttcgggcatggcactcttgaaaaagtcatgccgtttcatatgatccggataacgggaaaagcattgaacaccataagagaaagtagtgacaagtgttggccatggaacaggtagttttc------cagtagtgcaaataaatttaagggtaagttttccgtatgttgcatcacc-----ttcaccctctccactgacagaaaatttgtgcccattaacatcaccatctaattcaacaagaattgggacaactccagtgaaaagttcttctcctttactcatatgtatatctccttcttaaaaattcccaaaaaaa---------------------cgggtatggagaaacagtagagagttgcgataaaaagcgtca-------ggtagaatccgctaatcttatggataaaaatgctat-----ggcatagcaaagtgtgacgccgtgcaaataatcaatgtggactttttctgccgt----gattatagacacttttgttacgcgtttttgtcatgggcttgggtcccgctttgttacagaatgcttttaataag-----------------------------------------------------------------------------------------------------------------------------------"
    }
  }
];

// let alignmentTracks = [
//   {
//     //JBEI sequence 'GFPuv54'
//     chromatogramData: ab1ParsedGFPuv54,
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

const highlightRangeProps = {
  color: "red",
  hideCarets: true,
  ignoreGaps: true
};
function addHighlightedDifferences(alignmentTracks) {
  return alignmentTracks.map(track => {
    const sequenceData = tidyUpSequenceData(track.sequenceData);
    const matchHighlightRanges = getRangeMatchesBetweenTemplateAndNonTemplate(
      alignmentTracks[0].alignmentData.sequence,
      track.alignmentData.sequence
    );
    const mismatches = matchHighlightRanges.filter(({ isMatch }) => !isMatch);
    // console.log('mismatches', mismatches);
    return {
      ...track,
      sequenceData,
      matchHighlightRanges,
      additionalSelectionLayers: matchHighlightRanges
        .filter(({ isMatch }) => !isMatch)
        .map(range => {
          return { ...range, ...highlightRangeProps };
          // height: 21
        }),
      mismatches
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
        alignmentAnnotationVisibility: payload.pairwiseAlignments
          ? defaultPairwiseAlignmentAnnotationVisibility
          : defaultAlignmentAnnotationVisibility,
        alignmentAnnotationLabelVisibility: payload.pairwiseAlignments
          ? defaultPairwiseAlignmentAnnotationLabelVisibility
          : defaultAlignmentAnnotationLabelVisibility,
        ...payload
      };
      if (payloadToUse.pairwiseAlignments) {
        const templateSeq = payloadToUse.pairwiseAlignments[0][0];
        //we need to get all of the sequences in a single alignment (turning inserts into single BP red highlights)
        const pairwiseOverviewAlignmentTracks = [
          {
            //add the template seq as the first track in the Pairwise Alignment Overview
            ...templateSeq,
            alignmentData: { sequence: templateSeq.sequenceData.sequence } //remove the gaps from the template sequence
          }
        ]; // start with just the template seq in there!

        payloadToUse.pairwiseAlignments.forEach(([template, alignedSeq]) => {
          const condensedSeq = condensePairwiseAlignmentDifferences(
            template.alignmentData.sequence,
            alignedSeq.alignmentData.sequence
          );
          const re = /r+/gi;
          let match;
          const additionalSelectionLayers = [];
          while ((match = re.exec(condensedSeq)) != null) {
            additionalSelectionLayers.push({
              start: match.index,
              end: match.index + match[0].length - 1,
              ...highlightRangeProps
            });
          }

          const alignedSeqMinusInserts = {
            ...alignedSeq,
            sequenceData: {
              ...alignedSeq.sequenceData,
              sequence: template.sequenceData.sequence
            },
            additionalSelectionLayers,
            alignmentData: {
              sequence: condensedSeq
            }
          };
          pairwiseOverviewAlignmentTracks.push(alignedSeqMinusInserts);
        });
        payloadToUse.pairwiseOverviewAlignmentTracks = pairwiseOverviewAlignmentTracks;

        payloadToUse.pairwiseAlignments = payloadToUse.pairwiseAlignments.map(
          alignmentTracks => {
            return addHighlightedDifferences(alignmentTracks);
          }
        );
      }
      if (payloadToUse.alignmentTracks) {
        payloadToUse.alignmentTracks = addHighlightedDifferences(
          payloadToUse.alignmentTracks
        );
      }
      //check for issues
      checkForIssues(payloadToUse.alignmentTracks);
      (payloadToUse.pairwiseAlignments || []).map(checkForIssues);

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

function checkForIssues(alignmentTracks) {
  if (
    !alignmentTracks ||
    !alignmentTracks[0] ||
    !alignmentTracks[0].alignmentData
  ) {
    return;
  }

  let alignmentTrackLength = alignmentTracks[0].alignmentData.sequence.length;
  const hasError = alignmentTracks.some(track => {
    if (track.alignmentData.sequence.length !== alignmentTrackLength) {
      console.error("incorrect length", this.props);

      return "incorrect length";
    }
    if (
      track.chromatogramData &&
      track.sequenceData.sequence.length !==
        track.chromatogramData.baseCalls.length
    ) {
      console.error("incorrect chromatogram length", this.props);

      return "incorrect chromatogram length";
    }
    if (
      track.sequenceData.sequence.length !==
      track.alignmentData.sequence.replace(/-/g, "").length
    ) {
      console.error(
        "sequence data length does not match alignment data w/o gaps"
      );
      console.error(
        "track.sequenceData.sequence:",
        track.sequenceData.sequence
      );
      console.error(
        "track.sequenceData.sequence.length:",
        track.sequenceData.sequence.length
      );
      console.error(
        "track.alignmentData.sequence:",
        track.alignmentData.sequence
      );
      console.error(
        'track.alignmentData.sequence.replace(/-/g,""):',
        track.alignmentData.sequence.replace(/-/g, "")
      );
      console.error(
        'track.alignmentData.sequence.replace(/-/g,"").length:',
        track.alignmentData.sequence.replace(/-/g, "").length
      );

      return "sequence data length does not match alignment data w/o gaps";
    }
    return false;
  });
  if (hasError) {
    /* eslint-disable */

    debugger;
    /* eslint-enable */
  }
}
