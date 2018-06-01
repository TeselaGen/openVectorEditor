import {
  tidyUpSequenceData /* generateSequenceData */,
  condensePairwiseAlignmentDifferences
} from "ve-sequence-utils";
import addDashesForMatchStartAndEndForTracks from "./utils/addDashesForMatchStartAndEndForTracks";


import { /* createReducer, */ createAction } from "redux-act";

// import createAction from "./utils/createMetaAction";
// import createMergedDefaultStateReducer from "./utils/createMergedDefaultStateReducer";
// import ab1ParsedGFPuv54 from "../ToolBar/ab1ParsedGFPuv54.json";
// import ab1ParsedGFPuv58 from "../ToolBar/ab1ParsedGFPuv58.json";
// import ab1ParsedGFPvv50 from "../ToolBar/ab1ParsedGFPvv50.json";
// import ab1ParsedGFPvv60 from "../ToolBar/ab1ParsedGFPvv60.json";
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
export const alignmentRunUpdate = createAction("ALIGNMENT_RUN_UPDATE");

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
    // .filter by the user-specified mismatch overrides (initially [])
    const mismatches = matchHighlightRanges.filter(({ isMatch }) => !isMatch);
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

export default (state = {}, { payload = {}, type }) => {
  if (type === "ALIGNMENT_RUN_UPDATE") {
    const { alignmentId } = payload;
    const newState = {
      ...state,
      [alignmentId]: {
        ...state[alignmentId],
        ...payload
      }
    };
    return newState;
  }
  if (type === "UPSERT_ALIGNMENT_RUN") {
    // magicDownload(JSON.stringify(payload), 'myFile.json')
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
      if (payloadToUse.pairwiseAlignments[0][0].alignmentData.matchStart !== undefined) {
        payloadToUse.pairwiseAlignments = payloadToUse.pairwiseAlignments.map(
          addDashesForMatchStartAndEndForTracks
        );
      }
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
        addHighlightedDifferences
      );
    }
    if (payloadToUse.alignmentTracks) {
      //tnr: the following is commented out because it is not yet ready
      // payloadToUse.alignmentTracks = addDashesForMatchStartAndEndForTracks(
      //   payloadToUse.alignmentTracks
      // );
      payloadToUse.alignmentTracks = addHighlightedDifferences(
        payloadToUse.alignmentTracks
      );
    }
    //check for issues
    let hasError = checkForIssues(payloadToUse.alignmentTracks);
    (payloadToUse.pairwiseAlignments || []).forEach(alignment => {
      const error = alignment;
      if (error) {
        hasError = error;
      }
    });

    // payloadToUse.pairwiseAlignments && magicDownload(JSON.stringify(payloadToUse), 'myFile.json')
    return {
      ...state,
      [payload.id]: { ...payloadToUse, hasError }
    };
  }
  return state;
};

//returns an array like so: [{start: 0, end: 4, isMatch: false}, {start,end,isMatch} ... etc]
function getRangeMatchesBetweenTemplateAndNonTemplate(tempSeq, nonTempSeq) {
  //assume all sequences are the same length (with gap characters "-" in some places)
  //loop through all non template sequences and compare them with the template

  const seqLength = nonTempSeq.length;
  const ranges = [];
  // const startIndex = "".match/[-]/ Math.max(0, .indexOf("-"));
  const nonTempSeqWithoutLeadingDashes = nonTempSeq.replace(/^-+/g, "");
  const nonTempSeqWithoutTrailingDashes = nonTempSeq.replace(/-+$/g, "");

  const startIndex = seqLength - nonTempSeqWithoutLeadingDashes.length;
  const endIndex = seqLength - (seqLength - nonTempSeqWithoutTrailingDashes.length);
  for (let index = startIndex; index < endIndex; index++) {
    const isMatch =
      tempSeq[index].toLowerCase() === nonTempSeq[index].toLowerCase();
    const previousRange = ranges[ranges.length - 1];
    if (previousRange) {
      if (previousRange.isMatch === isMatch) {
        previousRange.end++;
      } else {
        ranges.push({
          start: index,
          end: index,
          isMatch
        });
      }
    } else {
      ranges.push({
        start: startIndex,
        end: startIndex,
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
  let hasError;
  alignmentTracks.some(track => {
    if (track.alignmentData.sequence.length !== alignmentTrackLength) {
      console.error("incorrect length", alignmentTracks);

      return "incorrect length";
    }
    if (
      track.chromatogramData &&
      track.sequenceData.sequence.length !==
        track.chromatogramData.baseCalls.length
    ) {
      console.error("incorrect chromatogram length", alignmentTracks);

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
      hasError = "sequence data length does not match alignment data w/o gaps";
      return true;
    }
    return false;
  });
  if (hasError) {
    return hasError;
    /* eslint-disable */
    debugger;
    /* eslint-enable */
  }
}
