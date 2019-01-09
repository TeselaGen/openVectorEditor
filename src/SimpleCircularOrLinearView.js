import React from "react";
import { CircularView } from "./CircularView";
import { LinearView } from "./LinearView";
import { HoveredIdContext } from "./helperComponents/withHover";

//this view is meant to be a helper for showing a simple (non-redux connected) circular or linear view!
export default props => {
  const { sequenceData } = props;
  const Component = sequenceData.circular ? CircularView : LinearView;
  return (
    <HoveredIdContext.Provider value={{ hoveredId: props.hoveredId }}>
      <Component
        {...{
          width: 300,
          height: 300,
          ...props
        }}
      />
    </HoveredIdContext.Provider>
  );
};
