import React from "react";
import { CircularView } from "./CircularView";
import { LinearView } from "./LinearView";

import { HoveredIdContext } from "./helperComponents/withHover";
import { visibilityDefaultValues } from "./redux/annotationVisibility";
import { addWrappedAddons } from "./utils/addWrappedAddons";
import { SimpleOligoPreview } from "./SimpleOligoPreview";
import { cloneDeep } from "lodash";

//this view is meant to be a helper for showing a simple (non-redux connected) circular or linear view!
export default (props) => {
  const {
    sequenceData: _sequenceData,
    annotationVisibility: _annotationVisibility = {}
  } = props;
  const Component = _sequenceData.circular
    ? CircularView
    : _sequenceData.isOligo && _sequenceData.sequence
    ? SimpleOligoPreview
    : LinearView;
  const tickSpacing = _sequenceData.circular
    ? undefined
    : Math.floor(
        (_sequenceData.noSequence
          ? _sequenceData.size
          : _sequenceData.sequence.length) / 5
      );
  let sequenceData = cloneDeep(_sequenceData);
  const annotationVisibility = {
    ...visibilityDefaultValues,
    ..._annotationVisibility
  };

  //here we're making it possible to not pass a sequenceData.sequence
  //we can just pass a .size property to save having to send the whole sequence if it isn't needed!
  if (sequenceData.noSequence) {
    annotationVisibility.sequence = false;
    annotationVisibility.reverseSequence = false;
    if (sequenceData.size === undefined) {
      return (
        <div>
          Error: No sequenceData.size detected when using noSequence flag{" "}
        </div>
      );
    }
    sequenceData = {
      ...sequenceData,
      sequence: {
        length: sequenceData.size
      }
    };
  }
  sequenceData.parts = addWrappedAddons(
    sequenceData.parts,
    sequenceData.sequence.length
  );

  return (
    <HoveredIdContext.Provider value={{ hoveredId: props.hoveredId }}>
      <Component
        {...{
          className: "tg-simple-dna-view",
          width: 300,
          height: 300,
          ...props,
          tickSpacing,
          hoveredId: props.hoveredId,
          annotationVisibility,
          sequenceData,
          showTitle: true
        }}
      />
    </HoveredIdContext.Provider>
  );
};
