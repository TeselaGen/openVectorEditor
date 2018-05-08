import React from "react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
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
  Editor,
  updateEditor
} from "../../src";

// import AddOrEditFeatureDialog from "../../src/helperComponents/AddOrEditFeatureDialog";
import exampleSequenceData from "./exampleData/exampleSequenceData";
import StandaloneDemo from "./StandaloneDemo";
import StandaloneAlignmentDemo from "./StandaloneAlignmentDemo";
import AlignmentDemo from "./AlignmentDemo";

// import GenbankView from "../../src/helperComponents/PropertiesDialog/GenbankView";

// import _CutsiteProperties from "../../src/helperComponents/PropertiesDialog/CutsiteProperties";
// import withEditorProps from "../../src/withEditorProps";
// import _OrfProperties from "../../src/helperComponents/PropertiesDialog/OrfProperties";

const links = [
  { name: "Editor", url: "Editor" },
  { name: "Standalone", url: "Standalone" },
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
  sequenceData: exampleSequenceData
});

class Demo extends React.Component {
  state = {
    previewMode: false
  };

  changePreviewMode = e =>
    this.setState({
      previewMode: e.target.checked
    });

  render() {
    const { previewMode } = this.state;
    return (
      <Provider store={store}>
        <Router>
          <div>
            {/* <GenbankView editorName={"DemoEditor"} /> */}
            {/* <OrfProperties editorName={"DemoEditor"} /> */}
            {/* <CutsiteProperties editorName={"DemoEditor"}></CutsiteProperties> */}
            {links}
            <Route exact path="/" render={() => <Redirect to="/Editor" />} />
            <Route
              render={() => {
                return (
                  <div>
                    <Switch
                      checked={previewMode}
                      label="Preview Mode"
                      onChange={this.changePreviewMode}
                      style={{ margin: 30 }}
                    />
                    <div
                      style={{
                        height: 600,
                        display: "flex",
                        flexDirection: "column",
                        padding: 40
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          flexWrap: "wrap",
                          justifyContent: "center"
                        }}
                      >
                        <Editor
                          editorName="DemoEditor"
                          previewMode={previewMode}
                        />
                      </div>
                      <div style={{ display: "flex", margin: 20 }} />
                    </div>
                  </div>
                );
              }}
              path="/Editor"
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
