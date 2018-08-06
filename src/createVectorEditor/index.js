import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import { render } from "react-dom";

import Editor from "../Editor";
import updateEditor from "../updateEditor";
import addAlignment from "../addAlignment";
import AlignmentView from "../AlignmentView";
import sizeMe from "react-sizeme";
import VersionHistoryView from "../VersionHistoryView";

function StandaloneEditor(props) {
  return (
    <Provider store={store}>
      <Editor {...props} />
    </Provider>
  );
}

function StandaloneAlignment(props) {
  return (
    <Provider store={store}>
      <AlignmentView
        {...{ ...props, dimensions: { width: props.size.width } }}
      />
    </Provider>
  );
}

function StandaloneVersionHistoryView(props) {
  return (
    <Provider store={store}>
      <VersionHistoryView
        {...{ ...props }}
      />
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
    addAlignment(store, values);
  };
  editor.getState = () => {
    return store.getState().VectorEditor["StandaloneEditor"]
  }

  return editor;
}

export function createVersionHistoryView(
  node,
  { editorName = "StandaloneVersionHistoryView", ...rest } = {}
) {
  const editor = {};
  editor.renderResponse = render(
    <StandaloneVersionHistoryView {...{ editorName, ...rest }} />,
    node
  );
  editor.updateEditor = values => {
    updateEditor(store, editorName, values);
  };
  editor.getState = () => {
    return store.getState().VectorEditor["StandaloneVersionHistoryView"]
  }

  return editor;
}

const SizedStandaloneAlignment = sizeMe()(StandaloneAlignment);
export function createAlignmentView(node, props = {}) {
  const editor = {};
  editor.renderResponse = render(<SizedStandaloneAlignment {...props} />, node);

  editor.updateAlignment = values => {
    addAlignment(store, values);
  };
  editor.updateAlignment(props);
  editor.getState = () => {
    if (!props.id) {
      throw new Error('Please pass an id when using createAlignmentView. eg createAlignmentView(myDiv, {id: "someUniqueId"})')
    }
    return store.getState().VectorEditor.alignments[props.id]
  }
  return editor;
}

window.createVectorEditor = createVectorEditor;
window.createAlignmentView = createAlignmentView;
window.createVersionHistoryView = createVersionHistoryView;
