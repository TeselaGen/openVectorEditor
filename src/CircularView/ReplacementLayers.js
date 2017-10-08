import normalizeRange from "ve-range-utils/normalizeRange";
import drawCircularLabel2 from "./drawCircularLabel2";
import map from "lodash/map";
import randomcolor from "randomcolor";
import drawDirectedPiePiece from "./drawDirectedPiePiece";
import getRangeAngles from "./getRangeAnglesSpecial";
import lruMemoize from "lru-memoize";
import PositionAnnotationOnCircle from "./PositionAnnotationOnCircle";
import React from "react";

function ReplacementLayers(props) {
  let {
    radius,
    sequenceLength,
    replacementLayers = {},
    annotationHeight,
    replacementLayerClicked
  } = props;
  if (!Object.keys(replacementLayers).length) return null;
  let height = 0;
  let component = (
    <g key="veReplacementLayers" className="veReplacementLayers">
      {map(replacementLayers, function(replacementLayer, index) {
        let insertingAtCaret = !!(replacementLayer.caretPosition > -1);
        if (
          !insertingAtCaret &&
          !(replacementLayer.start > -1 &&
            replacementLayer.end > -1 &&
            sequenceLength > 0)
        ) {
          return;
        }
        let radiusToUse = radius + annotationHeight / 2;
        height = annotationHeight;
        let { startAngle, endAngle, totalAngle } = getRangeAngles(
          insertingAtCaret
            ? normalizeRange(
                {
                  start: replacementLayer.caretPosition,
                  end: replacementLayer.caretPosition
                },
                sequenceLength
              )
            : replacementLayer,
          sequenceLength
        );

        let path = drawDirectedPiePiece({
          radius: radiusToUse,
          annotationHeight,
          totalAngle,
          arrowheadLength: 0,
          tailThickness: 1 //replacementLayer specific
        });
        return (
          <g
            onClick={function(event) {
              replacementLayerClicked({ event, annotation: replacementLayer });
            }}
            style={{
              cursor: "pointer"
            }}
            className={"veReplacementLayerLabel"}
            key={"inlineLabel" + index}
          >
            <PositionAnnotationOnCircle
              key="item1"
              sAngle={startAngle + Math.PI} //add PI because drawCircularLabel is drawing 180
              eAngle={startAngle + Math.PI}
            >
              {drawCircularLabel2({
                centerAngle: startAngle, //used to flip label if necessary
                radius: radiusToUse + annotationHeight,
                fontSize: "20px",
                height: annotationHeight,
                text: insertingAtCaret ? "Insertion" : "Replacement",
                id: replacementLayer.id
              })}
            </PositionAnnotationOnCircle>
            <PositionAnnotationOnCircle
              key="item2"
              sAngle={startAngle}
              eAngle={endAngle}
              forward
            >

              <path
                className="veReplacementLayer"
                // strokeWidth=".5"
                // stroke={ 'black' }
                fill={replacementLayer.color || randomcolor()}
                d={path.print()}
              />
            </PositionAnnotationOnCircle>
          </g>
        );
      }).filter(el => el)}
    </g>
  );
  return {
    component,
    height
  };
}

export default lruMemoize(5, undefined, true)(ReplacementLayers);
