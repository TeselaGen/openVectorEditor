import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import tidyUpSequenceData from "ve-sequence-utils/tidyUpSequenceData";
import exampleSequenceData from "./exampleSequenceData";
import { render } from "react-dom";
import {
  CircularView,
  RowView,
  // RowItem,
  VeToolBar,
  // CutsiteFilter,
  // createVectorEditor,
  LinearView,
  DigestTool,
} from "../../../src";
// const sequence = tidyUpSequenceData(exampleSequenceData, {
//   annotationsAsObjects: true
// });

// const { withEditorInteractions, withEditorProps } = createVectorEditor({
//   editorName: "DemoEditor"
// });

function Demo() {
  return (
    <Provider store={store}>
      
        <CircularView editorName="DemoEditor" /> 
        <DigestTool editorName="DemoEditor" /> 
        <RowView editorName="DemoEditor" /> 
        <LinearView editorName="DemoEditor" /> 
        <VeToolBar editorName="DemoEditor" /> 
    </Provider>
  );
}

render(<Demo />, document.querySelector("#demo"));
