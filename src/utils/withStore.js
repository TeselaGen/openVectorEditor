import { useStore } from "react-redux";
import React from "react";

const withStore = (Component) => {
  return (props) => {
    const store = useStore();
    return <Component {...props} store={store} />;
  };
};
export default withStore;
