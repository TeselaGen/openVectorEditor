import React from "react";

import EditorStore from "./mobxStore/store";
import SimpleCircularOrLinearView from "./SimpleCircularOrLinearView";

const ed = new EditorStore({
  name: 'example seq',
  circular: false,
  features: [
    { name: "hey1", start: 10, end: 20 },
  ],
  sequence: 'gtagagatgttctctatcatcaasdfaag',
  selectionLayer: { start: 1, end: 1 }
});

export default function MobXEditor() {
  return <SimpleCircularOrLinearView ed={ed}></SimpleCircularOrLinearView>;
}
