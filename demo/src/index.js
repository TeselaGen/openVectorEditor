import React from "react";
import { Provider } from "react-redux";
import { HashRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { Switch } from "@blueprintjs/core";

import store from "./store";
import { render } from "react-dom";

import {
  CircularView,
  RowView,
  // RowItem,
  ToolBar,
  // CutsiteFilter,
  LinearView,
  DigestTool,
  updateEditor
} from "../../src";

// import AddOrEditFeatureDialog from "../../src/helperComponents/AddOrEditFeatureDialog";
import exampleSequenceData from "./exampleData/exampleSequenceData";
import StandaloneDemo from "./StandaloneDemo";
import StandaloneAlignmentDemo from "./StandaloneAlignmentDemo";
import AlignmentDemo from "./AlignmentDemo";
import VersionHistoryView from "../../src/VersionHistoryView";
import pjson from "../../package.json";
import EditorDemo from "./EditorDemo";

// import GenbankView from "../../src/helperComponents/PropertiesDialog/GenbankView";

// import _CutsiteProperties from "../../src/helperComponents/PropertiesDialog/CutsiteProperties";
// import withEditorProps from "../../src/withEditorProps";
// import _OrfProperties from "../../src/helperComponents/PropertiesDialog/OrfProperties";
import "./style.css";

const links = [
  { name: "Editor", url: "Editor" },
  { name: "Standalone", url: "Standalone" },
  { name: "VersionHistoryView", url: "VersionHistoryView" },
  { name: "StandaloneAlignment", url: "StandaloneAlignment" },
  { name: "Alignment", url: "Alignment" },
  { name: "CircularView", url: "CircularView" },
  { name: "DigestTool", url: "DigestTool" },
  { name: "RowView", url: "RowView" },
  { name: "LinearView", url: "LinearView" },
  { name: "ToolBar", url: "ToolBar" }
].map(({ url, name }) => {
  return (
    <Link key={name} style={{ marginLeft: 10 }} to={url}>
      {" "}
      {name}{" "}
    </Link>
  );
});

updateEditor(store, "DemoEditor", {
  readOnly: false,
  sequenceData: exampleSequenceData
});

class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      darkMode: document.body.className.includes("bp3-dark")
    };
  }

  changeDarkMode = () => {
    this.setState({
      darkMode: !this.state.darkMode
    });
    document.body.classList.toggle("bp3-dark");
  };

  render() {
    const { darkMode } = this.state;

    return (
      <Provider store={store}>
        <Router>
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            {/* <GenbankView editorName={"DemoEditor"} /> */}
            {/* <OrfProperties editorName={"DemoEditor"} /> */}
            {/* <CutsiteProperties editorName={"DemoEditor"}></CutsiteProperties> */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap"
              }}
            >
              {links}{" "}
              <span style={{ marginLeft: 10 }}>Version: {pjson.version}</span>{" "}
              <Switch
                label="Dark Mode"
                checked={darkMode}
                onChange={this.changeDarkMode}
                style={{ margin: "0px 30px", marginTop: 4 }}
              />
            </div>
            <Route exact path="/" render={() => <Redirect to="/Editor" />} />
            <Route
              render={() => {
                return <EditorDemo />;
              }}
              path="/Editor"
            />
            <Route
              render={() => {
                return (
                  <div>
                    <VersionHistoryView
                      onSave={() => {
                        window.alert("onSave triggered!");
                        // console.info("onSave triggered:", args);
                      }}
                      exitVersionHistoryView={() => {
                        window.alert("exit requested!");
                      }}
                      getSequenceAtVersion={versionId => {
                        if (versionId === 2) {
                          return {
                            sequence: "thomaswashere"
                          };
                        } else if ((versionId = 3)) {
                          return {
                            features: [{ start: 4, end: 6 }],
                            sequence:
                              "GGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacacccccc"
                          };
                        } else {
                          console.error("we shouldn't be here...");
                          return {
                            sequence: "taa"
                          };
                        }
                      }}
                      getVersionList={() => {
                        return [
                          {
                            dateChanged: "12/30/2211",
                            editedBy: "Nara",
                            // revisionType: "Sequence Deletion",
                            versionId: 2
                          },
                          {
                            dateChanged: "8/30/2211",
                            editedBy: "Ralph",
                            // revisionType: "Feature Edit",
                            versionId: 3
                          }
                        ];
                      }}
                    />
                  </div>
                );
              }}
              path="/VersionHistoryView"
            />
            <Route
              render={() => {
                return <StandaloneDemo />;
              }}
              path="/Standalone"
            />
            <Route
              render={() => {
                return <StandaloneAlignmentDemo />;
              }}
              path="/StandaloneAlignment"
            />
            <Route
              render={() => {
                return <AlignmentDemo />;
              }}
              path="/Alignment"
            />
            <Route
              render={() => {
                return <CircularView editorName="DemoEditor" />;
              }}
              path="/CircularView"
            />
            <Route
              render={() => {
                return <DigestTool editorName="DemoEditor" />;
              }}
              path="/DigestTool"
            />
            <Route
              render={() => {
                return <RowView editorName="DemoEditor" />;
              }}
              path="/RowView"
            />
            <Route
              render={() => {
                return <LinearView editorName="DemoEditor" />;
              }}
              path="/LinearView"
            />
            <Route
              render={() => {
                return <ToolBar editorName="DemoEditor" />;
              }}
              path="/ToolBar"
            />
          </div>
        </Router>
      </Provider>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
