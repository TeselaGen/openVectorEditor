import {
  tidyUpSequenceData /* generateSequenceData */,
  condensePairwiseAlignmentDifferences
} from "ve-sequence-utils";
import shortid from "shortid";

import { omit } from "lodash";
import addDashesForMatchStartAndEndForTracks from "./utils/addDashesForMatchStartAndEndForTracks";
export default class Alignments {
  alignments = {};

  highlightRangeProps = {
    color: "red",
    hideCarets: true,
    ignoreGaps: true
  };

  alignmentAnnotationSettings = {
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

  defaultVisibilities = {
    alignmentAnnotationVisibility: this.alignmentAnnotationSettings,
    pairwise_alignmentAnnotationVisibility: this.alignmentAnnotationSettings,
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
  defaultVisibilityTypes = Object.keys(this.defaultVisibilities);

  constructor() {
    try {
      this.defaultVisibilityTypes.forEach((type) => {
        const newVal = JSON.parse(window.localStorage.getItem(type));
        if (newVal)
          this.defaultVisibilities[type] = {
            ...this.defaultVisibilities[type],
            ...newVal
          };
      });
    } catch (e) {
      console.error("error setting localstorage visibility config", e);
    }
  }

  alignmentRunUpdate(payload) {
    const { alignmentId } = payload;
    this.alignments = {
      ...this.alignments,
      [alignmentId]: {
        ...this.alignments[alignmentId],
        ...payload
      }
    };
  }

  updateAlighmnetViewVisibility(payload) {
    this.defaultVisibilityTypes.forEach((type) => {
      if (
        (type.startsWith("pairwise_") && payload.pairwiseAlignments) ||
        (!type.startsWith("pairwise_") && !payload.pairwiseAlignments)
      ) {
        this.defaultVisibilities[type] = {
          ...this.defaultVisibilities[type],
          ...payload[type.replace("pairwise_", "")]
        };

        localStorage.setItem(
          type,
          JSON.stringify({
            ...this.defaultVisibilities[type],
            ...payload[type.replace("pairwise_", "")]
          })
        );
      }
    });
    this.alignments = { ...this.alignments, [payload.id]: { ...payload } };
  }

  upsertAlignmentRun(payload) {
    const { id } = payload;
    const payloadToUse = {
      stateTrackingId: this.alignments[id]?.stateTrackingId
        ? shortid()
        : "initialLoadId",
      alignmentType: this.alignments[id]?.alignmentType,
      ...payload,
      //assign default visibilities
      ...this.defaultVisibilityTypes.reduce((acc, type) => {
        if (
          (type.startsWith("pairwise_") && payload.pairwiseAlignments) ||
          (!type.startsWith("pairwise_") && !payload.pairwiseAlignments)
        ) {
          acc[type.replace("pairwise_", "")] = {
            ...this.defaultVisibilities[type],
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
            ...this.highlightRangeProps
          });
        }
        re = /g+/gi;
        // let match;
        while ((match = re.exec(condensedSeq)) != null) {
          additionalSelectionLayers.push({
            start: match.index,
            end: match.index + match[0].length - 1,
            ...this.highlightRangeProps,
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
        this.addHighlightedDifferences
      );
    }
    if (payloadToUse.alignmentTracks) {
      payloadToUse.alignmentTracks = this.addHighlightedDifferences(
        payloadToUse.alignmentTracks
      );
    }
    //check for issues
    let hasError = this.checkForIssues(
      payloadToUse.alignmentTracks,
      payload.alignmentType
    );
    (payloadToUse.pairwiseAlignments || []).forEach((alignment) => {
      const error = alignment;
      if (error) {
        hasError = error;
      }
    });

    this.alignments = {
      ...this.alignments,
      [payload.id]: {
        ...payloadToUse,
        hasError
      }
    };
  }

  removeAlignment(payload) {
    const { id } = payload;
    this.alignments = omit(this.alignments, [id]);
  }

  //--- Helper Functions

  addHighlightedDifferences(alignmentTracks) {
    return alignmentTracks.map((track) => {
      if (track.isUnmapped) {
        return track;
      }
      const sequenceData = tidyUpSequenceData(track.sequenceData);
      const matchHighlightRanges =
        this.getRangeMatchesBetweenTemplateAndNonTemplate(
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
            return { ...range, ...this.highlightRangeProps };
          }),
        mismatches
      };
    });
  }

  //returns an array like so: [{start: 0, end: 4, isMatch: false}, {start,end,isMatch} ... etc]
  getRangeMatchesBetweenTemplateAndNonTemplate(tempSeq, nonTempSeq) {
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
}
