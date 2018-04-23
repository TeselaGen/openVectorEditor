import React from "react";
import { Icon } from "@blueprintjs/core";
import "./style.css";

function VeWarning(props) {
  let { message, ...rest } = props;
  return (
    <div className="veWarningMessage" {...rest}>
      <Icon icon="warning-sign" />
      {message}
    </div>
  );
}

export default VeWarning;
