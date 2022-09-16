import { setupOptions, setParamsIfNecessary } from "./utils/setupOptions";
import React from "react";
import { Callout } from "@blueprintjs/core";

import { SimpleCircularOrLinearView } from "../../src";
import renderToggle from "./utils/renderToggle";

const defaultState = {
  hoverPart: false,
  toggleSelection: false,
  noSequence: false,
  hideNameAndInfo: false,
  circular: false,
  changeSize: false,
  togglePartColor: false,
  toggleNoRedux: false
};

export default class SimpleCircularOrLinearViewDemo extends React.Component {
  constructor(props) {
    super(props);
    setupOptions({ that: this, defaultState, props });
  }
  componentDidUpdate() {
    setParamsIfNecessary({ that: this, defaultState });
  }
  render() {
    return (
      <div style={{ overflowY: "auto" }}>
        <Callout>
          This view is meant to be a helper for showing a simple (non-redux
          connected) circular or linear view!
        </Callout>
        <br></br>
        <br></br>
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: "fit-content",
              borderRight: "1px solid lightgrey",
              marginRight: 10
            }}
          >
            {renderToggle({
              that: this,
              type: "hoverPart",
              label: "Toggle Part 1 Hover"
            })}

            {renderToggle({ that: this, type: "toggleSelection" })}
            {renderToggle({ that: this, type: "limitLengthTo50Bps" })}
            {renderToggle({ that: this, type: "superLongSequence" })}
            {renderToggle({
              that: this,
              type: "noSequence",
              label: "Don't pass .sequence, just .size",
              description:
                "You can pass sequenceData.noSequence=true if you don't want to have to pass the actual sequence. If you do this you must pass a sequenceData.size property"
            })}
            {renderToggle({ that: this, type: "hideNameAndInfo" })}
            {/* {renderToggle({ that: this, type: "showCutsites" })} */}
            {renderToggle({ that: this, type: "circular" })}
            {renderToggle({ that: this, type: "withAdditionalParts" })}
            {renderToggle({ that: this, type: "withCaretEnabled" })}
            {renderToggle({ that: this, type: "withChoosePreviewType" })}
            {renderToggle({ that: this, type: "minimalPreviewTypeBtns" })}
            {renderToggle({ that: this, type: "withFullscreen" })}
            {renderToggle({ that: this, type: "withVisibilityOptions" })}
            {renderToggle({ that: this, type: "withZoomLinearView" })}
            {renderToggle({ that: this, type: "withZoomCircularView" })}
            {renderToggle({
              that: this,
              type: "smallSlider",
              info: "Requires withZoomLinearView or withZoomCircularView to be enabled to see this one"
            })}
            {renderToggle({ that: this, type: "withDownload" })}
            {renderToggle({ that: this, type: "changeSize" })}
            {renderToggle({
              that: this,
              type: "partOverlapsSelf",
              description:
                "You can pass an overlapsSelf=true flag to parts to allow them wrap around the whole sequence and then some"
            })}
            {renderToggle({ that: this, type: "togglePartColor" })}
            {renderToggle({ that: this, type: "isOligo" })}
            {renderToggle({
              that: this,
              type: "toggleNoRedux",
              description:
                "Pass noRedux=true if you want to render this component in a redux-free environment. Note: passing hoveredIds will not work with noRedux=true"
            })}
            <br />
            <br />
          </div>
          <SimpleCircularOrLinearView
            {...{
              ...this.state,
              ...(this.state.toggleNoRedux && { noRedux: true }),
              ...(this.state.hideNameAndInfo && { hideName: true }),
              ...(this.state.hoverPart && { hoveredId: "fakeId1" }),
              ...(this.state.changeSize && { height: 500, width: 500 }),
              ...(this.state.toggleSelection && {
                selectionLayer: { start: 2, end: 30 }
              }),
              partClicked: () => {
                window.toastr.success("Part Clicked!");
              },
              partRightClicked: () => {
                window.toastr.success("Part Right Clicked!");
              },

              sequenceData: {
                // annotationLabelVisibility: {
                //   parts: false,
                //   features: false,
                //   cutsites: false,
                //   primers: false
                // },
                // annotationVisibility: {
                //   axis: sequenceData.circular
                // }
                ...(this.state.noSequence
                  ? {
                      noSequence: true,
                      size: this.state.superLongSequence
                        ? 1640
                        : this.state.limitLengthTo50Bps
                        ? 50
                        : 164
                    }
                  : {
                      sequence: this.state.superLongSequence
                        ? "GGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacacccccc"
                        : this.state.limitLengthTo50Bps
                        ? "GGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAaga"
                        : "GGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacacccccc"
                    }),
                ...(this.state.isOligo
                  ? {
                      isOligo: true
                    }
                  : {}),
                name: "Test Seq",
                circular: this.state.circular, //toggle to true to change this!
                features: [
                  {
                    name: "Feat 1",
                    id: "fakeId2",
                    color: "green",
                    start: 1,
                    end: 70
                  }
                ],
                parts: [
                  {
                    name: "Part 1",
                    id: "fakeId1",
                    start: 10,
                    end: 20,
                    ...(this.state.togglePartColor && { color: "override_red" })
                  },

                  ...(this.state.withAdditionalParts
                    ? [
                        {
                          name: "Additional Part 1",
                          id: "fakeId76",
                          start: 25,
                          end: 30,
                          ...(this.state.togglePartColor && {
                            color: "override_red"
                          })
                        }
                      ]
                    : []),
                  {
                    name: "Part 2",
                    id: "fakeId3",
                    overlapsSelf: true,
                    start: 25,
                    end: 30,
                    ...(this.state.togglePartColor && {
                      color: "override_blue"
                    }),
                    ...(this.state.partOverlapsSelf && { overlapsSelf: true })
                  },
                  ...(this.state.withAdditionalParts
                    ? [
                        {
                          name: "Additional Part 2",
                          id: "fakeId1991",
                          start: 10,
                          end: 20,
                          ...(this.state.togglePartColor && {
                            color: "override_red"
                          })
                        }
                      ]
                    : [])
                ]
              }
            }}
          />
        </div>

        <br />
        <code>
          <h3> Usage: </h3>
          <pre>
            {`<SimpleCircularOrLinearView
  {...{
    ...(this.state.hideNameAndInfo && { hideName: true }),
    ...(this.state.hoverPart && { hoveredId: "fakeId1" }),
    ...(this.state.changeSize && { height: 500, width: 500 }),

    sequenceData: {
      name: "Test Seq",
      circular: this.state.circular, //toggle to true to change this!
      parts: [
        {
          name: "Part 1",
          id: "fakeId1",
          start: 10,
          end: 20
        },
        {
          name: "Part 2",
          id: "fakeId4",
          start: 25,
          end: 30
        }
      ],
      sequence:
        "GGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacacccccc"
    }
  }}
/>`
              .split("\n")
              .map((l, i) => (
                <div key={i}>{l}</div>
              ))}
          </pre>
        </code>
      </div>
    );
  }
}
