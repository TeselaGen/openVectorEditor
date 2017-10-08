import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import { render } from "react-dom";

export default class DemoPage extends React.Component {
  render () {
    const {url, children} = this.props
    if (url && window.location.href.indexOf(url) < 0) return null
    return (
      {children}
    )
  }
}  