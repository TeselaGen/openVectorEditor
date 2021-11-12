import React, { useState } from "react";
import { Switch, Button, HTMLSelect, Dialog } from "@blueprintjs/core";
import {
  getStringFromReactComponent,
  doesSearchValMatchText
} from "teselagen-react-components";
import { lifecycle, mapProps } from "recompose";
import { omit } from "lodash";
import ReactMarkdown from "react-markdown";

const omitProps = (keys) => mapProps((props) => omit(props, keys));
const _Switch = omitProps(["didMount"])(Switch);
const EnhancedSwitch = lifecycle({
  componentDidMount() {
    return this.props.didMount();
  }
})(_Switch);
const _Select = omitProps(["didMount"])(HTMLSelect);
const EnhancedSelect = lifecycle({
  componentDidMount() {
    return this.props.didMount();
  }
})(_Select);

export default function renderToggle({
  isButton,
  isSelect,
  options,
  that,
  type,
  label,
  onClick,
  info,
  alwaysShow,
  description,
  hook,
  disabled = false,
  ...rest
}) {
  let toggleOrButton;
  const labelOrText = label ? <span>{label}</span> : type;
  const sharedProps = {
    style: { marginBottom: 0 },
    "data-test": type || label,
    label: labelOrText,
    text: labelOrText,
    ...rest
  };
  if (that.state.searchInput && !alwaysShow) {
    if (
      !doesSearchValMatchText(
        that.state.searchInput,
        getStringFromReactComponent(labelOrText)
      )
    ) {
      return null;
    }
  }
  if (isButton) {
    toggleOrButton = (
      <Button
        {...{
          ...sharedProps,
          onClick: onClick || hook
        }}
      />
    );
  } else if (isSelect) {
    const { style, label, ...rest } = sharedProps;
    toggleOrButton = (
      <div key={type + "iwuhwp"} style={sharedProps.style}>
        {label && <span>{label} &nbsp;</span>}
        <EnhancedSelect
          {...{
            options,
            ...rest,
            didMount: () => {
              hook && hook((that.state || {})[type], true);
            },
            value: (that.state || {})[type],
            disabled: disabled,
            onChange: (newType) => {
              hook && hook(newType.target.value);
              that.setState({
                [type]: newType.target.value
              });
            }
          }}
        />
      </div>
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
    <div
      key={type + "toggle-button-holder"}
      style={{ display: "flex", alignItems: "center", margin: "5px 5px" }}
      className="toggle-button-holder"
    >
      <ShowInfo {...{ description, info, type }}></ShowInfo>
      {toggleOrButton}
    </div>
  );
}

function ShowInfo({ description, info, type }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <React.Fragment>
      <Dialog
        onClose={() => {
          setOpen(false);
        }}
        isOpen={isOpen}
      >
        <div
          key={type + "dialog"}
          style={{ maxWidth: 600, overflow: "auto" }}
          className="bp3-dialog-body"
        >
          <ReactMarkdown source={description || info} />
        </div>
      </Dialog>

      {(description || info) && (
        <div key={type + "info"}>
          <Button
            onClick={() => {
              setOpen(true);
            }}
            minimal
            icon="info-sign"
          ></Button>
        </div>
      )}
    </React.Fragment>
  );
}
