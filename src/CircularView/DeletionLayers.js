import drawCircularLabel2 from "./drawCircularLabel2";
import map from "lodash/map";
import randomcolor from "randomcolor";
import drawDirectedPiePiece from "./drawDirectedPiePiece";
import getRangeAngles from "./getRangeAnglesSpecial";
import lruMemoize from "lru-memoize";
import PositionAnnotationOnCircle from "./PositionAnnotationOnCircle";
import React from "react";

function DeletionLayers(props) {
  let {
    radius,
    sequenceLength,
    deletionLayers = {},
    annotationHeight,
    deletionLayerClicked
  } = props;
  if (!Object.keys(deletionLayers).length) return null;
  let height = 0;
  let component = (
    <g key="veDeletionLayers" className="veDeletionLayers">
      {map(deletionLayers, function(deletionLayer, index) {
        if (
          !(deletionLayer.start > -1 &&
            deletionLayer.end > -1 &&
            sequenceLength > 0)
        ) {
          return;
        }
        let radiusToUse = radius + annotationHeight / 2;
        height = annotationHeight;
        let { startAngle, endAngle, totalAngle } = getRangeAngles(
          deletionLayer,
          sequenceLength
        );
        let path = drawDirectedPiePiece({
          radius: radiusToUse,
          annotationHeight,
          totalAngle,
          arrowheadLength: 0,
          tailThickness: 1 //deletionLayer specific
        });
        return (
          <g
            onClick={function(event) {
              deletionLayerClicked({ event, annotation: deletionLayer });
            }}
            style={{
              cursor: "pointer"
            }}
            className={"veDeletionLayerLabel"}
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
                text: "Deletion",
                id: deletionLayer.id
              })}
            </PositionAnnotationOnCircle>
            <PositionAnnotationOnCircle
              key="item2"
              sAngle={startAngle}
              eAngle={endAngle}
              forward
            >

              <path
                className="veDeletionLayer"
                // strokeWidth=".5"
                // stroke={ 'black' }
                fill={deletionLayer.color || randomcolor()}
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

export default lruMemoize(5, undefined, true)(DeletionLayers);
