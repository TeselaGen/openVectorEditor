import React from "react";
import { compose } from "redux";
import { Tab, Tabs } from "@blueprintjs/core";
import { startCase } from "lodash";
import FeatureProperties from "./FeatureProperties";
import GeneralProperties from "./GeneralProperties";
import CutsiteProperties from "./CutsiteProperties";
import OrfProperties from "./OrfProperties";
import GenbankView from "./GenbankView";
import TranslationProperties from "./TranslationProperties";
import PrimerProperties from "./PrimerProperties";
import PartProperties from "./PartProperties";
import { connectToEditor } from "../../withEditorProps";
import "./style.css";

const PropertiesContainer = Comp => props => {
  const { additionalFooterEls, additionalHeaderEls, ...rest } = props;
  return (
    <React.Fragment>
      {additionalHeaderEls}
      <Comp {...rest} />
      {additionalFooterEls}
    </React.Fragment>
  );
};
const allTabs = {
  general: PropertiesContainer(GeneralProperties),
  features: PropertiesContainer(FeatureProperties),
  parts: PropertiesContainer(PartProperties),
  primers: PropertiesContainer(PrimerProperties),
  translations: PropertiesContainer(TranslationProperties),
  cutsites: PropertiesContainer(CutsiteProperties),
  orfs: PropertiesContainer(OrfProperties),
  genbank: PropertiesContainer(GenbankView)
};
export class PropertiesDialog extends React.Component {
  render() {
    const {
      propertiesTool = {},
      propertiesViewTabUpdate,
      dimensions = {},
      height,
      editorName,
      onSave,
      showReadOnly,
      showAvailability,
      isProtein,
      disableSetReadOnly,
      propertiesList = [
        "general",
        "features",
        "parts",
        "primers",
        "translations",
        "cutsites",
        "orfs",
        "genbank"
      ],
      closePanelButton
    } = { ...this.props, ...this.props.PropertiesProps };

    const { width, height: heightFromDim } = dimensions;

    let { tabId, selectedAnnotationId } = propertiesTool;
    if (
      propertiesList
        .map(nameOrOverride => nameOrOverride.name || nameOrOverride)
        .indexOf(tabId) === -1
    ) {
      tabId = propertiesList[0].name || propertiesList[0];
    }
    const propertiesTabs = propertiesList.map(nameOrOverride => {
      const name = nameOrOverride.name || nameOrOverride;
      const Comp = nameOrOverride.Comp || allTabs[name];
      if (isProtein) {
        if (
          name === "translations" ||
          name === "orfs" ||
          name === "primers" ||
          name === "cutsites"
        ) {
          return null;
        }
      }
      return (
        <Tab
          key={name}
          title={
            nameOrOverride.Comp
              ? name //just use the user supplied name because this is a custom panel
              : name === "orfs"
              ? "ORFs"
              : startCase(name)
          }
          id={name}
          panel={
            <Comp
              {...{
                editorName,
                onSave,
                isProtein,
                showReadOnly,
                showAvailability,
                disableSetReadOnly,
                selectedAnnotationId,
                ...(nameOrOverride.name && nameOrOverride)
              }}
            />
          }
        />
      );
    });

    return (
      <div
        style={{
          position: "relative"
        }}
      >
        {closePanelButton}
        <div
          className="ve-propertiesPanel"
          style={{
            display: "flex",
            width,
            height: Math.max(0, Number((heightFromDim || height) - 30)),
            zIndex: 10,
            padding: 10
            // paddingBottom: '31px',
          }}
        >
          {propertiesTabs.length ? (
            <Tabs
              style={{ width }}
              renderActiveTabPanelOnly
              selectedTabId={tabId}
              onChange={propertiesViewTabUpdate}
            >
              <Tabs.Expander />
              {propertiesTabs}
              <Tabs.Expander />
            </Tabs>
          ) : (
            <div style={{ margin: 20, fontSize: 20 }}>
              No Properties to display
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default compose(
  connectToEditor(({ propertiesTool }) => {
    return { propertiesTool };
  })
)(PropertiesDialog);
