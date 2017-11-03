import React from "react";
import { compose } from "redux";
import { Tab2, Tabs2 } from "@blueprintjs/core";
import { withDialog } from "teselagen-react-components";
import { startCase } from "lodash";
import withEditorProps from "../../withEditorProps";
import FeatureProperties from "./FeatureProperties";
import CutsiteProperties from "./CutsiteProperties";
import OrfProperties from "./OrfProperties";
import GenbankView from "./GenbankView";
import TranslationProperties from "./TranslationProperties";
import PrimerProperties from "./PrimerProperties";
import PartProperties from "./PartProperties";

import "./style.css";
const allTabs = {
  features: FeatureProperties,
  parts: PartProperties,
  primers: PrimerProperties,
  translations: TranslationProperties,
  cutsites: CutsiteProperties,
  orfs: OrfProperties,
  genbank: GenbankView
};
export class PropertiesInner extends React.Component {
  render() {
    const {
      propertiesTool = {},
      propertiesViewTabUpdate,
      width,
      height,
      propertiesList
    } = this.props;

    const { tabId } = propertiesTool;
    const propertiesTabs = propertiesList.map(name => {
      const Comp = allTabs[name];
      return (
        <Tab2
          key={name}
          title={startCase(name)}
          id={name}
          panel={<Comp {...this.props} />}
        />
      );
    });
    return (
      <div
        className={"ve-propertiesPanel"}
        style={{
          display: "flex",
          width,
          height,
          marginLeft: 5,
          marginRight: 5
        }}
      >
        {propertiesTabs.length ? (
          <Tabs2
            renderActiveTabPanelOnly
            selectedTabId={tabId}
            onChange={propertiesViewTabUpdate}
          >
            <Tabs2.Expander />
            {propertiesTabs}
            <Tabs2.Expander />
          </Tabs2>
        ) : (
          <div style={{ margin: 20, fontSize: 20 }}>
            No Properties to display
          </div>
        )}
      </div>
    );
  }
}

export default compose(
  // withDialog(),
  withDialog({ title: "Properties" /* isOpen: true */ }),
  withEditorProps
)(PropertiesInner);
