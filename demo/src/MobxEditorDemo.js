// import { Switch, Button } from "@blueprintjs/core";
// import { generateSequenceData } from "ve-sequence-utils";
import React from "react";
import _ from "lodash";

// import store from "./store";
// import { updateEditor } from "../../src/";

// import Editor from "../../src/Editor/MobxEditor";
import Store from "../../src/mobx";
import CircularView from "../../src/CircularView";
import { observer } from "mobx-react";

const store = Store.create({
  restrictionEnzymes: [],
  sequenceData: {
    sequence: "atgagtagag",
    _features: { id1: {
      start: 1,
      end: 3
    }},
    features: [{
      id: "asdga",
      start: 1,
      end: 5
    }]
  },
  selectionLayer: {
    start: 2, end: 2
  },
}
);
debugger

// const store = new Store({
//   sequenceData: {
//     sequence: "atgag"
//   }
// });

// import { upsertPart } from "../../src/redux/sequenceData";
// import { MenuItem } from "@blueprintjs/core";

// Use the line below because using the full 30 sequences murders Redux dev tools.
@observer
export default class StandaloneDemo extends React.Component {
  render() {
    console.log('store.sequenceData.features:',store.sequenceData.features)
    return (
      <div>
        <button
          onClick={() => {
            store.updateSelectionLayer({
              start: 1,
              end: 4
            });
            store.updateSequenceData({ sequence: "ttttaaaa" });
          }}
        >
          {" "}
          click me
        </button>
        store.sequenceData.features.id1: {store.sequenceData.features && store.sequenceData.features.id1 && store.sequenceData.features.id1}  <br></br>
        store.selectionLayer.start: {store.selectionLayer.start} <br></br>
        store.selectionLayer.end: {store.selectionLayer.end} <br></br>
        store.sequenceData.sequence: {store.sequenceData.sequence} <br></br>
        <CircularView {...store} />
      </div>
    );
  }
}
