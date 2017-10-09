import React from "react";
import "./style.css";

export default function Radio(props) {
  let { className, children, onChange, checked, label } = props;
  return (
    <label className={"__custom_radio_button " + className}>
      <input onChange={onChange} checked={checked} type="radio" />
      <i /> {children} {label}
    </label>
  );
}
