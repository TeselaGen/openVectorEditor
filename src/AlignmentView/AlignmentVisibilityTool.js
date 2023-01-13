import {
  Button,
  Popover,
  Intent,
  Tooltip,
  Tag,
  Menu,
  MenuItem
} from "@blueprintjs/core";
import React from "react";
import { map, startCase } from "lodash";
import pureNoFunc from "../utils/pureNoFunc";
// import { fullSequenceTranslationMenu } from "../MenuBar/viewSubmenu";

export default pureNoFunc(function AlignmentVisibilityTool(props) {
  return (
    <Popover
      minimal
      position="bottom"
      content={<VisibilityOptions {...props} />}
      target={
        <Tooltip content="Visibility Options">
          <Button
            className="tg-alignment-visibility-toggle"
            small
            rightIcon="caret-down"
            intent={Intent.PRIMARY}
            minimal
            icon="eye-open"
          />
        </Tooltip>
      }
    />
  );
});

function VisibilityOptions({
  // alignmentAnnotationVisibility = {},
  alignmentAnnotationVisibilityToggle,
  togglableAlignmentAnnotationSettings = {},
  // alignmentAnnotationLabelVisibility = {},
  // alignmentAnnotationLabelVisibilityToggle
  annotationsWithCounts,
  currentPairwiseAlignmentIndex
}) {
  let annotationCountToUse = {};
  if (currentPairwiseAlignmentIndex) {
    annotationCountToUse = annotationsWithCounts[currentPairwiseAlignmentIndex];
  } else {
    annotationCountToUse = annotationsWithCounts[0];
  }
  return (
    <Menu
      style={{ padding: 10 }}
      className="alignmentAnnotationVisibilityToolInner"
    >
      {map(togglableAlignmentAnnotationSettings, (visible, annotationName) => {
        return (
          <MenuItem
            icon={visible ? "tick" : ""}
            onClick={(e) => {
              e.stopPropagation();
              if (annotationName === "axis") {
                return alignmentAnnotationVisibilityToggle({
                  axisNumbers: !visible,
                  axis: !visible
                });
              }
              if (annotationName === "cdsFeatureTranslations" && !visible) {
                return alignmentAnnotationVisibilityToggle({
                  cdsFeatureTranslations: !visible,
                  translations: !visible
                });
              }

              alignmentAnnotationVisibilityToggle({
                [annotationName]: !visible
              });
            }}
            text={
              <>
                {startCase(annotationName)
                  .replace("Cds", "CDS")
                  .replace("Dna", "DNA")}
                {annotationName in annotationCountToUse ? (
                  <Tag round style={{ marginLeft: 7 }}>
                    {annotationCountToUse[annotationName]}
                  </Tag>
                ) : (
                  ""
                )}
              </>
            }
            key={annotationName}
          ></MenuItem>
        );
      })}
      {/* <MenuItem icon="" text={fullSequenceTranslationMenu.text}>
        {fullSequenceTranslationMenu.submenu.map(({ text, cmd }) => {
          return <MenuItem key={cmd} text={text}></MenuItem>;
        })}
      </MenuItem> */}
    </Menu>
  );
}
