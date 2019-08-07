// import uniqid from "uniqid";
import withEditorProps from "../withEditorProps";
// import Ladder from "./Ladder";
import { compose, withProps } from "recompose";
import { normalizePositionByRangeLength, getRangeLength } from "ve-range-utils";
// import selectionLayer from "../redux/selectionLayer";
import React from "react";
import { DataTable } from "teselagen-react-components";
import { getCutsiteType } from "ve-sequence-utils";
import CutsiteFilter from "../CutsiteFilter";
import Ladder from "./Ladder";
// import getCutsiteType from "./getCutsiteType";
import { Tabs, Tab, Button, InputGroup, Intent } from "@blueprintjs/core";

export class DigestTool extends React.Component {
  state = { selectedTab: "virtualDigest" };
  render() {
    const {
      editorName,
      // height = 100,
      dimensions = {},
      lanes,
      digestTool: { selectedFragment },
      onDigestSave
    } = this.props;
    const { selectedTab } = this.state;
    // console.log(`height, dimensions.height:`,height, dimensions.height)
    return (
      <div
        style={{
          height:
            typeof dimensions.height === "string" ? 100 : dimensions.height,
          overflowY: "auto",
          padding: 10
        }}
      >
        {onDigestSave && (
          <div style={{ display: "flex", marginBottom: 10 }}>
            <InputGroup placeholder="My Digest" />
            <Button
              intent={Intent.PRIMARY}
              onClick={() => {
                onDigestSave({});
              }}
              style={{ marginLeft: 5 }}
            >
              {" "}
              Save
            </Button>
          </div>
        )}
        Choose your enzymes:
        <CutsiteFilter editorName={editorName} />
        <br />
        <Tabs
          selectedTabId={selectedTab}
          onChange={id => {
            this.setState({ selectedTab: id });
          }}
        >
          <Tab
            title="Virtual Digest"
            id="virtualDigest"
            panel={<Ladder {...this.props} editorName={editorName} />}
          />
          <Tab
            title="Digest Info"
            id="table"
            panel={
              <DataTable
                noRouter
                isSimple
                maxHeight={400}
                // noFooter
                withSearch={false}
                onSingleRowSelect={({ onFragmentSelect }) => {
                  onFragmentSelect();
                }}
                reduxFormSelectedEntityIdMap={{
                  input: {
                    value: {
                      [selectedFragment]: true
                    },
                    onChange: () => {}
                  }
                }}
                formName="digestInfoTable"
                entities={lanes[0].map(
                  ({ id, cut1, cut2, start, end, size, ...rest }) => {
                    return {
                      ...rest,
                      id,
                      start,
                      end,
                      length: size,
                      leftCutter: cut1.restrictionEnzyme.name,
                      rightCutter: cut2.restrictionEnzyme.name,
                      leftOverhang: getCutsiteType(cut1.restrictionEnzyme),
                      rightOverhang: getCutsiteType(cut2.restrictionEnzyme)
                    };
                  }
                )}
                schema={schema}
              />
            }
          />
        </Tabs>
        <br />
      </div>
    );
  }
}
const schema = {
  fields: [
    { width: 60, path: "start", displayName: "Start", type: "string" },
    { width: 60, path: "end", displayName: "End", type: "string" },
    { width: 70, path: "length", displayName: "Length", type: "string" },
    { path: "leftCutter", displayName: "Left Cutter", type: "string" },
    { path: "leftOverhang", displayName: "Left Overhang", type: "string" },
    { path: "rightCutter", displayName: "Right Cutter", type: "string" },
    { path: "rightOverhang", displayName: "Right Overhang", type: "string" }
  ]
};

export default compose(
  withEditorProps,
  withProps(props => {
    const {
      sequenceData,
      sequenceLength,
      selectionLayerUpdate,
      updateSelectedFragment
    } = props;
    const fragments = [];
    const overlappingEnzymes = [];
    const pairs = [];
    const sortedCutsites = sequenceData.cutsites.sort((a, b) => {
      return a.topSnipPosition - b.topSnipPosition;
    });

    sortedCutsites.forEach((cutsite1, index) => {
      pairs.push([
        cutsite1,
        sortedCutsites[index + 1]
          ? sortedCutsites[index + 1]
          : sortedCutsites[0]
      ]);
    });

    pairs.forEach(([cut1, cut2]) => {
      const start = normalizePositionByRangeLength(
        cut1.topSnipPosition,
        sequenceLength
      );
      const end = normalizePositionByRangeLength(
        cut2.topSnipPosition - 1,
        sequenceLength
      );
      const size = getRangeLength({ start, end }, sequenceLength);

      // const id = uniqid()
      const id = start + "-" + end + "-" + size + "-";
      getRangeLength({ start, end }, sequenceLength);
      fragments.push({
        cut1,
        cut2,
        start,
        end,
        size,
        id,
        onFragmentSelect: () => {
          selectionLayerUpdate({
            start,
            end
          });
          updateSelectedFragment(id);
        }
      });
    });

    fragments.filter(fragment => {
      if (!fragment.size) {
        overlappingEnzymes.push(fragment);
        return false;
      }
      return true;
    });
    return {
      lanes: [fragments],
      overlappingEnzymes
    };
  })
)(DigestTool);
