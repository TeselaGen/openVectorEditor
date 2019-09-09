import React from "react";
import { Provider } from "react-redux";
import { HashRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { Switch } from "@blueprintjs/core";

import store from "./store";
import { render } from "react-dom";

import {
  CircularView,
  RowView,
  LinearView,
  DigestTool,
  updateEditor,
  EnzymeViewer
} from "../../src";

// import AddOrEditFeatureDialog from "../../src/helperComponents/AddOrEditFeatureDialog";
import exampleSequenceData from "./exampleData/exampleSequenceData";
import StandaloneDemo from "./StandaloneDemo";
import SimpleCircularOrLinearViewDemo from "./SimpleCircularOrLinearViewDemo";
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
  { name: "SimpleCircularOrLinearView", url: "SimpleCircularOrLinearView" },
  { name: "DigestTool", url: "DigestTool" },
  { name: "EnzymeViewer", url: "EnzymeViewer" },
  { name: "CircularView", url: "CircularView" },
  { name: "RowView", url: "RowView" },
  { name: "LinearView", url: "LinearView" },
  { name: "ToolBar", url: "ToolBar" }
].map(({ url, name }) => {
  return (
    <div key={name} style={{ height: 20, marginLeft: 10 }}>
      <Link to={url}> {name} </Link>
    </div>
  );
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
            style={{
              height: "100%",
              display: "flex",
              flexGrow: 1,
              flexDirection: "column"
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                flexShrink: 0
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
              render={({ history }) => {
                return <EditorDemo history={history} />;
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
                        // in a real version we'd go to server and get a real sequence based on the version id
                        // const seq = await api.getSeqAtVersion()
                        // return seq
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
                        //fake talking to some api
                        return new Promise(resolve => {
                          setTimeout(() => {
                            resolve([
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
                            ]);
                          }, 100);
                        });
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
              render={({ history }) => {
                return <AlignmentDemo history={history} />;
              }}
              path="/Alignment"
            />
            <Route
              render={() => {
                return (
                  <WrapSimpleDemo>
                    <CircularView editorName="DemoEditor" />
                  </WrapSimpleDemo>
                );
              }}
              path="/CircularView"
            />
            <Route
              render={({ history }) => (
                <SimpleCircularOrLinearViewDemo history={history} />
              )}
              path="/SimpleCircularOrLinearView"
            />
            <Route
              render={() => {
                return (
                  <WrapSimpleDemo>
                    <DigestTool editorName="DemoEditor" />
                  </WrapSimpleDemo>
                );
              }}
              path="/DigestTool"
            />
            <Route
              render={() => {
                const enzyme = {
                  name: "BsaI",
                  site: "ggtctc",
                  forwardRegex: "g{2}tctc",
                  reverseRegex: "gagac{2}",
                  topSnipOffset: 7,
                  bottomSnipOffset: 11
                };
                return (
                  <WrapSimpleDemo>
                    <EnzymeViewer
                      {...{
                        sequence: enzyme.site,
                        reverseSnipPosition: enzyme.bottomSnipOffset,
                        forwardSnipPosition: enzyme.topSnipOffset
                      }}
                    />
                  </WrapSimpleDemo>
                );
              }}
              path="/EnzymeViewer"
            />
            <Route
              render={() => {
                return (
                  <WrapSimpleDemo>
                    <RowView editorName="DemoEditor" />
                  </WrapSimpleDemo>
                );
              }}
              path="/RowView"
            />
            <Route
              render={() => {
                return (
                  <WrapSimpleDemo>
                    <LinearView editorName="DemoEditor" />
                  </WrapSimpleDemo>
                );
              }}
              path="/LinearView"
            />
          </div>
        </Router>
      </Provider>
    );
  }
}

class WrapSimpleDemo extends React.Component {
  constructor(props) {
    super(props);
    updateEditor(store, "DemoEditor", {
      readOnly: false,
      sequenceData: exampleSequenceData
    });
  }
  render() {
    return this.props.children;
  }
}

render(<Demo />, document.querySelector("#demo"));
