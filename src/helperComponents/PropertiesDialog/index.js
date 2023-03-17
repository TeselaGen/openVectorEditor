import React from "react";
import { Tab, Tabs } from "@blueprintjs/core";
import { flatMap, startCase } from "lodash";
import FeatureProperties from "./FeatureProperties";
import GeneralProperties from "./GeneralProperties";
import CutsiteProperties from "./CutsiteProperties";
import OrfProperties from "./OrfProperties";
import GenbankView from "./GenbankView";
import TranslationProperties from "./TranslationProperties";
import PrimerProperties from "./PrimerProperties";
import PartProperties from "./PartProperties";
import "./style.css";
import { userDefinedHandlersAndOpts } from "../../Editor/userDefinedHandlersAndOpts";
import { pick } from "lodash";
import { observer } from "mobx-react";

const PropertiesContainer = (Comp) => (props) => {
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
      ed,
      
      closePanelButton
    } = { ...this.props, ...this.props.PropertiesProps };
    const {
      propertiesList,
      isProtein,
      annotationsToSupport = {},
    } = ed
    const { width, height: heightFromDim } = dimensions;

    let { tabId, selectedAnnotationId } = propertiesTool;
    if (
      propertiesList
        .map((nameOrOverride) => nameOrOverride.name || nameOrOverride)
        .indexOf(tabId) === -1
    ) {
      tabId = propertiesList[0].name || propertiesList[0];
    }
    const propertiesTabs = flatMap(propertiesList, (nameOrOverride) => {
      if (annotationsToSupport[nameOrOverride] === false) {
        return [];
      }

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
      const title = (() => {
        if (nameOrOverride.Comp) return name; //just use the user supplied name because this is a custom panel
        if (name === "orfs") return "ORFs";
        if (name === "cutsites") return "Cut Sites";
        return startCase(name);
      })();
      return (
        <Tab
          key={name}
          title={title}
          id={name}
          panel={
            <Comp
              {...{
                ...pick(this.props, userDefinedHandlersAndOpts),
                ed,
                selectedAnnotationId,
                ...(nameOrOverride.name && nameOrOverride)
              }}
            />
          }
        />
      );
    });
    const heightToUse = Math.max(0, Number((heightFromDim || height) - 30));
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
            height: heightToUse || 300,
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

export default observer(PropertiesDialog);
