import React, { useMemo, useState } from "react";
import { Provider } from "react-redux";
import { HashRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { Button, Drawer, Tooltip } from "@blueprintjs/core";

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

import exampleSequenceData from "./exampleData/exampleSequenceData";
import StandaloneDemo from "./StandaloneDemo";
import SimpleCircularOrLinearViewDemo from "./SimpleCircularOrLinearViewDemo";
import StandaloneAlignmentDemo from "./StandaloneAlignmentDemo";
import AlignmentDemo from "./AlignmentDemo";
import VersionHistoryView from "../../src/VersionHistoryView";
import EditorDemo from "./EditorDemo";
import "./style.css";
import VersionSwitcher from "./VersionSwitcher";

const Demo = () => {
  const [isDarkMode, setDarkMode] = useState(
    document.body.className.includes("bp3-dark")
  );
  const [isSidebarOpen, setSidebarOpen] = useState();

  const changeDarkMode = () => {
    setDarkMode(!isDarkMode);
    document.body.classList.toggle("bp3-dark");
  };

  const links = useMemo(() => {
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
    links.push(
      <a
        key="umdDemo"
        style={{ marginLeft: 10 }}
        href={
          window.location.href.includes("localhost")
            ? `${window.location.origin}/UMDDemo.html`
            : "http://teselagen.github.io/openVectorEditor/UMDDemo.html"
        }
      >
        UMD demo
      </a>
    );
    return links.map((l, i) => (
      <span onClick={() => setSidebarOpen(false)} key={i}>
        {l}
      </span>
    ));
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div
          style={{
            height: "100%",
            display: "flex",
            flexGrow: 1,
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          <Drawer
            size={Drawer.SIZE_SMALL}
            isOpen={isSidebarOpen}
            onClose={() => {
              setSidebarOpen(false);
            }}
            position="left"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%"
              }}
            >
              <Button
                onClick={() => {
                  setSidebarOpen(false);
                }}
                minimal
                icon="cross"
              ></Button>
            </div>
            {links}
          </Drawer>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              flexShrink: 0
            }}
          >
            <Button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              intent="primary"
              minimal
              icon="menu"
            ></Button>
            <VersionSwitcher></VersionSwitcher>
            <a
              href="https://github.com/TeselaGen/ove-electron#installation-instructions"
              style={{ marginTop: 5, marginLeft: 10 }}
            >
              This is a developer demo. Get the App?
            </a>{" "}
            <div style={{ paddingTop: 3 }}>
              <iframe
                src="https://ghbtns.com/github-btn.html?user=teselagen&repo=openvectoreditor&type=star&count=true"
                frameBorder="0"
                scrolling="0"
                width="150"
                height="20"
                title="GitHub"
              ></iframe>
            </div>
            <Tooltip
              content={isDarkMode ? "Light Theme" : "Dark Theme"}
              key="theme"
            >
              <Button
                data-test="tg-toggle-dark-mode"
                icon={isDarkMode ? "flash" : "moon"}
                intent={isDarkMode ? "warning" : undefined}
                minimal
                onClick={changeDarkMode}
              />
            </Tooltip>
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
                    getSequenceAtVersion={(versionId) => {
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
                      return new Promise((resolve) => {
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
                  <LinearView
                    withZoomLinearView={true}
                    editorName="DemoEditor"
                  />
                </WrapSimpleDemo>
              );
            }}
            path="/LinearView"
          />
        </div>
      </Router>
    </Provider>
  );
};

const WrapSimpleDemo = ({ children }) => {
  useMemo(() => {
    updateEditor(store, "DemoEditor", {
      readOnly: false,
      sequenceData: exampleSequenceData
    });
  }, []);
  return children;
};

render(<Demo />, document.querySelector("#demo"));
