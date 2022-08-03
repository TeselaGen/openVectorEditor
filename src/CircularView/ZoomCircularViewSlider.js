import React from "react";
import { SLIDER_NORM_WIDTH, SLIDER_SMALL_WIDTH } from "../constants/constants";
import UncontrolledSliderWithPlusMinusBtns from "../helperComponents/UncontrolledSliderWithPlusMinusBtns";
export function ZoomCircularViewSlider({
  zoomHelper,
  zoomLevel,
  setZoomLevel,
  maxZoomLevel,
  onZoom,
  smallSlider
}) {
  let clickStepSize = (maxZoomLevel - 1) / 440;
  clickStepSize = clickStepSize * Math.max(1, Math.log(zoomLevel + 2));
  clickStepSize = Math.round(clickStepSize * 1000) / 1000;
  const stepSize = clickStepSize;
  const min = 1;
  function setZoom(val) {
    const newZoomLev = val;
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
        left: smallSlider ? 100 : 150,
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
          width: smallSlider ? SLIDER_SMALL_WIDTH : SLIDER_NORM_WIDTH
        }}
        smallSlider
        noWraparound
        className="veZoomCircularSlider ove-slider"
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
