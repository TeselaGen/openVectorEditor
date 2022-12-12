import { MenuItem } from "@blueprintjs/core";
import React from "react";
import { InfoHelper } from "teselagen-react-components";
import useAAColorType from "../utils/useAAColorType";
import { LimitAnnotations } from "../utils/useAnnotationLimits";
import { chromatogramMenu } from "../utils/useChromatogramPrefs";
import useMeltingTemp from "../utils/useMeltingTemp";

export const fullSequenceTranslationMenu = {
  text: "Full Sequence Translation",
  cmd: "fullSequenceTranslations",
  submenu: [
    {
      shouldDismissPopover: false,
      cmd: "sequenceAA_allFrames",
      text: "All Frames"
      // frameNumber: "all" // TODO ?
    },
    {
      shouldDismissPopover: false,
      cmd: "sequenceAA_frame1",
      text: "Frame 1"
      // frameNumber: 1 // TODO ?
    },
    {
      shouldDismissPopover: false,
      cmd: "sequenceAA_frame2",
      text: "Frame 2"
      // frameNumber: 2 // TODO ?
    },
    {
      shouldDismissPopover: false,
      cmd: "sequenceAA_frame3",
      text: "Frame 3"
      // frameNumber: 3 // TODO ?
    },
    {
      shouldDismissPopover: false,
      cmd: "sequenceAAReverse_allFrames",
      text: "All Reverse Frames"
      // frameNumber: "all" // TODO ?
    },
    {
      shouldDismissPopover: false,
      cmd: "sequenceAAReverse_frame1",
      text: "Frame -1"
      // frameNumber: 1 // TODO ?
    },
    {
      shouldDismissPopover: false,
      cmd: "sequenceAAReverse_frame2",
      text: "Frame -2"
      // frameNumber: 2 // TODO ?
    },
    {
      shouldDismissPopover: false,
      cmd: "sequenceAAReverse_frame3",
      text: "Frame -3"
      // frameNumber: 3 // TODO ?
    }
  ]
};
export default [
  // { cmd: "mapCaret" },
  { cmd: "showAll", shouldDismissPopover: false },
  { cmd: "hideAll", shouldDismissPopover: false },
  {
    cmd: "toggleChromatogram",
    shouldDismissPopover: false,
    submenu: [
      { cmd: "toggleChromatogram", shouldDismissPopover: false },
      chromatogramMenu
    ]
  },
  { cmd: "toggleWarnings", shouldDismissPopover: false },
  { cmd: "toggleAssemblyPieces", shouldDismissPopover: false },
  { cmd: "toggleLineageAnnotations", shouldDismissPopover: false },
  //deprecating
  //{ cmd: "toggleFeatures", shouldDismissPopover: false },
  {
    cmd: "toggleFeatures",
    // onClick: () => {}, //commenting this out to allow top level clicking -- https://github.com/TeselaGen/openVectorEditor/issues/865)
    shouldDismissPopover: false,
    submenu: [
      {
        cmd: "toggleFeatures",
        shouldDismissPopover: false
      },
      "onConfigureFeatureTypesClick",
      {
        cmd: "featureTypesCmd",
        shouldDismissPopover: false
      },
      {
        cmd: "featureFilterIndividualCmd",
        shouldDismissPopover: false
      },
      {
        cmd: "filterFeatureLengthsCmd",
        shouldDismissPopover: false
      }
    ]
  },
  {
    cmd: "toggleTranslations",
    // onClick: () => {}, //commenting this out to allow top level clicking -- https://github.com/TeselaGen/openVectorEditor/issues/865)
    shouldDismissPopover: false,
    submenu: [
      {
        cmd: "toggleTranslations",
        shouldDismissPopover: false
      },
      {
        cmd: "toggleCdsFeatureTranslations",
        shouldDismissPopover: false
      },
      {
        cmd: "toggleOrfTranslations",
        shouldDismissPopover: false
      },
      { cmd: "toggleAminoAcidNumbers_dna", shouldDismissPopover: false }
    ]
  },
  { cmd: "togglePrimers", shouldDismissPopover: false },
  // {
  //   // TODO preprocess this as needed
  //   cmd: "featureTypes",
  //   itemId: "featureTypes",
  //   //submenu of checklist of all feature types here
  //   submenu: [{ text: "TO DO...", disabled: true }]
  // },
  {
    cmd: "togglePartsWithSubmenu",
    // onClick: () => {}, //commenting this out to allow top level clicking -- https://github.com/TeselaGen/openVectorEditor/issues/865)
    shouldDismissPopover: false
  },
  { cmd: "toggleCutsites", shouldDismissPopover: false },
  // TODO translations, cds feature translations?
  {
    cmd: "toggleOrfs",
    // onClick: () => {}, //commenting this out to allow top level clicking -- https://github.com/TeselaGen/openVectorEditor/issues/865)
    shouldDismissPopover: false,
    submenu: [
      {
        cmd: "toggleOrfs",
        shouldDismissPopover: false
      },
      {
        cmd: "toggleOrfTranslations",
        shouldDismissPopover: false
      },
      {
        cmd: "useGtgAndCtgAsStartCodons",
        shouldDismissPopover: false
      },
      {
        cmd: "minOrfSizeCmd",
        shouldDismissPopover: false
      }
    ]
  },
  // { cmd: "complementary" },
  // { cmd: "spaces" },
  { divider: "" },
  {
    cmd: "toggleShowGCContent",
    shouldDismissPopover: false,
    text: "Percent GC Content of Selection"
  },
  {
    text: "Melting Temp of Selection",
    component: ToggleShowMeltingTemp
  },
  { divider: "" },
  fullSequenceTranslationMenu,
  { divider: "" },

  { cmd: "toggleAxis", shouldDismissPopover: false },
  { cmd: "toggleAxisNumbers", shouldDismissPopover: false },
  {
    cmd: "toggleAminoAcidNumbers_protein",
    shouldDismissPopover: false
  },
  {
    text: "Amino Acid Colors (by Hydrophobicity/by Family)",
    component: function AAColorType(props) {
      const [aaColorType, setAAColorType] = useAAColorType();
      return (
        <MenuItem
          {...props}
          text="Amino Acid Colors"
          shouldDismissPopover={false}
        >
          <MenuItem
            {...props}
            text={
              <div style={{ display: "flex" }}>
                <span style={{ marginRight: 10 }}>Color By Hydrophobicity</span>
                <InfoHelper
                  content={
                    <div style={{ color: "white" }}>
                      <div
                        style={{
                          padding: 2,
                          backgroundColor: "hsl(258.1, 100%, 69%)"
                        }}
                      >
                        More Hydrophilic (4.5)
                      </div>
                      <div
                        style={{
                          padding: 2,
                          backgroundColor: "hsl(356.9, 100%, 69%)"
                        }}
                      >
                        More Hydrophobic (-4.5)
                      </div>
                    </div>
                  }
                ></InfoHelper>
              </div>
            }
            shouldDismissPopover={false}
            onClick={() => {
              setAAColorType("byHydrophobicity");
            }}
            icon={aaColorType === "byHydrophobicity" ? "small-tick" : "blank"}
          ></MenuItem>
          <MenuItem
            {...props}
            text={
              <div style={{ display: "flex" }}>
                <span style={{ marginRight: 10 }}>Color By Family</span>
                <InfoHelper
                  content={
                    <div style={{ color: "black" }}>
                      <div style={{ padding: 2, backgroundColor: "#FFC0CB" }}>
                        Positive: K, H, R
                      </div>
                      <div style={{ padding: 2, backgroundColor: "#EE82EE" }}>
                        Negative: D, E
                      </div>
                      <div style={{ padding: 2, backgroundColor: "#D3D3D3" }}>
                        Amidic: N, Q
                      </div>
                      <div style={{ padding: 2, backgroundColor: "#00FFFF" }}>
                        Aliphatic: A, G, L, I, P, V
                      </div>
                      <div style={{ padding: 2, backgroundColor: "#FFA500" }}>
                        Aromatic: F, W, Y
                      </div>
                      <div style={{ padding: 2, backgroundColor: "#FFFF00" }}>
                        Sulfur: C, M
                      </div>
                      <div style={{ padding: 2, backgroundColor: "#90EE90" }}>
                        Hydroxylic: S, T
                      </div>
                    </div>
                  }
                ></InfoHelper>
              </div>
            }
            shouldDismissPopover={false}
            onClick={() => {
              setAAColorType("byFamily");
            }}
            icon={aaColorType === "byFamily" ? "small-tick" : "blank"}
          ></MenuItem>
        </MenuItem>
      );
    },
    shouldDismissPopover: false
  },
  { cmd: "toggleDnaColors", shouldDismissPopover: false },
  {
    text: "Sequence",
    submenu: [
      { cmd: "toggleSequence", shouldDismissPopover: false },
      { cmd: "toggleFivePrimeThreePrimeHints", shouldDismissPopover: false },
      { cmd: "toggleReverseSequence", shouldDismissPopover: false },

      {
        text: "Case",
        cmd: "sequenceCase",
        submenu: [
          {
            cmd: "toggleSequenceMapFontUpper",
            text: "Upper Case",
            shouldDismissPopover: false
          },
          {
            cmd: "toggleSequenceMapFontRaw",
            text: "No Preference",
            shouldDismissPopover: false
          },
          {
            cmd: "toggleSequenceMapFontLower",
            text: "Lower Case",
            shouldDismissPopover: false
          }
        ]
      },
      {
        cmd: "setRowViewSequenceSpacing",
        shouldDismissPopover: false
      }
    ]
  },

  { divider: "" },
  {
    text: "Limits",
    cmd: "limitsMenu",
    submenu: [
      {
        text: "Max Features To Show",
        component: LimitAnnotations,
        type: "features"
      },
      {
        text: "Max Parts To Show",
        type: "parts",
        component: LimitAnnotations
      },
      {
        text: "Max Cut Sites To Show",
        component: LimitAnnotations,
        type: "cutsites"
      },
      {
        text: "Max Primers To Show",
        component: LimitAnnotations,
        type: "primers"
      },
      {
        text: "Max Warnings To Show",
        component: LimitAnnotations,
        type: "warnings"
      },
      {
        text: "Max Assembly Pieces To Show",
        component: LimitAnnotations,
        type: "assemblyPieces"
      },
      {
        text: "Max Lineage Annotations To Show",
        component: LimitAnnotations,
        type: "lineageAnnotations"
      }
    ]
  },
  {
    text: "Labels",
    submenu: [
      { divider: "External Labels:" },
      {
        text: "Show All",
        hiddenButSearchableText: "labels",
        cmd: "showAllLabels",
        shouldDismissPopover: false
      },
      {
        text: "Hide All",
        hiddenButSearchableText: "labels",
        cmd: "hideAllLabels",
        shouldDismissPopover: false
      },
      {
        text: "Features",
        hiddenButSearchableText: "labels",
        cmd: "toggleFeatureLabels",
        shouldDismissPopover: false
      },
      {
        text: "Parts",
        hiddenButSearchableText: "labels",
        cmd: "togglePartLabels",
        shouldDismissPopover: false
      },
      {
        text: "Cutsites",
        hiddenButSearchableText: "labels",
        cmd: "toggleCutsiteLabels",
        shouldDismissPopover: false
      },
      {
        text: "Assembly Pieces",
        hiddenButSearchableText: "labels",
        cmd: "toggleAssemblyPieceLabels",
        shouldDismissPopover: false
      },
      {
        text: "LineageAnnotations",
        hiddenButSearchableText: "labels",
        cmd: "toggleLineageAnnotationLabels",
        shouldDismissPopover: false
      },
      {
        text: "Warnings",
        hiddenButSearchableText: "labels",
        cmd: "toggleWarningLabels",
        shouldDismissPopover: false
      },
      {
        text: "Primers",
        hiddenButSearchableText: "labels",
        cmd: "togglePrimerLabels",
        shouldDismissPopover: false
      },

      { divider: "" },

      { cmd: "adjustLabelLineIntensity", shouldDismissPopover: false },
      { cmd: "adjustLabelSize", shouldDismissPopover: false }
    ]
  }
];

function ToggleShowMeltingTemp(props) {
  const [showMeltingTemp, setShowMeltingTemp] = useMeltingTemp();
  return (
    <MenuItem
      {...props}
      shouldDismissPopover={false}
      onClick={() => {
        setShowMeltingTemp(!showMeltingTemp);
      }}
      icon={showMeltingTemp ? "small-tick" : "blank"}
    ></MenuItem>
  );
}
