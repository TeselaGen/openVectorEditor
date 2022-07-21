import React, { useRef } from "react";
import UncontrolledSliderWithPlusMinusBtns from "../helperComponents/UncontrolledSliderWithPlusMinusBtns";
export function ZoomCircularViewSlider({
  zoomLevel,
  setZoomLevel,
  maxZoomLevel,
  onZoom
}) {
  const zoomHelper = useRef({});
  let clickStepSize = (maxZoomLevel - 1) / 440;
  clickStepSize = clickStepSize * Math.max(1, Math.log(zoomLevel + 2));
  clickStepSize = Math.round(clickStepSize * 1000) / 1000;
  const stepSize = clickStepSize;
  const min = 1;
  function setZoom(val) {
    const newZoomLev = Math.round(val * 10000) / 10000;
    setZoomLevel(newZoomLev);
    onZoom(newZoomLev);
  }
  if (zoomLevel > maxZoomLevel) {
    setTimeout(() => {
      if (zoomHelper.current && zoomHelper.current.triggerChange) {
        zoomHelper.current.triggerChange(({ changeValue }) => {
          changeValue(maxZoomLevel);
        });
      }
    }, 0);
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
        bindOutsideChangeHelper={zoomHelper.current}
        onChange={setZoom}
        onRelease={setZoom}
        title="Adjust Zoom Level"
        style={{
          paddingTop: "4px",
          width: 120
        }}
        noWraparound
        className="veZoomCircSlider ove-slider"
        labelRenderer={false}
        stepSize={stepSize}
        clickStepSize={clickStepSize}
        initialValue={zoomLevel || 1}
        justUpdateInitialValOnce
        max={maxZoomLevel || 14}
        min={min}
      />
    </div>
  );
}
