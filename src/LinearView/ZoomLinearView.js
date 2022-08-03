import React from "react";
import { SLIDER_NORM_WIDTH, SLIDER_SMALL_WIDTH } from "../constants/constants";
import UncontrolledSliderWithPlusMinusBtns from "../helperComponents/UncontrolledSliderWithPlusMinusBtns";
import { scrollToCaret } from "./index";

export function ZoomLinearView({
  setCharWidth,
  minCharWidth,
  bindOutsideChangeHelper,
  afterOnChange,
  smallSlider
}) {
  return (
    <div className="tg-zoom-bar" style={{ zIndex: 900, position: "absolute" }}>
      <UncontrolledSliderWithPlusMinusBtns
        noWraparound
        bindOutsideChangeHelper={bindOutsideChangeHelper}
        onClick={() => {
          setTimeout(scrollToCaret, 0);
        }}
        onChange={(zoomLvl) => {
          //zoomLvl is in the range of 0 to 10
          const scaleFactor = Math.pow(12 / minCharWidth, 1 / 10);
          const newCharWidth = minCharWidth * Math.pow(scaleFactor, zoomLvl);
          setCharWidth(newCharWidth);
          scrollToCaret();
          afterOnChange && afterOnChange();
        }}
        leftIcon="minus"
        rightIcon="plus"
        title="Zoom"
        smallSlider
        style={{
          paddingTop: "4px",
          width: smallSlider ? SLIDER_SMALL_WIDTH : SLIDER_NORM_WIDTH
        }}
        className="veZoomLinearSlider ove-slider"
        labelRenderer={false}
        stepSize={0.05}
        clickStepSize={0.5}
        initialValue={0}
        max={10}
        min={0}
      ></UncontrolledSliderWithPlusMinusBtns>
    </div>
  );
}
