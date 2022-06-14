import { usePinch } from "@use-gesture/react";
import React from "react";

export default function PinchHelper({
  children,
  onPinch: _onPinch,
  enabled = true
}) {
  const target = React.useRef();
  // useGesture(
  //   {
  //     onPinch: (arg) => {
  //       // arg.event.preventDefault();
  //       // arg.event.stopPropagation();
  //       if (_onPinch) _onPinch(arg);
  //     }
  //   },
  //   {
  //     target,
  //     // eventOptions: {
  //     //   passive: false
  //     // }
  //   }
  // );

  usePinch(
    (arg) => {
      if (enabled) {
        // console.log(`arg:`,arg)
        // arg.preventDefault()
        // arg.event.preventDefault();
        if (_onPinch) _onPinch(arg);
      }
    },
    {
      target
      // preventDefault: true,
      // // triggerAllEvents:
      // // preventDefault: true,
      // eventOptions: {
      //   passive: false
      // }
    }
  );
  return (
    <div
      ref={target}
      // {...bind()}
      // onWheel={(e) => {
      //   e.preventDefault();
      //   e.stopPropagation();

      // }}
      // onTouchMove={(e) => {
      //   e.preventDefault();
      //   e.stopPropagation();

      // }}
      // gestu

      // style={{ touchAction: "none" }}
      className="tg-pinch-helper"
    >
      {children}
    </div>
  );
}
