import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import { render } from "react-dom";

import Editor from '../Editor';

function StandaloneEditor() {
  return (
    <Provider store={store}>
      <Editor editorName="StandaloneEditor" />
    </Provider>
  );
}

export default function tg_createEditor(node) {
  render(<StandaloneEditor />, node);
}


window.tg_createEditor = tg_createEditor




