import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import { render } from "react-dom";

import Editor from "../Editor";
import updateEditor from "../updateEditor";

function StandaloneEditor(props) {
  return (
    <Provider store={store}>
      <Editor {...props} />
    </Provider>
  );
}

export default function tg_createEditor(
  node,
  { editorName = "StandaloneEditor", ...rest } = {}
) {
  const editor = {};
  editor.renderResponse = render(
    <StandaloneEditor {...{ editorName, ...rest }} />,
    node
  );
  editor.updateEditor = values => {
    updateEditor(store, editorName, values);
  };
  return editor;
}

window.tg_createEditor = tg_createEditor;
