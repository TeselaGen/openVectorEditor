import React from "react";
import { compose } from "redux";
import { Tab2, Tabs2 } from "@blueprintjs/core";
import { withDialog } from "teselagen-react-components";
import withEditorProps from "../../withEditorProps";
import FeatureProperties from "./FeatureProperties";
import CutsiteProperties from "./CutsiteProperties";
import OrfProperties from "./OrfProperties";

export class PropertiesInner extends React.Component {
  render() {
    const { propertiesTool = {}, propertiesViewTabUpdate } = this.props;
    const { tabId } = propertiesTool;
    return (
      <div style={{ marginLeft: 5, marginRight: 5 }}>
        <Tabs2 selectedTabId={tabId} onChange={propertiesViewTabUpdate}>
          <Tabs2.Expander />
          <Tab2
            title="Features"
            id={"features"}
            panel={<FeatureProperties {...this.props} />}
          />
          <Tab2
            title="Cutsites"
            id={"cutsites"}
            panel={<CutsiteProperties {...this.props} />}
          />
          <Tab2
            title="Orfs"
            id={"orfs"}
            panel={<OrfProperties {...this.props} />}
          />
          <Tabs2.Expander />
        </Tabs2>
      </div>
    );
  }
}

export default compose(
  // withDialog(),
  withDialog({ title: "Properties" /* isOpen: true */ }),
  withEditorProps
)(PropertiesInner);
