import { HTMLSelect } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import Axios from "axios";

export default function VersionSwitcher() {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    (async function fetchData() {
      try {
        let res = await Axios.get(
          "https://api.github.com/repos/teselagen/openVectorEditor/git/trees/gh-pages"
        );
        // console.log(`res:`,res)
        const versionNode = res.data.tree.find((e) => {
          return e.path.toLowerCase() === "version";
        });

        let selected;
        res = await Axios.get(versionNode.url);
        const opts = res.data.tree.map((e) => {
          return { value: e.path, label: e.path };
        });
        opts.sort((e1, e2) => {
          const e1Arr = e1.label.split(".");
          const e2Arr = e2.label.split(".");
          for (let i = 0; i < e1Arr.length && i < e2Arr.length; i++) {
            const e1V = parseInt(e1Arr[i]);
            const e2V = parseInt(e2Arr[i]);
            if (e1V !== e2V) return e2V - e1V;
            if (e1Arr[i] !== e2Arr[i]) return e2Arr[i] - e1Arr[i];
          }
          return e1.label === e2.label ? 0 : e2.label < e1.label ? -1 : 1;
        });
        opts.unshift({ value: "main", label: "main" });
        const path = window.location.pathname.toLowerCase();
        if (path.startsWith("/version/")) {
          const start = 18;
          const end = path.indexOf("/", start);
          selected = path.substring(start, end);
        } else {
          selected = "main";
        }
        setOptions(opts);
        setSelected(selected);
      } catch (e) {
        console.error(`e:`, e);
      }
    })();
  });
  return (
    !!options.length && (
      <HTMLSelect
        onChange={function onChange() {
          const targetVersionPath =
            selected === "main" ? "" : `/version/${selected}`;
          const path = window.location.pathname.toLowerCase();
          let startIdx = 9;
          const versionIdx = path.indexOf("/version/");
          if (versionIdx >= 0) {
            startIdx = versionIdx + 9;
          }
          const endIdx = path.indexOf("/", startIdx);
          window.location.pathname =
            window.location.pathname.substring(0, 9) +
            targetVersionPath +
            window.location.pathname.substring(endIdx);
        }}
        options={options}
      ></HTMLSelect>
    )
  );
}
