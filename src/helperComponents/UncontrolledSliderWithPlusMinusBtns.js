import React from "react";
import { Icon, Slider } from "@blueprintjs/core";

export default class UncontrolledSliderWithPlusMinusBtns extends React.Component {
  state = { value: 0 };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.oldInitialValue !== nextProps.initialValue) {
      return {
        value: nextProps.initialValue, //set the state value if a new initial value comes in!
        oldInitialValue: nextProps.initialValue
      };
    } else {
      return null;
    }
  }

  render() {
    const { value } = this.state;
    const { title, initialValue, style, ...rest } = this.props;

    return (
      <div title={title} style={{ ...style, display: "flex" }}>
        <Icon
          onClick={() => {
            const newVal = Math.max(
              this.state.value - (this.props.max - this.props.min) / 10,
              this.props.min
            );
            this.setState({
              value: newVal
            });
            this.props.onRelease(newVal);
          }}
          style={{ cursor: "pointer", marginRight: 5 }}
          icon="minus"
        />
        <Slider
          {...{ ...rest, value }}
          onChange={value => {
            this.setState({ value });
          }}
        />
        <Icon
          onClick={() => {
            const newVal = Math.min(
              this.state.value + (this.props.max - this.props.min) / 10,
              this.props.max
            );
            this.setState({
              value: newVal
            });
            this.props.onRelease(newVal);
          }}
          style={{ cursor: "pointer", marginLeft: 5 }}
          icon="plus"
        />
      </div>
    );
  }
}
