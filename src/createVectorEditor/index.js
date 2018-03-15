import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import { render } from "react-dom";

import Editor from "../Editor";
import updateEditor from "../updateEditor";
import addAlignment from "../addAlignment";

function StandaloneEditor(props) {
  return (
    <Provider store={store}>
      <Editor {...props} />
    </Provider>
  );
}

export default function createVectorEditor(
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
  editor.addAlignment = values => {
    addAlignment(store, editorName, values);
  };

  return editor;
}

window.createVectorEditor = createVectorEditor;
