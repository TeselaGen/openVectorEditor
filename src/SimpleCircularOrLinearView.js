import React from "react";
import { CircularView } from "./CircularView";
import { LinearView } from "./LinearView";
import { HoveredIdContext } from "./helperComponents/withHover";
import { visibilityDefaultValues } from "./redux/annotationVisibility";

//this view is meant to be a helper for showing a simple (non-redux connected) circular or linear view!
export default props => {
  const {
    sequenceData: _sequenceData,
    annotationVisibility: _annotationVisibility = {}
  } = props;
  const Component = _sequenceData.circular ? CircularView : LinearView;
  const tickSpacing = _sequenceData.circular
    ? undefined
    : Math.floor(
        (_sequenceData.noSequence
          ? _sequenceData.size
          : _sequenceData.sequence.length) / 5
      );
  let sequenceData = _sequenceData;
  let annotationVisibility = {
    ...visibilityDefaultValues,
    ..._annotationVisibility
  };

  //here we're making it possible to not pass a sequenceData.sequence
  //we can just pass a .size property to save having to send the whole sequence if it isn't needed!
  if (_sequenceData.noSequence) {
    annotationVisibility.sequence = false;
    annotationVisibility.reverseSequence = false;
    if (_sequenceData.size === undefined) {
      return (
        <div>
          Error: No sequenceData.size detected when using noSequence flag{" "}
        </div>
      );
    }
    sequenceData = {
      ..._sequenceData,
      sequence: {
        length: _sequenceData.size
      }
    };
  }

  return (
    <HoveredIdContext.Provider value={{ hoveredId: props.hoveredId }}>
      <Component
        {...{
          width: 300,
          height: 300,
          ...props,
          tickSpacing,
          annotationVisibility,
          sequenceData
        }}
      />
    </HoveredIdContext.Provider>
  );
};
