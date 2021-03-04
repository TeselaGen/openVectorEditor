import React, { useState } from "react";
import shortid from "shortid";

const dialogHolder = {};
export function GlobalDialog(props) {
  const [uniqKey, setUniqKey] = useState();
  dialogHolder.setUniqKey = setUniqKey;
  const Comp =
    props.dialogOverrides[dialogHolder.overrideName] || dialogHolder.Dialog;
  if (!Comp) return null;
  return (
    <Comp
      key={uniqKey}
      hideDialog={hideDialog}
      hideModal={hideDialog}
      {...props}
      {...dialogHolder.props}
    ></Comp>
  );
}

//if an overrideName is passed, then that dialog can be overridden if an overriding dialog is passed as a prop to the <Editor/>
export function showDialog({ Component, props, overrideName }) {
  dialogHolder.Dialog = Component;
  dialogHolder.props = props;
  dialogHolder.overrideName = overrideName;
  dialogHolder.setUniqKey(shortid());
}
export function hideDialog() {
  delete dialogHolder.Dialog;
  delete dialogHolder.props;
  delete dialogHolder.overrideName;
  dialogHolder.setUniqKey(shortid());
}
