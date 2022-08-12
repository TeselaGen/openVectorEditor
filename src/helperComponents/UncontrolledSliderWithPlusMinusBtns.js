import React from "react";
import { Icon, Slider, Intent } from "@blueprintjs/core";
import { preventDefaultStopPropagation } from "../utils/editorUtils";
import { clamp, isNumber } from "lodash";
import "./UncontrolledSliderWithPlusMinusBtns.css";

export default class UncontrolledSliderWithPlusMinusBtns extends React.Component {
  state = { value: 0 };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.justUpdateInitialValOnce &&
      prevState.oldInitialValue !== undefined
    ) {
      return null;
    }
    //potentially coerce the initial value coming in
    if (prevState.oldInitialValue !== nextProps.initialValue) {
      const val = nextProps.coerceInitialValue
        ? nextProps.coerceInitialValue(nextProps)
        : nextProps.initialValue;
      return {
        value: val, //set the state value if a new initial value comes in!
        oldInitialValue: nextProps.initialValue
      };
    } else {
      return null;
    }
  }

  render() {
    const { value } = this.state;
    const {
      noWraparound,
      title,
      initialValue,
      label,
      passedRef,
      clickStepSize,
      style,
      onClick,
      smallSlider,
      bindOutsideChangeHelper,
      className,
      ...rest
    } = this.props;
    const { min, max } = this.props;

    const stepSize = this.props.stepSize || (max - min) / 10;
    if (bindOutsideChangeHelper) {
      bindOutsideChangeHelper.triggerChange = (fn) => {
        const valToPass =
          isNumber(value) && !isNaN(value) ? value : initialValue;
        return fn({
          value: valToPass,
          changeValue: (newVal) => {
            const newnew = clamp(newVal, min, max);
            this.setState({ value: newnew });
            this.props.onChange && this.props.onChange(newnew);
            this.props.onRelease && this.props.onRelease(newnew);
          }
        });
      };
    }
    return (
      <div
        className={`${className} ${smallSlider ? "small-slider" : ""}`}
        onClick={(e) => {
          onClick && onClick(e);
          preventDefaultStopPropagation(e);
        }}
        ref={passedRef}
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
            let newVal = value - (clickStepSize || stepSize);
            if (newVal < min) {
              if (noWraparound) {
                newVal = min;
              } else {
                newVal = max - (clickStepSize || stepSize);
              }
            }
            this.setState({
              value: newVal
            });
            this.props.onChange(newVal);
            this.props.onRelease && this.props.onRelease(newVal);
          }}
          style={{ cursor: "pointer", marginRight: 8 }}
          intent={Intent.PRIMARY}
          icon={this.props.leftIcon || "minus"}
        />
        <Slider
          {...{ ...rest, value }}
          onRelease={(newVal) =>
            this.props.onRelease && this.props.onRelease(newVal)
          }
          onChange={(value) => {
            this.setState({ value });
            this.props.onChange && this.props.onChange(value);
          }}
        />
        <Icon
          onClick={() => {
            let newVal = value + (clickStepSize || stepSize);
            if (newVal > max) {
              if (noWraparound) {
                newVal = max;
              } else {
                newVal = min + (clickStepSize || stepSize);
              }
            }
            this.setState({
              value: newVal
            });
            this.props.onChange(newVal);
            this.props.onRelease && this.props.onRelease(newVal);
          }}
          style={{ cursor: "pointer", marginLeft: 8 }}
          intent={Intent.PRIMARY}
          icon={this.props.rightIcon || "plus"}
        />
      </div>
    );
  }
}
