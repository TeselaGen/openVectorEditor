import React from "react";
import { observer } from "mobx-react";

import { SLIDER_NORM_WIDTH, SLIDER_SMALL_WIDTH } from "../constants/constants";
import UncontrolledSliderWithPlusMinusBtns from "../helperComponents/UncontrolledSliderWithPlusMinusBtns";
export const ZoomCircularViewSlider = observer(function ZoomCircularViewSlider({
  ed
}) {
  let clickStepSize = (ed.maxZoomLevelCV - 1) / 440;
  clickStepSize = clickStepSize * Math.max(1, Math.log(ed.zoomLevelCV + 2));
  clickStepSize = Math.round(clickStepSize * 1000) / 1000;
  const stepSize = clickStepSize;
  const min = 1;
  function setZoom(val) {
    const newZoomLev = val;
    ed.setCircZoomLevel(newZoomLev);
    ed.onZoom(newZoomLev);
  }

  return (
    <div
      style={{
        position: "absolute",
        left: ed.smallSlider ? 100 : 150,
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
          width: ed.smallSlider ? SLIDER_SMALL_WIDTH : SLIDER_NORM_WIDTH
        }}
        smallSlider
        noWraparound
        className="veZoomCircularSlider ove-slider"
        labelRenderer={false}
        stepSize={stepSize}
        clickStepSize={clickStepSize}
        initialValue={ed.zoomLevelCV || 1}
        justUpdateInitialValOnce
        max={ed.maxZoomLevelCV || 14}
        min={min}
      />
    </div>
  );
});
