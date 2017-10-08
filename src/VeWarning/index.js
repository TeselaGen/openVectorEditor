import React from "react";
import "./style.css";
import WarningOutline from "react-icons/lib/ti/warning-outline";

function VeWarning(props) {
  let { message, ...rest } = props;
  return (
    <div className="veWarningMessage" {...rest}>
      <WarningOutline />
      {message}
    </div>
  );
}

export default VeWarning;
