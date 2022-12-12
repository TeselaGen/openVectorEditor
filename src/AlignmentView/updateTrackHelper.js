import { insertItem, removeItem } from "../utils/arrayUtils";

export function updateTrackHelper({
  currentPairwiseAlignmentIndex,
  pairwiseAlignments,
  upsertAlignmentRun,
  hasBeenTrimmed,
  alignmentId,
  alignmentTracks,
  alignmentTrackIndex,
  update
}) {
  const updateATs = (atsToUse, alignmentTrackIndex) => {
    const removed = removeItem(atsToUse, alignmentTrackIndex);
    return insertItem(
      removed,
      {
        ...atsToUse[alignmentTrackIndex],
        alignmentData: {
          ...atsToUse[alignmentTrackIndex].alignmentData,
          ...update
        },
        sequenceData: {
          ...atsToUse[alignmentTrackIndex].sequenceData,
          ...update
        }
      },
      alignmentTrackIndex
    );
  };

  upsertAlignmentRun({
    id: alignmentId,
    hasBeenTrimmed,
    ...(pairwiseAlignments
      ? {
          pairwiseAlignments: pairwiseAlignments.map((ats, i) => {
            if (alignmentTrackIndex === 0) {
              return updateATs(ats, 0);
            }
            if (
              currentPairwiseAlignmentIndex !== undefined
                ? currentPairwiseAlignmentIndex === i
                : alignmentTrackIndex - 1 === i
            ) {
              return updateATs(ats, 1);
            }
            return ats;
          })
        }
      : {
          alignmentTracks: updateATs(
            alignmentTracks,
            Number(alignmentTrackIndex)
          )
        })
  });
}
