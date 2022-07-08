import React from "react";
import UncontrolledSliderWithPlusMinusBtns from "../helperComponents/UncontrolledSliderWithPlusMinusBtns";
export function ZoomCircularViewSlider({ setZoomLevel, maxZoomLevel }) {
  const clickStepSize = (maxZoomLevel - 1) / 140;
  const stepSize = clickStepSize;
  // const stepSize = clickStepSize / 10;
  return (
    <div
      style={{
        position: "absolute",
        left: 150,
        top: 0,
        zIndex: 900
        // marginTop: zoomLevel !== 1 ? 200 : 0
      }}
    >
      <UncontrolledSliderWithPlusMinusBtns
        onChange={(val) => {
          setZoomLevel(val);
        }}
        onRelease={(val) => {
          setZoomLevel(val);
        }}
        title="Adjust Zoom Level"
        style={{
          paddingTop: "4px",
          width: 120
        }}
        noWraparound
        className="ove-slider"
        labelRenderer={false}
        stepSize={stepSize}
        clickStepSize={clickStepSize}
        initialValue={1}
        max={maxZoomLevel || 14}
        min={0.7}
      />
    </div>
  );
}
