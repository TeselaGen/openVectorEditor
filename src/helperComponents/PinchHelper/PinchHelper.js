import { usePinch } from "@use-gesture/react";
import React from "react";
/**
 * wrapper for the react usePinch gesture
 * @param {*} children child components to be enveloped
 * @param {*} onPinch the action to be performed when pinch gesture is registered
 */
export default function PinchHelper({ children, onPinch }) {
  const target = React.useRef();

  usePinch(
    (arg) => {
      if (onPinch) onPinch(arg);
    },
    {
      target
    }
  );
  return (
    <div ref={target} className="tg-pinch-helper">
      {children}
    </div>
  );
}
