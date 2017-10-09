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
  VeToolBar,
  // CutsiteFilter,
  // createVectorEditor,
  LinearView,
  DigestTool,
  Editor
} from "../../src";
import AddOrEditFeatureDialog from "../../src/helperComponents/AddOrEditFeatureDialog";

const links = [
  { name: "Editor", url: "Editor" },
  { name: "CircularView", url: "CircularView" },
  { name: "DigestTool", url: "DigestTool" },
  { name: "RowView", url: "RowView" },
  { name: "LinearView", url: "LinearView" },
  { name: "VeToolBar", url: "VeToolBar" }
].map(({ url, name }) => {
  return (
    <Link key={name} style={{ marginLeft: 10 }} to={url}>
      {" "}
      {name}{" "}
    </Link>
  );
});

function Demo() {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <AddOrEditFeatureDialog
            dialogProps={{
              title: "Add Feature"
            }}
          >
            <button>Show Add New</button>
          </AddOrEditFeatureDialog>

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
              return <VeToolBar editorName="DemoEditor" />;
            }}
            path="/VeToolBar"
          />
        </div>
      </Router>
    </Provider>
  );
}

render(<Demo />, document.querySelector("#demo"));
