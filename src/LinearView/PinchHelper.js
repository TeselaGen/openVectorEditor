import { usePinch } from "@use-gesture/react";
import React from "react";

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
