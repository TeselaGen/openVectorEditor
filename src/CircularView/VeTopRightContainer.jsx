import React from "react";

export function VeTopRightContainer({ fullScreen, children }) {
  return (
    <div
      style={fullScreen ? { right: 65, top: 10 } : {}}
      className="veTopRightContainer"
    >
      {children}
    </div>
  );
}
