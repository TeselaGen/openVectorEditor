import React from "react";
import { Switch } from "@blueprintjs/core";
import { InfoHelper } from "teselagen-react-components";
import { lifecycle } from "recompose";

const EnhancedSwitch = lifecycle({
  componentDidMount() {
    return this.props.didMount();
  }
})(Switch);

export default function renderToggle({ that, type, label, description, hook }) {
  const toggleEl = (
    <EnhancedSwitch
      data-test={type}
      checked={(that.state || {})[type]}
      label={label ? <span>{label}</span> : type}
      style={{ margin: "0px 30px", marginTop: 4 }}
      didMount={() => {
        hook && hook(!!(that.state || {})[type]);
      }}
      onChange={() => {
        hook && hook(!(that.state || {})[type]);
        that.setState({
          [type]: !(that.state || {})[type]
        });
      }}
    />
  );
  return (
    <div style={{ display: "flex" }} className={"toggle-button-holder"}>
      {description && (
        <InfoHelper
          popoverProps={{
            preventOverflow: { enabled: false },
            hide: {
              enabled: false
            },
            flip: {
              boundariesElement: "viewport"
            }
          }}
          style={{ marginRight: -15, marginTop: 5, marginLeft: 5 }}
        >
          {description}
        </InfoHelper>
      )}
      {toggleEl}
    </div>
  );
}
