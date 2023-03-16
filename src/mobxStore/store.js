import {
  findOrfsInPlasmid,
  getAminoAcidDataForEachBaseOfDna
} from "ve-sequence-utils/lib";
import shortid from "shortid";

import prepareRowData from "../utils/prepareRowData";
import AnnotationLabelVisibility from "./AnnotationLabelVisibility";
import AnnotationsToSupport from "./AnnotationsToSupport";
import AnnotationVisibility from "./AnnotationVisibility";
import CopyOptions from "./CopyOptions";
import DigestTool from "./DigestTool";
import FindTool from "./FindTool";
import FrameTranslations from "./FrameTranslations";
import LastSavedId from "./LastSavedId";
import MinimumOrfSize from "./MinimumOrfSize";
import { normalizePositionByRangeLength } from "ve-range-utils/lib";
import LabelLineIntensity from "./LabelLineIntensity";
import LabelSize from "./LabelSize";
import PartLengthsToHide from "./PartLengthsToHide";
import FeatureLengthsToHide from "./FeatureLengthsToHide";
import PanelsShown from "./PanelsShown";
import HoveredAnnotation from "./HoveredAnnotation";
import PropertiesTool from "./PropertiesTool";
import RestrictionEnzymes from "./RestrictionEnzymes";
import { addWrappedAddons } from "../utils/addWrappedAddons";
import { hideAnnByLengthFilter } from "../utils/editorUtils";

const {
  forEach,
  reduce,
  filter,
  each,
  keyBy,
  map,
  some,
  omitBy
} = require("lodash");

const { makeAutoObservable, autorun } = require("mobx");
// const annotationTypes = require("./utils/annotationTypes");

const MARGIN_WIDTH = 10;

// class T {
//   constructor (ed) {
//     this.ed = ed
//   }
//   b= "hey"
//   get a() {
//     return this.b;
//   }
//   get d() {
//     console.log(`this.ed:`,this.ed)
//     return this.a + this.b + this.ed.sequence
//   }
// }

export default class EditorStore {
  constructor({ translations, ...opts }) {
    this._translations = translations;
    forEach(opts, (val, key) => {
      this[key] = val;
    });
    makeAutoObservable(this);
  }

  findTool = new FindTool(this);
  restrictionEnzymes = new RestrictionEnzymes(this);
  propertiesTool = new PropertiesTool(this);
  hoveredAnnotation = new HoveredAnnotation(this);
  panelsShown = new PanelsShown(this);
  partLengthsToHide = new PartLengthsToHide(this);
  featureLengthsToHide = new FeatureLengthsToHide(this);
  labelSize = new LabelSize(this);
  labelLineIntensity = new LabelLineIntensity(this);
  annotationsToSupport = new AnnotationsToSupport(this);
  annotationVisibility = new AnnotationVisibility(this);
  annotationLabelVisibility = new AnnotationLabelVisibility(this);
  minimumOrfSize = new MinimumOrfSize(this);
  lastSavedId = new LastSavedId(this);
  frameTranslations = new FrameTranslations(this);
  copyOptions = new CopyOptions(this);
  digestTool = new DigestTool(this);

  get sequenceData() {
    return {
      name: this.name,
      warnings: this.warnings,
      assemblyPieces: this.assemblyPieces,
      lineageAnnotations: this.lineageAnnotations,
      sequence: this.sequence,
      sequenceLength: this.sequenceLength,
      features: this.features,
      parts: this.parts,
      primers: this.primers,
      translations: this.translations,
      cutsites: this.cutsites,
      orfs: this.orfs
    };
  }

  get rowDataLV() {
    return prepareRowData(this.sequenceData, this.sequenceLength)[0];
  }
  get rowDataRV() {
    return prepareRowData(this.sequenceData, this.bpsPerRow);
  }
  get zoomEnabledLV() {
    return (
      this.sequenceLength >= 50 &&
      this.sequenceLength < 30000 &&
      this.withZoomLinearView
    );
  }
  readOnly = true;
  showReadOnly = true;
  disableSetReadOnly = false;
  updateReadOnlyMode(v) {
    this.readOnly = v;
  }
  toggleReadOnlyMode() {
    this.readOnly = !this.readOnly;
  }
  widthLV = 400;
  widthRV = 400;
  charWidthRV = localStorage.getItem("charWidth") || 12;
  updateSequenceSpacingRV(p) {
    this.charWidthRV = p;
    localStorage.setItem("charWidth", p);
  }
  get innerWidthLV() {
    return this.widthLV - MARGIN_WIDTH;
  }
  get innerWidthRV() {
    return this.widthRV - MARGIN_WIDTH;
  }
  get initialCharWidthLV() {
    return Math.min(this.innerWidthLV / this.sequenceLength, 20);
  }
  get isViewZoomedLV() {
    return this.charWidthLV !== this.initialCharWidthLV;
  }
  zoomLevelCV = 1;
  maxZoomLevelCV = 1;
  isVisPopoverOpen = false;
  withZoomCircularView = true;
  withZoomLinearView = true;

