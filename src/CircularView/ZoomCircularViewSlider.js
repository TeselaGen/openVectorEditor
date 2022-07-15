import React from "react";
import UncontrolledSliderWithPlusMinusBtns from "../helperComponents/UncontrolledSliderWithPlusMinusBtns";
export function ZoomCircularViewSlider({
  zoomLevel,
  setZoomLevel,
  maxZoomLevel,
  onZoom
}) {
  let clickStepSize = (maxZoomLevel - 1) / 140;
  if (zoomLevel < 3) {
    clickStepSize = clickStepSize / 4;
  } else if (zoomLevel < 5) {
    clickStepSize = clickStepSize / 4;
  }
  clickStepSize = Math.round(clickStepSize * 1000) / 1000;
  const stepSize = clickStepSize;
  const min = 1;
  // const min = 1 - clickStepSize * 3;
  function setZoom(val) {
    const newZoomLev = Math.round(val * 10000) / 10000;
    setZoomLevel(newZoomLev);
    onZoom(newZoomLev);
  }
  return (
    <div
      style={{
        position: "absolute",
        left: 150,
        top: 0,
        zIndex: 900
      }}
    >
      <UncontrolledSliderWithPlusMinusBtns
        onChange={setZoom}
        onRelease={setZoom}
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
        min={min}
      />
    </div>
  );
}
