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
import {
  Tabs,
  Tab,
  Button,
  InputGroup,
  Intent,
  Checkbox
} from "@blueprintjs/core";

const MAX_DIGEST_CUTSITES = 50;
const MAX_PARTIAL_DIGEST_CUTSITES = 10;
export class DigestTool extends React.Component {
  state = { selectedTab: "virtualDigest" };
  render() {
    const {
      editorName,
      // height = 100,
      dimensions = {},
      lanes,
      digestTool: { selectedFragment, computePartialDigest },
      onDigestSave,
      computePartialDigestDisabled,
      computeDigestDisabled,
      updateComputePartialDigest
    } = this.props;
    const { selectedTab } = this.state;
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
        <Checkbox
          onChange={() => {
            updateComputePartialDigest(!computePartialDigest);
          }}
          checked={computePartialDigest}
          label={
            <span>
              Show Partial Digests{" "}
              {computePartialDigestDisabled ? (
                <span style={{ fontSize: 10 }}>
                  {" "}
                  -- Disabled (only supports {MAX_PARTIAL_DIGEST_CUTSITES} or
                  fewer cutsites){" "}
                </span>
              ) : null}
            </span>
          }
          disabled={computePartialDigestDisabled}
        ></Checkbox>
        Choose your enzymes:
        <CutsiteFilter editorName={editorName} />
        <br />
        {computeDigestDisabled && (
          <div
            style={{
              color: "red",
              marginBottom: "6px",
              fontSize: "15px"
            }}
          >
            >{MAX_DIGEST_CUTSITES} cutsites detected. Filter out additional
            restriction enzymes to visualize digest results
          </div>
        )}
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
      updateSelectedFragment,
      digestTool: { computePartialDigest }
    } = props;
    const fragments = [];
    const overlappingEnzymes = [];
    const pairs = [];
    const computePartialDigestDisabled =
      sequenceData.cutsites.length > MAX_PARTIAL_DIGEST_CUTSITES;
    const computeDigestDisabled =
      sequenceData.cutsites.length > MAX_DIGEST_CUTSITES;
    const sortedCutsites = sequenceData.cutsites.sort((a, b) => {
      return a.topSnipPosition - b.topSnipPosition;
    });

    sortedCutsites.forEach((cutsite1, index) => {
      if (computePartialDigest && !computePartialDigestDisabled) {
        sortedCutsites.forEach((cs, index2) => {
          if (index2 === index + 1 || index2 === 0) {
            return;
          }
          pairs.push([cutsite1, sortedCutsites[index2]]);
        });
      }
      if (!computeDigestDisabled) {
        pairs.push([
          cutsite1,
          sortedCutsites[index + 1]
            ? sortedCutsites[index + 1]
            : sortedCutsites[0]
        ]);
      }
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
      computePartialDigestDisabled,
      computeDigestDisabled,
      lanes: [fragments],
      overlappingEnzymes
    };
  })
)(DigestTool);
