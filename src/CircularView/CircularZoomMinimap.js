import React from "react";

export function CircularZoomMinimap({ percentOfCircle, rotationRadians }) {
  const percent = Math.max(2, Math.min(45, percentOfCircle * 100 * 0.9));
  return (
    <div
      className="circularViewMinimap"
      style={{
        transform: `scale(-1,1) rotate(${
          (rotationRadians * 180) / Math.PI - percent * 1.8
        }deg)`,
        "--p": percent
      }}
    ></div>
  );
}
