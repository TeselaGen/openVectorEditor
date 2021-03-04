import React, { useState } from "react";
import shortid from "shortid";

const dialogHolder = {};
export function DialogsTwoPointO(props) {
  const [uniqKey, setUniqKey] = useState();
  dialogHolder.setUniqKey = setUniqKey;
  const Comp = dialogHolder.Dialog;
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

export function showDialog({ Component, props }) {
  dialogHolder.Dialog = Component;
  dialogHolder.props = props;
  dialogHolder.setUniqKey(shortid());
}
export function hideDialog() {
  delete dialogHolder.Dialog;
  delete dialogHolder.props;
  dialogHolder.setUniqKey(shortid());
}
