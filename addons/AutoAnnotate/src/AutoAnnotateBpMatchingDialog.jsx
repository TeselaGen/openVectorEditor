/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */
const { Tab, Tabs, wrapDialog, React } = window.addOnGlobals;

const highlightStyle = {
  background: "red",
  marginTop: 2
};
export const AutoAnnotateBpMatchingDialog = wrapDialog({
  title: "Annotation Matching"
})(function ({ isRegex }) {
  return (
    <div className="bp3-dialog-body">
      <Tabs defaultSelectedTabId={isRegex ? "regex" : "iupac"}>
        <Tab
          id="iupac"
          title="IUPAC"
          panel={
            <div>
              <p>
                When in standard (IUPAC) mode, annotations are matched
                case-insensitively. You can use any degenerate IUPAC base pair
                as well as a couple special characters.
              </p>
              <h4>Special Characters:</h4>
              <div
                style={{
                  display: "grid",
                  columnGap: 20,
                  gridTemplateColumns: "1fr 5fr",
                  maxHeight: 200,
                  overflow: "auto"
                }}
              >
                <div>#</div>
                <div>
                  Any arbitrary string of zero or more bases can be matched
                  here.
                </div>
                <div>{"<"}</div>
                <div>Any bases before a {"<"} are considered optional</div>
                <div>{">"}</div>
                <div>Any bases after a {">"} are considered optional</div>
                <div>M</div> <div>AC</div>
                <div>R</div> <div>AG</div>
                <div>W</div> <div>AT</div>
                <div>S</div> <div>CG</div>
                <div>Y</div> <div>CT</div>
                <div>K</div> <div>GT</div>
                <div>V</div> <div>ACG</div>
                <div>H</div> <div>ACT</div>
                <div>D</div> <div>AGT</div>
                <div>B</div> <div>CGT</div>
                <div>X</div> <div>GATC</div>
                <div>N</div> <div>GATC</div>
                <div>.</div> <div>GATC</div>
              </div>
              <br></br>
              <h4>Examples:</h4>
              <div
                style={{
                  display: "grid",
                  columnGap: 20,
                  gridTemplateColumns: "2fr 5fr"
                }}
              >
                <h6>Annotation</h6>
                <h6>
                  Sequence (matches in <span style={highlightStyle}>red</span>)
                </h6>
                <div>AATT</div>
                <div>
                  AA<span style={highlightStyle}>AATT</span>TTGGGGGCCCCCAAGT
                </div>
                <div>aAkT</div>
                <div>
                  AA<span style={highlightStyle}>AATT</span>TTGGGGGCCCCC
                  <span style={highlightStyle}>AAGT</span>
                </div>
                <div>ANT</div>
                <div>
                  AA<span style={highlightStyle}>AAT</span>TTTGGGGGCCCCCA
                  <span style={highlightStyle}>AGT</span>
                </div>
                <div>T#C</div>
                <div>
                  AAAATTT<span style={highlightStyle}>TGGGGGC</span>CCCCAAGT
                </div>
                <div>CA{"<"}ATTT</div>
                <div>
                  AA<span style={highlightStyle}>AATTT</span>TGGGGGCCCCCAAGT
                </div>
                <div>
                  CA{"<"}ATT{">"}TTGAG
                </div>
                <div>
                  AA<span style={highlightStyle}>AATTTTG</span>GGGGCCCCCAAGT
                </div>
              </div>

              <br></br>
              {/* <ConvertApeToRegexTool></ConvertApeToRegexTool> */}
            </div>
          }
        ></Tab>
        <Tab
          id="regex"
          title="Regex"
          panel={
            <div>
              <p>
                When in regex mode, you can use any custom regex to match base
                pairs
              </p>
              <p>
                You can learn more and try out your custom regexes at{" "}
                <a href="https://regex101.com/">https://regex101.com/</a>
              </p>
              <br></br>
              <h4>Examples:</h4>
              <div
                style={{
                  display: "grid",
                  columnGap: 20,
                  gridTemplateColumns: "2fr 5fr"
                }}
              >
                <h6>Annotation</h6>
                <h6>
                  Sequence (matches in <span style={highlightStyle}>red</span>)
                </h6>
                <div>AATT</div>
                <div>
                  AA<span style={highlightStyle}>AATT</span>TTGGGGGCCCCCAAGT
                </div>
                <div>aAtT</div>
                <div>
                  AA<span style={highlightStyle}>AATT</span>TTGGGGGCCCCCAAGT
                </div>
                <div>A.T</div>
                <div>
                  AA<span style={highlightStyle}>AAT</span>TTTGGGGGCCCCCA
                  <span style={highlightStyle}>AGT</span>
                </div>
                <div>T.*C</div>
                <div>
                  AAAA<span style={highlightStyle}>TTTTGGGGGCCCCC</span>AAGT
                </div>
                <div>T[^T]*?C</div>
                <div>
                  AAAATTT<span style={highlightStyle}>TGGGGGC</span>CCCCAAGT
                </div>
                <div>C?A?ATT</div>
                <div>
                  AA<span style={highlightStyle}>AATTT</span>TGGGGGCCCCCAAGT
                </div>
                <div>C?A?ATTT?T?C?</div>
                <div>
                  AA<span style={highlightStyle}>AATTTT</span>GGGGGCCCCCAAGT
                </div>
              </div>
              <br></br>

              {/* <ConvertApeToRegexTool></ConvertApeToRegexTool> */}
            </div>
          }
        ></Tab>
      </Tabs>
    </div>
  );
});

// function ConvertApeToRegexTool() {
//   const [inputVal, setInput] = useState("CA<ANT>TTGAG");

//   let convertedVal = "";
//   try {
//     convertedVal = convertApELikeRegexToRegex(inputVal);
//   } catch (error) {
//     convertedVal = "Error trying to convert to regex";
//   }
//   return (
//     <div
//       style={{
//         display: "grid",
//         rowGap: 10,
//         columnGap: 10,
//         gridTemplateColumns: "1fr 5fr"
//       }}
//     >
//       <div>Input:</div>
//       <TextArea
//         value={inputVal}
//         onChange={e => {
//           setInput(e.target.value.replace(/\s/g, "X"));
//         }}
//       ></TextArea>

//       <div>Output:</div>
//       <div
//         style={{ maxHeight: 200, overflowWrap: "anywhere", overflow: "auto" }}
//       >
//         {convertedVal}
//       </div>
//     </div>
//   );
// }
