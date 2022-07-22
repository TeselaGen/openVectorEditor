import React from "react";
import { useDebouncedCallback } from "use-debounce";

import UncontrolledSliderWithPlusMinusBtns from "../helperComponents/UncontrolledSliderWithPlusMinusBtns";

export function RotateCircularViewSlider({
  setRotationRadians,
  editorName,
  zoomLevel,
  maxZoomLevel,
  bindOutsideChangeHelper
}) {
  const showLabelsDebounced = useDebouncedCallback(
    // function
    () => {
      const el = document.querySelector(
        `.veEditor.${editorName} .circularViewSvg`
      );
      if (el) el.classList.remove("veHideLabels");
      else {
        console.error(`whoops we shouldn't be here`);
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
          const el = document.querySelector(
            `.veEditor.${editorName} .circularViewSvg`
          );
          const innerEl = document.querySelector(
            `.veEditor.${editorName} .circularViewSvg g`
          );
          innerEl.style.transform = `rotate(${val}deg)`;

          setRotationRadians((val * Math.PI) / 180);
          if (zoomLevel <= 1) {
            el.classList.add("veHideLabels");
          }
          showLabelsDebounced();
        }}
        showTrackFill={false}
        leftIcon="arrow-left"
        rightIcon="arrow-right"
        title="Rotate"
        style={{ paddingTop: "4px", width: 120 }}
        className="veRotateCircSlider ove-slider"
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
