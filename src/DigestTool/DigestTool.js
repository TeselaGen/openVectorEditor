// import uniqid from "shortid";
// import Ladder from "./Ladder";
import { compose, withProps } from "recompose";
import React from "react";
import { DataTable } from "teselagen-react-components";
import { getCutsiteType, getVirtualDigest } from "ve-sequence-utils";
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
import { userDefinedHandlersAndOpts } from "../Editor/userDefinedHandlersAndOpts";
import { pick } from "lodash";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { MAX_DIGEST_CUTSITES, MAX_PARTIAL_DIGEST_CUTSITES } from "../constants/constants";

export class DigestTool extends React.Component {
  state = { selectedTab: "virtualDigest" };
  render() {
    const {
      ed,
      // height = 100,
      dimensions = {},
    } = this.props;
    const{
      virtualDigest,
      digestTool: { selectedFragment, computePartialDigest },
      onDigestSave,
      computePartialDigestDisabled,
      computeDigestDisabled,
      updateComputePartialDigest
    } = ed.digestTool
    const {lanes} = virtualDigest()

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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                    fewer cut sites){" "}
                  </span>
                ) : null}
              </span>
            }
            disabled={computePartialDigestDisabled}
          ></Checkbox>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://docs.teselagen.com/en/articles/5489322-restriction-digest-in-the-vector-editor"
          >
            Read the docs
          </a>
        </div>
        Choose your enzymes:
        <CutsiteFilter
          ed={ed}
        />
        <br />
        {computeDigestDisabled && (
          <div
            style={{
              color: "red",
              marginBottom: "6px",
              fontSize: "15px"
            }}
          >
            {`>${MAX_DIGEST_CUTSITES} cut sites detected. Filter out additional
            restriction enzymes to visualize digest results`}
          </div>
        )}
        <Tabs
          selectedTabId={selectedTab}
          onChange={(id) => {
            this.setState({ selectedTab: id });
          }}
        >
          <Tab
            title="Virtual Digest"
            id="virtualDigest"
            panel={<Ladder {...this.props} ed={ed} />}
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

export default observer(DigestTool);
