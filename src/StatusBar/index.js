import React from "react";
import { Button, Classes, HTMLSelect } from "@blueprintjs/core";

import "./style.css";
import { divideBy3 } from "../utils/proteinUtils";
import { getSelectionMessage } from "../utils/editorUtils";
import useMeltingTemp from "../utils/useMeltingTemp";
import MeltingTemp from "./MeltingTemp";
import { getSequenceWithinRange } from "ve-range-utils";
import { observer } from "mobx-react";

const EditReadOnlyItem = observer(({ ed }) => {
  return ed.showReadOnly ? (
    <StatusBarItem dataTest="veStatusBar-readOnly">
      {ed.onSave ? (
        <HTMLSelect
          options={[
            { label: "Read Only", value: "readOnly" },
            { label: "Editable", value: "editable" }
          ]}
          disabled={ed.disableSetReadOnly || !ed.onSave} //the !onSave here is redundant
          className={Classes.MINIMAL}
          value={ed.readOnly ? "readOnly" : "editable"}
          onChange={({ target: { value } }) => {
            ed.updateReadOnlyMode(value === "readOnly");
          }}
        />
      ) : ed.readOnly ? (
        "Read Only"
      ) : (
        "Editable"
      )}
    </StatusBarItem>
  ) : null;
});

const ShowSelectionItem = observer(({ ed }) => {
  const [showMeltingTemp] = useMeltingTemp();

  const sequence = getSequenceWithinRange(ed.selectionLayer, ed.sequence);

  return (
    <React.Fragment>
      <StatusBarItem dataTest="veStatusBar-selection">
        {getSelectionMessage({ ed })}

        <Button
          minimal
          disabled={ed.sequenceLength <= 0}
          onClick={ed.handleInverse}
          style={{ marginLeft: 5, color: "#48AFF0" }}
          small
        >
          Select Inverse
        </Button>
      </StatusBarItem>
      {showMeltingTemp && (
        <MeltingTemp
          WrapperToUse={StatusBarItem}
          sequence={sequence}
        ></MeltingTemp>
      )}
    </React.Fragment>
  );
});

const ShowLengthItem = observer(({ ed }) => (
  <StatusBarItem dataTest="veStatusBar-length">{`Length: ${divideBy3(
    ed.sequenceLength,
    ed.isProtein
  )} ${ed.isProtein ? "AAs" : "bps"}`}</StatusBarItem>
));

const ShowTypeItem = observer(({ ed }) => {
  let type = "DNA";
  if (ed.isProtein) type = "Protein";
  if (ed.isRna) type = "RNA";
  if (ed.isOligo) type = "Oligo";
  if (ed.isMixedRnaAndDna) type = "Mixed RNA/DNA";
  return <StatusBarItem dataTest="veStatusBar-type">{type}</StatusBarItem>;
});

const EditCircularityItem = observer(({ ed }) => {
  return ed.showCircularity ? (
    <StatusBarItem dataTest="veStatusBar-circularity">
      {ed.readOnly ? (
        ed.circular ? (
          "Circular"
        ) : (
          "Linear"
        )
      ) : (
        <HTMLSelect
          onChange={({ target: { value } }) => {
            ed.updateCircular(value === "circular");
          }}
          className={Classes.MINIMAL}
          value={ed.circular ? "circular" : "linear"}
          options={[
            { label: "Circular", value: "circular" },
            { label: "Linear", value: "linear" }
          ]}
        />
      )}
    </StatusBarItem>
  ) : null;
});
const EditAvailabilityItem = observer(({ ed }) => {
  return ed.showAvailability ? (
    <StatusBarItem>
      {ed.readOnly ? (
        ed.materiallyAvailable ? (
          "Available"
        ) : (
          "Unavailable"
        )
      ) : (
        <HTMLSelect
          onChange={({ target: { value } }) => {
            ed.updateAvailability(value === "available");
          }}
          className={Classes.MINIMAL}
          value={ed.materiallyAvailable ? "available" : "unavailable"}
          options={[
            { label: "Available", value: "available" },
            { label: "Unavailable", value: "unavailable" }
          ]}
        />
      )}
    </StatusBarItem>
  ) : null;
});

export const StatusBar = observer(({ ed }) => {
  return (
    <div className="veStatusBar">
      {ed.showMoleculeType && <ShowTypeItem ed={ed}></ShowTypeItem>}
      <EditReadOnlyItem ed={ed} />
      <EditCircularityItem ed={ed} />
      <EditAvailabilityItem ed={ed} />
      <ShowSelectionItem ed={ed} />
      <ShowLengthItem ed={ed} />
    </div>
  );
});

const StatusBarItem = observer(function ({ children, dataTest }) {
  return (
    <React.Fragment>
      <div data-test={dataTest} className="veStatusBarItem">
        {children}
      </div>
      <div className="veStatusBarSpacer" />
    </React.Fragment>
  );
});

export default StatusBar;
