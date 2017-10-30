import React from "react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";

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
// import _CutsiteProperties from "../../src/helperComponents/PropertiesDialog/CutsiteProperties";
// import withEditorProps from "../../src/withEditorProps";
// import _OrfProperties from "../../src/helperComponents/PropertiesDialog/OrfProperties";

// const OrfProperties = withEditorProps(_OrfProperties);
// const CutsiteProperties = withEditorProps(_CutsiteProperties)

const links = [
  { name: "Editor", url: "Editor" },
  { name: "Standalone", url: "Standalone" },
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

function Demo() {
  return (
    <Provider store={store}>
      <Router>
        <div>
          {/* <OrfProperties editorName={"DemoEditor"} /> */}
          {/* <CutsiteProperties editorName={"DemoEditor"}></CutsiteProperties> */}
          {links}
          <Route exact path="/" render={() => <Redirect to="/Editor" />} />
          <Route
            render={() => {
              return <Editor editorName="DemoEditor" />;
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

render(<Demo />, document.querySelector("#demo"));
