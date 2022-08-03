import React from "react";
import { useDebouncedCallback } from "use-debounce";
import { SLIDER_NORM_WIDTH, SLIDER_SMALL_WIDTH } from "../constants/constants";

import UncontrolledSliderWithPlusMinusBtns from "../helperComponents/UncontrolledSliderWithPlusMinusBtns";

export function RotateCircularViewSlider({
  setRotationRadians,
  zoomLevel,
  maxZoomLevel,
  bindOutsideChangeHelper,
  smallSlider
}) {
  const target = React.useRef();
  const showLabelsDebounced = useDebouncedCallback(
    () => {
      try {
        const el = target.current
          .closest(`.veCircularView`)
          .querySelector(`.circularViewSvg`);
        if (el) el.classList.remove("veHideLabels");
        else {
          console.error(`whoops we shouldn't be here`);
        }
      } catch (e) {
        console.error(`error 92hf290fasd:`, e);
      }
    },
    // delay in ms
    300,
    { leading: true }
  );

  const stepSize = Math.min(
    3,
    (3 / (zoomLevel / 2)) * (maxZoomLevel / (zoomLevel / 2))
  );
  return (
    <div
      style={{
        zIndex: 900,
        position: "absolute"
      }}
    >
      <UncontrolledSliderWithPlusMinusBtns
        bindOutsideChangeHelper={bindOutsideChangeHelper}
        onChange={(_val) => {
          const val = 360 - _val;
          const el = target.current
            .closest(`.veCircularView`)
            .querySelector(`.circularViewSvg`);
          const innerEl = target.current
            .closest(`.veCircularView`)
            .querySelector(`.circularViewSvg g`);
          innerEl.style.transform = `rotate(${val}deg)`;
          setRotationRadians((val * Math.PI) / 180);
          if (zoomLevel <= 1) {
            el.classList.add("veHideLabels");
          }
          showLabelsDebounced();
        }}
        smallSlider
        passedRef={target}
        showTrackFill={false}
        leftIcon="arrow-left"
        rightIcon="arrow-right"
        title="Rotate"
        style={{
          paddingTop: "4px",
          width: smallSlider ? SLIDER_SMALL_WIDTH : SLIDER_NORM_WIDTH
        }}
        className="veRotateCircularSlider ove-slider"
        labelRenderer={false}
        stepSize={stepSize}
        justUpdateInitialValOnce
        // initialValue={initialRotation || 0}
        max={360}
        min={0}
      ></UncontrolledSliderWithPlusMinusBtns>
    </div>
  );
}
