import { insertItem, removeItem } from "../utils/arrayUtils";

export function updateTrackHelper({
  upsertAlignmentRun,
  alignmentId,
  alignmentTracks,
  alignmentTrackIndex,
  update
}) {
  const removed = removeItem(alignmentTracks, alignmentTrackIndex);
  const newAlignmentTracks = insertItem(
    removed,
    {
      ...alignmentTracks[alignmentTrackIndex],
      alignmentData: {
        ...alignmentTracks[alignmentTrackIndex].alignmentData,
        ...update
      },
      sequenceData: {
        ...alignmentTracks[alignmentTrackIndex].sequenceData,
        ...update
      }
    },
    alignmentTrackIndex
  );
  upsertAlignmentRun({
    id: alignmentId,
    alignmentTracks: newAlignmentTracks
  });
}
