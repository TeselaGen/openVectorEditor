import React, { useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

import UncontrolledSliderWithPlusMinusBtns from "../helperComponents/UncontrolledSliderWithPlusMinusBtns";

export function RotateCircularView({
  setRotationRadians,
  editorName,
  zoomLevel,
  maxZoomLevel,
  bindOutsideChangeHelper
}) {
  const ref = useRef();
  const showLabelsDebounced = useDebouncedCallback(
    // function
    () => {
      const el = document.querySelector(
        `.veEditor.${editorName} .circularViewSvg`
      );

      el && el.classList.remove("veHideLabels");
    },
    // delay in ms
    100,
    { leading: true }
  );
  const debouncedSetRot = useDebouncedCallback(
    (val) => {
      setRotationRadians((val * Math.PI) / 180);
    },
    // delay in ms
    100,
    { leading: true }
  );
  const stepSize = Math.min(3, (3 / zoomLevel) * (maxZoomLevel / zoomLevel));
  return (
    <div
      style={{
        zIndex: 900,
        position: "absolute"
      }}
    >
      <UncontrolledSliderWithPlusMinusBtns
        bindOutsideChangeHelper={bindOutsideChangeHelper}
        onRelease={(_val) => {
          const val = 360 - _val;
          if (zoomLevel === 1) {
            debouncedSetRot(val);
          }
          clearTimeout(ref.current);
          showLabelsDebounced();
        }}
        onChange={(_val) => {
          const val = 360 - _val;
          const el = document.querySelector(
            `.veEditor.${editorName} .circularViewSvg`
          );
          const innerEl = document.querySelector(
            `.veEditor.${editorName} .circularViewSvg g`
          );
          innerEl.style.transform = `rotate(${val}deg)`;
          el.classList.add("veHideLabels");
          if (zoomLevel > 1) {
            setRotationRadians((val * Math.PI) / 180);
          }
        }}
        leftIcon="arrow-left"
        rightIcon="arrow-right"
        title="Rotate"
        style={{ paddingTop: "4px", width: 120 }}
        className="veRotateCircSlider ove-slider"
        labelRenderer={false}
        stepSize={stepSize}
        initialValue={0}
        max={360}
        min={0}
      ></UncontrolledSliderWithPlusMinusBtns>
    </div>
  );
}
