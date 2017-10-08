import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import tidyUpSequenceData from "ve-sequence-utils/tidyUpSequenceData";
import exampleSequenceData from "./exampleSequenceData";
import { render } from "react-dom";
import Collapsible from "react-collapsible";

import {
  CircularView,
  RowView,
  // RowItem,
  VeToolBar,
  // CutsiteFilter,
  createVectorEditor,
  LinearView
} from "../../src";
const data = tidyUpSequenceData(exampleSequenceData, {
  annotationsAsObjects: true
});

const { withEditorInteractions, withEditorProps } = createVectorEditor({
  namespace: "DemoEditor"
});

const CircularViewConnected = withEditorInteractions(CircularView);
const RowViewConnected = withEditorInteractions(RowView);
const LinearViewConnected = withEditorInteractions(LinearView);
// const RowItemConnected = withEditorProps(RowItem);
const VeToolBarConnected = withEditorProps(VeToolBar);
// const CutsiteFilterConnected = withEditorProps(CutsiteFilter);

function Demo() {
  return (
    <Provider store={store}>
      <div>
        <Collapsible open trigger="ve-editor demo">
          <h1>ve-editor Demo</h1>
          <h2>Redux Connected (aka interactive!) </h2>
          <VeToolBarConnected />
          <h3>Circular view:</h3>
          <CircularViewConnected />
          <br />
          <h3>Linear view:</h3>
          <LinearViewConnected />
          <br />
          <h3>Row view:</h3>
          <RowViewConnected />
        </Collapsible>
        <Collapsible trigger="non-interactive demo">
          <h2>Not Redux Connected (aka non interactive) </h2>
          <CircularView sequenceData={data} />
          <br />
          <RowView sequenceData={data} />
          <br />
          <LinearView sequenceData={data} />
          <br />
        </Collapsible>
      </div>
    </Provider>
  );
}

render(<Demo />, document.querySelector("#demo"));
