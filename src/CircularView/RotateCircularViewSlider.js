import React, { useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

import UncontrolledSliderWithPlusMinusBtns from "../helperComponents/UncontrolledSliderWithPlusMinusBtns";

export function RotateCircularViewSlider({
  setRotationRadians,
  editorName,
  zoomLevel,
  maxZoomLevel,
  initialRotation,
  bindOutsideChangeHelper
}) {
  const ref = useRef();
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
        onRelease={(_val) => {
          const val = 360 - _val;
          if (zoomLevel === 1) {
            debouncedSetRot(val);
          }
          !window.Cypress && clearTimeout(ref.current);
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

          if (zoomLevel > 1) {
            setRotationRadians((val * Math.PI) / 180);
          } else {
            el.classList.add("veHideLabels");
          }
          showLabelsDebounced();
        }}
        leftIcon="arrow-left"
        rightIcon="arrow-right"
        title="Rotate"
        style={{ paddingTop: "4px", width: 120 }}
        className="veRotateCircSlider ove-slider"
        labelRenderer={false}
        stepSize={stepSize}
        justUpdateInitialValOnce
        initialValue={initialRotation || 0}
        max={360}
        min={0}
      ></UncontrolledSliderWithPlusMinusBtns>
    </div>
  );
}
