import { getReverseComplementSequenceAndAnnotations } from "@teselagen/sequence-utils";

export default function addDashesForMatchStartAndEndForTracks(alignmentTracks) {
  return alignmentTracks.map((track, i) => {
    // .filter by the user-specified mismatch overrides (initially [])
    return {
      ...track,
      ...addDashesForMatchStartAndEnd(
        track,
        alignmentTracks[0], //send in the ref/template seq every time
        i === 0
      )
    };
  });
}

function addDashesForMatchStartAndEnd(
  { alignmentData, sequenceData: _sequenceData },
  template,
  isTemplate
) {
  let sequenceData = _sequenceData;
  const {
    sequenceData: sequenceDataTemplate,
    alignmentData: alignmentDataTemplate
  } = template;
  let { matchStart = 0, matchEnd = 0, strand } = alignmentData;
  if (strand === -1) {
    sequenceData = getReverseComplementSequenceAndAnnotations(sequenceData);
    const oldMatchEnd = matchEnd;
    const oldMatchStart = matchStart;
    matchStart = sequenceData.sequence.length - oldMatchStart;
    matchEnd = sequenceData.sequence.length - oldMatchEnd;
  }
  const { matchStart: matchStartTemplate = 0, matchEnd: matchEndTemplate = 0 } =
    alignmentDataTemplate;
  let newAlignmentData;
  if (isTemplate) {
    newAlignmentData = {
      ...alignmentData,
      sequence:
        sequenceDataTemplate.sequence.slice(0, matchStartTemplate) +
        alignmentData.sequence +
        sequenceDataTemplate.sequence.slice(matchEndTemplate + 1)
    };
  } else {
    newAlignmentData = {
      ...alignmentData,
      sequence:
        sequenceData.sequence.slice(0, matchStart) +
        alignmentData.sequence +
        sequenceData.sequence.slice(matchEnd + 1)
    };
    newAlignmentData = {
      ...alignmentData,
      sequence:
        "-".repeat(Math.max(matchStartTemplate - matchStart, 0)) +
        newAlignmentData.sequence +
        "-".repeat(
          Math.max(
            sequenceDataTemplate.sequence.slice(matchEndTemplate + 1).length -
              (sequenceData.sequence.length - matchEnd) +
              1,
            0
          )
        )
    };
  }

  return { alignmentData: newAlignmentData, sequenceData: sequenceData };
}