  setVisPopoverOpen() {
    this.isVisPopoverOpen = !this.isVisPopoverOpen;
  }
  setPreviewType(t) {
    this.previewType = t;
  }
  isHotkeyDialogOpen = false;
  tabDragging = false;
  previewModeFullscreen = false;
  name = "Untitled Sequence";
  selectionLayer = { start: -1, end: -1 };

  get allSelectionLayers() {
    return [...this.selectionLayer];
  }
  get orfs() {
    return findOrfsInPlasmid(
      this.sequence,
      this.circular,
      this.minimumOrfSize,
      this.useAdditionalOrfStartCodons
    );
  }
  useAdditionalOrfStartCodons = false;
  caretPosition = -1;
  sequence = "";
  get cdsFeatures() {
    return filter(
      this.features,
      ({ type }) => type && type.toUpperCase() === "CDS"
    );
  }
  warnings = [];
  assemblyPieces = [];
  lineageAnnotations = [];
  _translations = [];
  get translations() {
    const translationsToPass = {
      ...this.findTool.translationSearchMatches.reduce((acc, match) => {
        if (!match) return acc;
        const id = match.id || shortid();
        acc[id] = {
          ...match,
          id,
          translationType: "AA Search Match",
          isOrf: true, //pass isOrf = true here in order to not have it show up in the properties window
          forward: !match.bottomStrand
        };
        return acc;
      }, {}),
      ...reduce(
        this._translations,
        (acc, translation) => {
          if (!translation.isOrf) {
            acc[translation.id] = {
              ...translation,
              translationType: "User Created"
            };
          }
          return acc;
        },
        {}
      ),
      ...(this.annotationVisibility.translations &&
      this.annotationVisibility.orfs
        ? reduce(
            this.orfs,
            (acc, orf) => {
              acc[orf.id] = { ...orf, translationType: "ORF" };
              return acc;
            },
            {}
          )
        : {}),
      ...(this.annotationVisibility.cdsFeatureTranslations &&
        this.annotationVisibility.features &&
        reduce(
          this.cdsFeatures,
          (acc, cdsFeature) => {
            acc[cdsFeature.id] = {
              ...cdsFeature,
              translationType: "CDS Feature"
            };
            return acc;
          },
          {}
        )),
      ...reduce(
        this.frameTranslations.frameTranslations,
        (acc, isActive, frameName) => {
          const frameOffset = Number(frameName);
          if (isActive) {
            const id = shortid();
            acc[id] = {
              id,
              start:
                this.circular || frameOffset > 0
                  ? normalizePositionByRangeLength(
                      0 + frameOffset + (frameOffset > 0 ? -1 : 1),
                      this.sequenceLength
                    )
                  : 0,
              end:
                this.circular || frameOffset < 0
                  ? normalizePositionByRangeLength(
                      this.sequenceLength -
                        1 +
                        frameOffset +
                        (frameOffset > 0 ? -1 : 1),
                      this.sequenceLength
                    )
                  : this.sequenceLength - 1,
              translationType: "Frame",
              forward: frameOffset > 0,
              isOrf: true //pass isOrf = true here in order to not have it show up in the properties window
            };
          }
          return acc;
        },
        {}
      )
    };
    each(translationsToPass, function (translation) {
      translation.aminoAcids = getAminoAcidDataForEachBaseOfDna(
        this.sequence,
        translation.forward,
        translation
      );
    });
    return translationsToPass;
  }
  features = [];
  cutsites = [];
  parts = [];
  primers = [];
  circular = false;
  showCircularity = true;
  materiallyAvailable = true;
  updateAvailability(v) {
    this.materiallyAvailable = v;
  }
  limits = {
    features: 50,
    parts: 50,
    cutsites: 100,
    primers: 50,
    translations: 50,
    orfs: 50
  };
  _circZoomLevel = 1;
  _circ_smallZoomLevel = 1;
  get maxZoomLevel() {
    return Math.max(5, Math.floor(this.sequenceLength / 100));
  }
  setCircZoomLevel(v) {
    this._circZoomLevel = v;
  }
  smallSlider = false;
  maxZoomLevel = 14;
  get circZoomLevel() {
    return this.hasZoomableLength ? 1 : this._circZoomLevel;
  }

