import React from "react";
import { Switch, Button } from "@blueprintjs/core";
import { InfoHelper } from "teselagen-react-components";
import { lifecycle, mapProps } from "recompose";
import { omit } from "lodash";
import ReactMarkdown from "react-markdown";

const omitProps = keys => mapProps(props => omit(props, keys));
const _Switch = omitProps(["didMount"])(Switch);
const EnhancedSwitch = lifecycle({
  componentDidMount() {
    return this.props.didMount();
  }
})(_Switch);

export default function renderToggle({
  isButton,
  that,
  type,
  label,
  onClick,
  info,
  description,
  hook,
  disabled = false,
  ...rest
}) {
  let toggleOrButton;
  const labelOrText = label ? <span>{label}</span> : type;
  const sharedProps = {
    "data-test": type || label,
    style: { margin: "0px 30px", marginTop: 4 },
    label: labelOrText,
    text: labelOrText,
    ...rest
  };
  if (isButton) {
    toggleOrButton = (
      <Button
        {...{
          ...sharedProps,
          onClick: onClick || hook
        }}
      />
    );
  } else {
    toggleOrButton = (
      <EnhancedSwitch
        {...{
          ...sharedProps,
          didMount: () => {
            hook && hook(!!(that.state || {})[type]);
          },
          checked: (that.state || {})[type],
          disabled: disabled,
          onChange: () => {
            hook && hook(!(that.state || {})[type]);
            that.setState({
              [type]: !(that.state || {})[type]
            });
          }
        }}
      />
    );
  }
  return (
    <div style={{ display: "flex" }} className="toggle-button-holder">
      {(description || info) && (
        <InfoHelper
          isPopover
          popoverProps={{
            modifiers: {
              preventOverflow: { enabled: false },
              hide: {
                enabled: false
              },
              flip: {
                boundariesElement: "viewport"
              }
            }
          }}
          style={{ marginRight: -15, marginTop: 5, marginLeft: 5 }}
        >
          <ReactMarkdown source={description || info} />
        </InfoHelper>
      )}
      {toggleOrButton}
    </div>
  );
}
