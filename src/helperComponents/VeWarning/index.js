import React from "react";
import { Icon, Tooltip } from "@blueprintjs/core";
import "./style.css";

function VeWarning(props) {
  let { message, tooltip, ...rest } = props;
  return (
    <div className="veWarningMessage" {...rest}>
      <Tooltip
        position="bottom"
        intent="warning"
        popoverClassName="bp3-popover-content-sizing"
        content={tooltip}
      >
        <Icon intent="warning" icon="warning-sign" />
      </Tooltip>
      {message}
    </div>
  );
}

export default VeWarning;
