import React from "react";
import { Icon, Slider, Intent } from "@blueprintjs/core";
import { preventDefaultStopPropagation } from "../utils/editorUtils";

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
    const { title, initialValue, label, style, ...rest } = this.props;

    const stepSize =
      this.props.stepSize || (this.props.max - this.props.min) / 10;

    return (
      <div
        onClick={preventDefaultStopPropagation}
        onDrag={preventDefaultStopPropagation}
        onDragStart={preventDefaultStopPropagation}
        onDragEnd={preventDefaultStopPropagation}
        onMouseDown={preventDefaultStopPropagation}
        // onMouseUp={preventDefaultStopPropagation} //tnr: commenting this out because it was breaking sliders onRelease
        title={title}
        style={{ ...style, display: "flex", marginLeft: 15, marginRight: 20 }}
      >
        <Icon
          onClick={() => {
            let newVal = this.state.value - stepSize;
            if (newVal < this.props.min) {
              newVal = this.props.max - stepSize;
            }
            this.setState({
              value: newVal
            });
            this.props.onChange(newVal);
            this.props.onRelease(newVal);
          }}
          style={{ cursor: "pointer", marginRight: 10 }}
          intent={Intent.PRIMARY}
          icon={this.props.leftIcon || "minus"}
        />
        <Slider
          {...{ ...rest, value }}
          onChange={(value) => {
            this.setState({ value });
            this.props.onChange && this.props.onChange(value);
          }}
        />
        <Icon
          onClick={() => {
            let newVal = this.state.value + stepSize;
            if (newVal > this.props.max) {
              newVal = this.props.min + stepSize;
            }
            this.setState({
              value: newVal
            });
            this.props.onChange(newVal);
            this.props.onRelease(newVal);
          }}
          style={{ cursor: "pointer", marginLeft: 10 }}
          intent={Intent.PRIMARY}
          icon={this.props.rightIcon || "plus"}
        />
      </div>
    );
  }
}
