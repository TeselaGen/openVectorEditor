import {
  tidyUpSequenceData /* generateSequenceData */,
  condensePairwiseAlignmentDifferences
} from "@teselagen/sequence-utils";
import { convertBasePosTraceToPerBpTrace } from "@teselagen/bio-parsers";
import shortid from "shortid";

import addDashesForMatchStartAndEndForTracks from "./utils/addDashesForMatchStartAndEndForTracks";

import { /* createReducer, */ createAction } from "redux-act";
import { omit } from "lodash";

const alignmentAnnotationSettings = {
  axis: true,
  axisNumbers: true,
  chromatogram: false,
  dnaColors: false,
  features: false,
  parts: false,
  reverseSequence: false,
  sequence: true,
  translations: true,
  orfs: false,
  orfTranslations: false,
  cdsFeatureTranslations: false,
  cutsites: false,
  primers: false,
  compactNames: false
};

const defaultVisibilities = {
  alignmentAnnotationVisibility: alignmentAnnotationSettings,
  pairwise_alignmentAnnotationVisibility: alignmentAnnotationSettings,
  alignmentAnnotationLabelVisibility: {
    features: false,
    parts: false,
    cutsites: false
  },
  pairwise_alignmentAnnotationLabelVisibility: {
    features: false,
    parts: false,
    cutsites: false
  }
};
const defaultVisibilityTypes = Object.keys(defaultVisibilities);

try {
  defaultVisibilityTypes.forEach((type) => {
    const newVal = JSON.parse(window.localStorage.getItem(type));
    if (newVal)
      defaultVisibilities[type] = {
        ...defaultVisibilities[type],
        ...newVal
      };
  });
} catch (e) {
  console.error("error setting localstorage visibility config", e);
}

// ------------------------------------
// Actions
// ------------------------------------
export const upsertAlignmentRun = createAction("UPSERT_ALIGNMENT_RUN");
export const removeAlignmentFromRedux = createAction(
  "REMOVE_ALIGNMENT_FROM_REDUX"
);
export const updateAlignmentViewVisibility = createAction(
  "UPDATE_ALIGNMENT_VIEW_VISIBILITY"
);
export const alignmentRunUpdate = createAction("ALIGNMENT_RUN_UPDATE");

const highlightRangeProps = {
  color: "red",
  hideCarets: true,
  ignoreGaps: true
};
function addHighlightedDifferences(alignmentTracks) {
  return alignmentTracks.map((track) => {
    if (track.isUnmapped) {
      return track;
    }
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
        .map((range) => {
          return { ...range, ...highlightRangeProps };
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

  if (type === "UPDATE_ALIGNMENT_VIEW_VISIBILITY") {
    defaultVisibilityTypes.forEach((type) => {
      if (
        (type.startsWith("pairwise_") && payload.pairwiseAlignments) ||
        (!type.startsWith("pairwise_") && !payload.pairwiseAlignments)
      ) {
        defaultVisibilities[type] = {
          ...defaultVisibilities[type],
          ...payload[type.replace("pairwise_", "")]
        };

        localStorage.setItem(
          type,
          JSON.stringify({
            ...defaultVisibilities[type],
            ...payload[type.replace("pairwise_", "")]
          })
        );
      }
    });
    return {
      ...state,
      [payload.id]: { ...payload }
    };
  }
  if (type === "UPSERT_ALIGNMENT_RUN") {
    const { id } = payload;
    const payloadToUse = {
      stateTrackingId: state[id]?.stateTrackingId ? shortid() : "initialLoadId",
      alignmentType: state[id]?.alignmentType,
      ...payload,
      //assign default visibilities
      ...defaultVisibilityTypes.reduce((acc, type) => {
        if (
          (type.startsWith("pairwise_") && payload.pairwiseAlignments) ||
          (!type.startsWith("pairwise_") && !payload.pairwiseAlignments)
        ) {
          acc[type.replace("pairwise_", "")] = {
            ...defaultVisibilities[type],
            ...payload[type.replace("pairwise_", "")]
          };
        }
        return acc;
      }, {})
    };
    if (payloadToUse.pairwiseAlignments) {
      if (
        payloadToUse.pairwiseAlignments[0][0].alignmentData.matchStart !==
        undefined
      ) {
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
          sequenceData: tidyUpSequenceData(templateSeq.sequenceData),
          alignmentData: { sequence: templateSeq.sequenceData.sequence } //remove the gaps from the template sequence
        }
      ]; // start with just the template seq in there!

      payloadToUse.pairwiseAlignments.forEach(([template, alignedSeq]) => {
        const condensedSeq = condensePairwiseAlignmentDifferences(
          template.alignmentData.sequence,
          alignedSeq.alignmentData.sequence
        );
        let re = /r+/gi;
        let match;
        const additionalSelectionLayers = [];
        while ((match = re.exec(condensedSeq)) != null) {
          additionalSelectionLayers.push({
            start: match.index,
            end: match.index + match[0].length - 1,
            ...highlightRangeProps
          });
        }
        re = /g+/gi;
        // let match;
        while ((match = re.exec(condensedSeq)) != null) {
          additionalSelectionLayers.push({
            start: match.index,
            end: match.index + match[0].length - 1,
            ...highlightRangeProps,
            color: "grey"
          });
        }

        const alignedSeqMinusInserts = {
          ...alignedSeq,
          sequenceData: {
            ...tidyUpSequenceData(alignedSeq.sequenceData),
            sequence: template.sequenceData.sequence
          },
          additionalSelectionLayers,
          alignmentData: {
            sequence: condensedSeq
          }
        };
        pairwiseOverviewAlignmentTracks.push(alignedSeqMinusInserts);
      });
      payloadToUse.pairwiseOverviewAlignmentTracks =
        pairwiseOverviewAlignmentTracks;
      payloadToUse.pairwiseAlignments = payloadToUse.pairwiseAlignments.map(
        addHighlightedDifferences
      );
    }
    if (payloadToUse.alignmentTracks) {
      payloadToUse.alignmentTracks = addHighlightedDifferences(
        payloadToUse.alignmentTracks
      );
    }
    //check for issues
    let hasError = checkForIssues(
      payloadToUse.alignmentTracks,
      payload.alignmentType
    );
    (payloadToUse.pairwiseAlignments || []).forEach((alignment) => {
      const error = alignment;
      if (error) {
        hasError = error;
      }
    });
    return {
      ...state,
      [payload.id]: {
        ...payloadToUse,
        hasError
      }
    };
  }
  if (type === "REMOVE_ALIGNMENT_FROM_REDUX") {
    const { id } = payload;
    state = omit(state, [id]);
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
  const endIndex =
    seqLength - (seqLength - nonTempSeqWithoutTrailingDashes.length);
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

function checkForIssues(alignmentTracks, alignmentType) {
  if (
    !alignmentTracks ||
    !alignmentTracks[0] ||
    !alignmentTracks[0].alignmentData
  ) {
    return;
  }

  const alignmentTrackLength = alignmentTracks[0].alignmentData.sequence.length;
  let hasError;
  alignmentTracks.some((track) => {
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
    if (track.chromatogramData && !track.chromatogramData.baseTraces) {
      if (!track.chromatogramData.basePos) {
        console.error("corrupted chromatogram data", alignmentTracks);
        return "corrupted chromatogram data";
      }
      track.chromatogramData = convertBasePosTraceToPerBpTrace(
        track.chromatogramData
      );
    }
    if (
      alignmentType !== "Parallel Part Creation" &&
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
  }
}