  get bpsPerRow() {
    const toRet = Math.floor(
      this.innerWidthRV /
        (this.isProtein ? this.charWidthRV * 3 : this.charWidth)
    );
    return this.isProtein ? toRet * 3 : toRet;
  }

  showCicularViewInternalLabels = true;
  withRotateCircularView = true;
  withZoomCircularView = true;
  withDownload = true;
  // withChoosePreviewType = true;
  // previewType = "circular";
  withFullscreen = true;
  withVisibilityOptions = true;
  minimalPreviewTypeBtns = true;
  panelsShown = [
    [
      {
        id: "rail",
        name: "Linear Map",
        active: true
      },
      {
        id: "circular",
        name: "Circular Map"
      }
    ],
    [
      {
        id: "sequence",
        name: "Sequence Map"
      },
      {
        id: "properties",
        name: "Properties",
        active: true
      }
    ]
  ];

  get hasZoomableLength() {
    return this.size >= 50;
  }
  get hasRotateableLength() {
    return this.size >= 10;
  }
  get rotationRadians() {
    return this.hasRotateableLength ? 0 : this._rotationRadians;
  }
  _rotationRadians = 0;
  setRotationRadians(v) {
    this._rotationRadians = v;
  }
  selectedPartTags = [];
  updateSelectedPartTags(v) {
    this.selectedPartTags = v;
  }
  get filteredFeatures() {
    let filteredFeatures = this.features.slice(0, this.limits.features);
    filteredFeatures = map(
      omitBy(filteredFeatures, (ann) => {
        const hideIndividually =
          this.annotationVisibility.featureIndividualToHide[ann.id];
        return (
          hideAnnByLengthFilter(
            this.featureLengthsToHide,
            ann,
            this.sequenceLength
          ) || hideIndividually
        );
      })
    );
    return filteredFeatures;
  }
  get filteredParts() {
    let filteredParts = this.parts.slice(0, this.limits.parts);
    if (this.selectedPartTags) {
      const keyedTagsToBold = keyBy(this.selectedPartTags, "value");
      filteredParts = map(filteredParts || {}, (p) => {
        if (p.tags) {
          if (
            some(p.tags, (tagId) => {
              return keyedTagsToBold[tagId];
            })
          ) {
            return {
              ...p,
              className: "partWithSelectedTag",
              labelClassName: "partWithSelectedTag",
              highPriorityLabel: true
            };
          } else {
            return p;
          }
        }
      });
    } else {
      //only omit ones that aren't being searched for actively
      filteredParts = map(
        omitBy(filteredParts, (ann) => {
          const hideIndividually =
            this.annotationVisibility.partIndividualToHide[ann.id];
          return (
            hideAnnByLengthFilter(
              this.partLengthsToHide,
              ann,
              this.sequenceLength
            ) || hideIndividually
          );
        })
      );
    }

    return addWrappedAddons(filteredParts, this.sequenceLength);
  }
  get filteredPrimers() {
    return this.primers.slice(0, this.limits.primers);
  }
  get filteredTranslations() {
    return this.translations.slice(0, this.limits.translations);
  }
  get filteredCutsites() {
    return this.cutsites.slice(0, this.limits.cutsites);
  }
  get filteredOrfs() {
    return this.orfs.slice(0, this.limits.orfs);
  }
  get size() {
    return this.sequence.length;
  }
  get sequenceLength() {
    return this.sequence.length;
  }
  get proteinSize() {
    return this.size * 3;
  }
  showGCContent = window.localStorage.getItem("showGCContent") || false;

  toggleShowGCContent = (val) => {
    localStorage.setItem("showGCContent", val);
    this.showGCContent = val;
  };
  openToolbarItem = "";

  openToolbarItemUpdate = (openToolbarItem) => {
    this.openToolbarItem = openToolbarItem;
  };

  selectionLayerUpdate(newSel) {
    if (newSel.start > -1) this.caretPosition = -1;
    this.selectionLayer = newSel;
  }
  // c = new T(this)
}

// const ed = new EditorStore({});
// ed.digestTool.selectedFragment

// autorun(() => {
//   console.log("someData:", ed.c.d);
// });

// ed.c.b = 'weee'
// ed.sequence = 'gaga'

// ed.primers = []
// ed.primers = []
// ed.primers = []
// ed.primers = []
// ed.parts = []
// ed.parts = []
// ed.parts = []
// ed.parts = []

// // console.log(`ed.selectionLayer.start:`, ed.selectionLayer.start);
// // console.log(`ed.filt:`, ed.filteredFeatures);

// // ed.features[0] = "asdf";
