// import PropTypes from "prop-types";
import React from "react";
import pureNoFunc from "../../utils/pureNoFunc";

function AASliver(props) {
  let fatness = 24;
  let x1 = 50 - fatness;
  let x2 = 50 + fatness;
  let offset = 0;
  let offsetStrength = 7;
  if (props.positionInCodon === 0) {
    offset = -1;
  } else if (props.positionInCodon === 2) {
    offset = 1;
  }
  if (props.forward) {
    offset = -offset;
  }
  offset = offset * offsetStrength;
  if (props.letter === "-") {
    return null;
  }
  return (
    <g
      onClick={props.onClick}
      onContextMenu={props.onContextMenu}
      // onClick={getClickHandler(this.props.onClick, this.props.onDoubleClick, 250)}
      // onDoubleClick={this.props.onDoubleClick}
      transform={
        "scale(" +
        (props.width / 100) * 1.25 +
        ", " +
        props.height / 100 +
        ") translate(" +
        ((props.relativeAAPositionInTranslation * 100) / 1.25 + offset) +
        ",0)"
      }
    >
      <title>{props.title}</title>
      <polyline
        className={props.letter}
        transform={props.forward ? null : "translate(100,0) scale(-1,1) "}
        points={
          "0,0 " + x2 + ",0 100,50 " + x2 + ",100 0,100 " + x1 + ",50 0,0"
        }
        strokeWidth="5"
        // stroke="black"
        opacity={0.5}
        fill={props.color || "gray"}
      />
      {props.positionInCodon === 1 && (
        <text
          fontSize={25}
          stroke="black"
          strokeWidth={2}
          transform="scale(3,3) translate(17,21)"
          x="0"
          y="4"
          style={{ textAnchor: "middle" }}
        >
          {props.letter}
        </text>
      )}
    </g>
  );
  // function getClickHandler(onClick, onDblClick, pDelay) {
  //     let timeoutID = null;
  //     const delay = pDelay || 250;
  //     return function(event) {
  //         let singleClicking = true;
  //         if (!timeoutID) {
  //             timeoutID = setTimeout(function() {
  //                 if (singleClicking) {
  //                     onClick(event);
  //                 }
  //                 timeoutID = null;
  //             }, delay);
  //         } else {
  //             singleClicking = false;
  //             timeoutID = clearTimeout(timeoutID);
  //             onDblClick(event);
  //         }
  //     };
  // }
}

// AASliver.propTypes = {
//   width: PropTypes.number.isRequired,
//   height: PropTypes.number.isRequired,
//   color: PropTypes.string.isRequired,
//   forward: PropTypes.bool.isRequired,
//   positionInCodon: PropTypes.number.isRequired,
//   letter: PropTypes.string.isRequired,
//   onClick: PropTypes.func.isRequired,
//   onContextMenu: PropTypes.func.isRequired,
//   onDoubleClick: PropTypes.func.isRequired,
//   relativeAAPositionInTranslation: PropTypes.number.isRequired
// };

export default pureNoFunc(AASliver);
