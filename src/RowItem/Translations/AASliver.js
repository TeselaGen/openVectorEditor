// import PropTypes from "prop-types";
import React from "react";
import pureNoFunc from "../../utils/pureNoFunc";

function AASliver(props) {
  const {
    forward,
    aminoAcidIndex,
    showAAColors = true,
    onClick,
    onContextMenu,
    width,
    height,
    isFiller,
    isTruncatedStart,
    isTruncatedEnd,
    relativeAAPositionInTranslation,
    title,
    color,
    showAminoAcidNumbers,
    letter
  } = props;

  if (letter === "-") {
    return null;
  }

  const dirX1 = 1 / Math.sqrt(26);
  const dirY1 = 5 * dirX1;

  const dirX2 = 16 / Math.sqrt(2756);
  const dirY2 = 50 / Math.sqrt(2756);

  const roundedCorner = 15;
  let path = "";
  path = isFiller
    ? "25,0 49,0 60,50 49,100 25,100 38,50 25,0"
    : isTruncatedStart
    ? // ? "0,0 50,0 60,50 50,100 00,100 16,50 0,0"
      `M ${roundedCorner / 3}, 0
                  L ${50 - roundedCorner / 3}, 0
                  Q 50 0 ${50 + roundedCorner * dirX1} ${roundedCorner * dirY1}
                  L ${60 - roundedCorner * dirX1}, ${50 - roundedCorner * dirY1}
                  Q 60 50 ${60 - roundedCorner * dirX1} ${
        50 + roundedCorner * dirY1
      }
                  L ${50 + roundedCorner * dirX1}, ${
        100 - roundedCorner * dirY1
      }
                  Q 50 100 ${50 - roundedCorner} 100
                  L ${roundedCorner / 3}, 100
                  Q 0 100 ${roundedCorner * dirX2} ${
        100 - roundedCorner * dirY2
      }
                  L ${16 - roundedCorner * dirX2}, ${50 + roundedCorner * dirY2}
                  Q 16 50 ${16 - roundedCorner * dirX2} ${
        50 - roundedCorner * dirY2
      }
                  L ${roundedCorner * dirX2}, ${roundedCorner * dirY2}
                  Q 0 0 ${roundedCorner / 3} 0
                  z`
    : isTruncatedEnd
    ? // ? "24,0 74,0 84,50 74,100 24,100 40,50 24,0"
      `M ${24 + roundedCorner / 3}, 0
                  L ${74 - roundedCorner / 3}, 0
                  Q 74 0 ${74 + roundedCorner * dirX1} ${roundedCorner * dirY1}
                  L ${84 - roundedCorner * dirX1}, ${50 - roundedCorner * dirY1}
                  Q 84 50 ${84 - roundedCorner * dirX1} ${
        50 + roundedCorner * dirY1
      }
                  L ${74 + roundedCorner * dirX1}, ${
        100 - roundedCorner * dirY1
      }
                  Q 74 100 ${74 - roundedCorner} 100
                  L ${24 + roundedCorner / 3}, 100
                  Q 24 100 ${24 + roundedCorner * dirX2} ${
        100 - roundedCorner * dirY2
      }
                  L ${40 - roundedCorner * dirX2}, ${50 + roundedCorner * dirY2}
                  Q 40 50 ${40 - roundedCorner * dirX2}, ${
        50 - roundedCorner * dirY2
      }
                  L ${24 + roundedCorner * dirX2}, ${roundedCorner * dirY2}
                  Q 24 0 ${24 + roundedCorner / 3} 0
                  z`
    : `M ${roundedCorner / 3}, 0
                  L ${74 - roundedCorner / 3}, 0
                  Q 74 0 ${74 + roundedCorner * dirX1} ${roundedCorner * dirY1}
                  L ${84 - roundedCorner * dirX1}, ${50 - roundedCorner * dirY1}
                  Q 84 50 ${84 - roundedCorner * dirX1} ${
        50 + roundedCorner * dirY1
      }
                  L ${74 + roundedCorner * dirX1}, ${
        100 - roundedCorner * dirY1
      }
                  Q 74 100 ${74 - roundedCorner / 3} 100
                  L ${roundedCorner / 3}, 100
                  Q 0 100 ${roundedCorner * dirX2} ${
        100 - roundedCorner * dirY2
      }
                  L ${16 - roundedCorner * dirX2}, ${50 + roundedCorner * dirY2}
                  Q 16 50 ${16 - roundedCorner * dirX2}, ${
        50 - roundedCorner * dirY2
      }
                  L ${roundedCorner * dirX2}, ${roundedCorner * dirY2}
                  Q 0 0 ${roundedCorner / 3} 0
                  z`;
  return (
    <>
      <g
        onClick={onClick}
        onContextMenu={onContextMenu}
        transform={
          "scale(" +
          (width / 100) * 1.25 +
          ", " +
          height / 100 +
          ") translate(" +
          ((forward ? -20 : -50) +
            ((relativeAAPositionInTranslation - 1) * 100) / 1.25) +
          ",0)"
        }
      >
        <title>{title}</title>
        {showAAColors &&
          (isFiller ? (
            <polyline
              className={letter}
              transform={
                forward ? "scale(3,1)" : "translate(300,0) scale(-3,1) "
              }
              points={
                isFiller
                  ? "25,0 49,0 60,50 49,100 25,100 38,50 25,0"
                  : isTruncatedStart
                  ? "0,0 50,0 60,50 50,100 00,100 16,50 0,0"
                  : isTruncatedEnd
                  ? "24,0 74,0 84,50 74,100 24,100 40,50 24,0"
                  : "0,0 74,0 85,50 74,100 0,100 16,50 0,0"
              }
              strokeWidth="5"
              fill={color || "gray"}
            />
          ) : (
            <path
              className={letter}
              transform={
                forward ? "scale(3,1)" : "translate(300,0) scale(-3,1) "
              }
              d={path}
              strokeWidth="5"
              fill={color || "gray"}
            />
          ))}

        {!isFiller && (
          <text
            fontSize={25}
            stroke="black"
            strokeWidth={2}
            transform={`scale(${(3 / width) * 10},3) translate(${
              ((forward ? 45 : 55) * width) / 10
            },21)`}
            x="0"
            y="4"
            style={{ textAnchor: "middle" }}
          >
            {letter}
          </text>
        )}

        {showAminoAcidNumbers && (aminoAcidIndex + 1) % 5 === 0 && (
          <text
            fontSize={25}
            stroke="black"
            strokeWidth={2}
            transform={`scale(${(3 / width) * 10},3) translate(${
              ((forward ? 45 : 55) * width) / 10
            },51)`}
            x="0"
            y="4"
            style={{ textAnchor: "middle" }}
          >
            {aminoAcidIndex + 1}
          </text>
        )}
      </g>
    </>
  );
}

export default pureNoFunc(AASliver);
