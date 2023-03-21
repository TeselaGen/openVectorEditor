/*eslint no-dupe-class-members: "error"*/

import {
  annotationTypes,
  findOrfsInPlasmid,
  getAminoAcidDataForEachBaseOfDna,
  getComplementSequenceAndAnnotations,
  getCutsitesFromSequence,
  getReverseComplementSequenceAndAnnotations,
  insertSequenceDataAtPositionOrRange,
  rotateSequenceDataToPosition,
  tidyUpSequenceData
} from "ve-sequence-utils/lib";
import shortid from "shortid";

import prepareRowData from "./utils/prepareRowData";
import AnnotationLabelVisibility from "./AnnotationLabelVisibility";
import AnnotationsToSupport from "./AnnotationsToSupport";
import AnnotationVisibility from "./AnnotationVisibility";
import CopyOptions from "./CopyOptions";
import DigestTool from "./DigestTool";
import FindTool from "./FindTool";
import FrameTranslations from "./FrameTranslations";
import MinimumOrfSize from "./MinimumOrfSize";
import {
  getRangeLength,
  invertRange,
  normalizePositionByRangeLength,
  normalizeRange
} from "ve-range-utils/lib";
import LabelLineIntensity from "./LabelLineIntensity";
import PartLengthsToHide from "./PartLengthsToHide";
import FeatureLengthsToHide from "./FeatureLengthsToHide";
import PanelsShown from "./PanelsShown";

// import PropertiesTool from "./PropertiesTool";
import { addWrappedAddons } from "../utils/addWrappedAddons";
import { getCustomEnzymes, hideAnnByLengthFilter } from "../utils/editorUtils";
import { getLowerCaseObj } from "../utils/arrayUtils";
import { defaultEnzymesByName, aliasedEnzymesByName } from "ve-sequence-utils";
import specialCutsiteFilterOptions from "../constants/specialCutsiteFilterOptions";
import { Intent } from "@blueprintjs/core";
import { showConfirmationDialog } from "teselagen-react-components";
import {
  hasAnnotationThatSpansOrigin,
  truncateOriginSpanningAnnotations
} from "./utils/truncateOriginSpanningAnns";
import FileSaver from "file-saver";
import {
  anyToJson,
  cleanUpTeselagenJsonForExport,
  jsonToFasta,
  jsonToGenbank
} from "bio-parsers";
import { generatePngFromPrintDialog } from "./utils/generatePngFromPrintDialog";
import {
  showAddOrEditAnnotationDialog,
  showDialog
} from "../GlobalDialogUtils";

import {
  forEach,
  reduce,
  filter,
  each,
  keyBy,
  map,
  some,
  omitBy,
  flatMap,
  omit,
  isArray,
  pickBy,
  set
} from "lodash";

import { makeAutoObservable } from "mobx";

import { configure } from "mobx";

configure({
  // enforceActions: "always",
  // computedRequiresReaction: true,
  // reactionRequiresObservable: true,
  // observableRequiresReaction: true,
  // disableErrorBoundaries: true
});

const initialSequenceDataHistory = {
  past: [],
  future: []
};

const MARGIN_WIDTH = 10;

class T {
  constructor(ed) {
    this.ed = ed;
  }
  b = "hey";
  get a() {
    return this.b;
  }
  get d() {
    return this.a + this.b + this.ed.sequence;
  }
}

class RowStore {
  features;
  warnings;
  assemblyPieces;
  lineageAnnotations;
  parts;
  cutsites;
  orfs;
  translations;
  primers;
  guides;
  constructor({
    ed,
    annotationVisibility,
    charWidth,
    rowNumber,
    start,
    end,
    primaryProteinSequence,
    sequence,
    ...opts
  }) {
    forEach(opts, (val, key) => {
      this[key] = val;
    });
    this.annotationVisibility = annotationVisibility;
    this.ed = ed;
    this.charWidth = charWidth;
    this.rowNumber = rowNumber;
    this.start = start;
    this.end = end;
    this.primaryProteinSequence = primaryProteinSequence;
    this.sequence = sequence;
  }
}

export default class EditorStore {
  constructor({ translations, additionalEnzymes, ...opts }) {
    this._translations = translations; //don't overwrite the actual key here
    this._additionalEnzymes = additionalEnzymes; //don't overwrite the actual key here
    forEach(opts, (val, key) => {
      this[key] = val;
    });
    makeAutoObservable(this, {}, { autoBind: true });
    this.T = new T(this);
    this.findTool = new FindTool(this);

    this.panelsShown = new PanelsShown(this);
    this.partLengthsToHide = new PartLengthsToHide(this);
    this.featureLengthsToHide = new FeatureLengthsToHide(this);
    this.labelLineIntensity = new LabelLineIntensity(this);
    this.annotationsToSupport = new AnnotationsToSupport(this);
    this.annotationVisibility = new AnnotationVisibility(this);
    this.annotationLabelVisibility = new AnnotationLabelVisibility(this);
    this.minimumOrfSize = new MinimumOrfSize(this);

    this.frameTranslations = new FrameTranslations(this);
    this.copyOptions = new CopyOptions(this);
    this.digestTool = new DigestTool(this);
  }
  T;
  findTool;

  panelsShown;
  partLengthsToHide;
  featureLengthsToHide;
  labelSize;
  labelLineIntensity;
  annotationsToSupport;
  annotationVisibility;
  annotationLabelVisibility;
  minimumOrfSize;
  lastSavedId;
  frameTranslations;
  copyOptions;
  digestTool;
  hoveredAnnotation;
  get hoveredAnnotationId() {
    return this.hoveredAnnotation?.id;
  }
  size = window.localStorage.getItem("labelSize")
    ? parseInt(window.localStorage.getItem("labelSize"))
    : 8;
  changeLabelSize(payload) {
    this.size = payload;
  }

  lastSavedIdUpdate(payload) {
    this.lastSavedId = payload;
  }
  get sequenceData() {
    console.log(`computin 1`);
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
      translations: this._translations
    };
  }

  get _rowDataLV() {
    return prepareRowData({
      sequenceData: this.sequenceData,
      bpsPerRow: this.sequenceLength
    })[0];
  }
  get rowDataLV() {
    return new RowStore({
      ...this._rowDataLV,
      annotationVisibility: this.annotationVisibility,
      charWidth: this.charWidthLV,
      ed: this
    });
  }
  get _rowData() {
    console.log("Computing...");

    return prepareRowData({
      sequenceData: this.sequenceData,
      bpsPerRow: this.bpsPerRow
    });
  }
  get rowData() {
    const annotationVisibility = {
      ...this.annotationVisibility,
      ...((!this.isViewZoomedLV || this.charWidthLV < 5) && {
        translations: false,
        primaryProteinSequence: false,
        reverseSequence: false,
        sequence: false,
        cutsitesInSequence: false
      })
    };
    return this._rowData.map((r) => {
      return new RowStore({
        ...r,
        annotationVisibility, //pass a custom annotatationVisibility on the row
        charWidth: this.charWidthLV,
        ed: this
      });
    });
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
    console.log(`computin 3`);

    return this.widthRV - MARGIN_WIDTH;
  }
  get initialCharWidthLV() {
    return Math.min(this.innerWidthLV / this.sequenceLength, 20);
  }
  get isViewZoomedLV() {
    return this.charWidthLV !== this.initialCharWidthLV;
  }
  zoomLevelCV = 1;
  maxZoomLevelCV = 10;
  isVisPopoverOpen = false;
  withZoomCircularView = true;
  withZoomLinearView = true;

  setVisPopoverOpen() {
    this.isVisPopoverOpen = !this.isVisPopoverOpen;
  }
  setPreviewType(t) {
    this.previewType = t;
  }
  additionalSelectionLayers = [];
  isHotkeyDialogOpen = false;
  tabDragging = false;
  previewModeFullscreen = false;
  name = "Untitled Sequence";
  selectionLayer = { start: -1, end: -1 };

  get allSelectionLayers() {
    const selectionLayers = [
      ...this.additionalSelectionLayers,
      ...this.findTool.searchLayers,
      ...(Array.isArray(this.selectionLayer)
        ? this.selectionLayer
        : [this.selectionLayer])
    ];
    const doubleWrappedColor = "#edb2f1";
    // const doubleWrappedColor = "#abdbfb";

    if (this.selectionLayer.overlapsSelf) {
      selectionLayers.push({
        start: this.selectionLayer.end + 1,
        end: this.selectionLayer.start - 1,
        color: this.selectionLayer.isWrappedAddon
          ? undefined
          : doubleWrappedColor
      });
      if (this.selectionLayer.isWrappedAddon) {
        this.selectionLayer.color = doubleWrappedColor;
      }
    }
    return selectionLayers;
  }
  get orfs() {
    return findOrfsInPlasmid(
      this.sequence,
      this.circular,
      this.minimumOrfSize,
      this.useAdditionalOrfStartCodons
    );
  }
  sequenceDataHistory = initialSequenceDataHistory;
  initializeSequenceDataHistory() {
    this.sequenceDataHistory = initialSequenceDataHistory;
  }
  useAdditionalOrfStartCodons = false;
  caretPosition = -1;
  sequence = "";
  // getUpperOrLowerSeq tnwtodo
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
    each(translationsToPass, (translation) => {
      translation.aminoAcids = getAminoAcidDataForEachBaseOfDna(
        this.sequence,
        translation.forward,
        translation
      );
    });
    return translationsToPass;
  }
  features = [];
  get additionalEnzymes() {
    const customEnzymesString = window.localStorage.getItem("customEnzymes");
    return getLowerCaseObj(
      pickBy(
        {
          ...this._additionalEnzymes,
          ...getCustomEnzymes(customEnzymesString)
        },
        (val, key) => {
          if (!val) {
            console.error(
              "43ti3523: Error: Missing enzyme data for key: ",
              key,
              "Ignoring this enzyme"
            );
            return false;
          }

          // eslint-disable-next-line no-unused-vars
          for (const prop of [
            "forwardRegex",
            "reverseRegex",
            "topSnipOffset",
            "bottomSnipOffset",
            "site"
          ]) {
            if (val[prop] === undefined || val[prop] === null) {
              console.error(
                `23483g93h Error: Missing property ${prop} for enzyme ${key}. Ignoring this enzyme`
              );
              return false;
            }
          }
          return true;
        }
      )
    );
  }
  enzymeGroupsOverride = {};
  get enzymeGroups() {
    return {
      ...window.getExistingEnzymeGroups(),
      ...this.enzymeGroupsOverride
    };
  }
  filteredRestrictionEnzymes = [specialCutsiteFilterOptions.single];
  isEnzymeFilterAnd = false;

  filteredRestrictionEnzymesUpdate(payload) {
    this.filteredRestrictionEnzymes = payload;
  }

  filteredRestrictionEnzymesAdd(payload) {
    this.filteredRestrictionEnzymes = [
      ...this.filteredRestrictionEnzymes,
      payload
    ];
  }

  filteredRestrictionEnzymesReset() {
    this.filteredRestrictionEnzymes = [specialCutsiteFilterOptions.single];
  }

  isEnzymeFilterAndUpdate(isEnzymeFilterAnd) {
    this.isEnzymeFilterAnd = isEnzymeFilterAnd;
  }
  get enzymesFromGroups() {
    const enzymesFromGroups = {};
    forEach(this.enzymeGroups, (group) => {
      forEach(group, (enzymeName) => {
        const enzyme = { ...aliasedEnzymesByName, ...this.additionalEnzymes }[
          enzymeName.toLowerCase()
        ];
        if (!enzyme) {
          console.warn("ruh roh, no enzyme found for: ", enzymeName);
        } else {
          enzymesFromGroups[enzymeName.toLowerCase()] = enzyme;
        }
      });
    });
    return enzymesFromGroups;
  }
  get restrictionEnzymes() {
    return {
      ...defaultEnzymesByName,
      ...this.additionalEnzymes,
      ...this.enzymesFromGroups
    };
  }
  cutsiteLabelColors = {};
  get cutsites() {
    //get the cutsites grouped by enzyme
    const cutsitesByName = getLowerCaseObj(
      getCutsitesFromSequence(
        this.sequence,
        this.circular,
        map(this.restrictionEnzymes)
      )
    );
    //tag each cutsite with a unique id
    const cutsitesById = {};
    Object.keys(cutsitesByName).forEach((enzymeName) => {
      const cutsitesForEnzyme = cutsitesByName[enzymeName];
      cutsitesForEnzyme.forEach((cutsite) => {
        const numberOfCuts = cutsitesByName[enzymeName].length;
        const uniqueId = shortid();
        cutsite.id = uniqueId;
        cutsite.numberOfCuts = numberOfCuts;
        cutsite.annotationType = "cutsite";
        cutsitesById[uniqueId] = cutsite;
        const mergedCutsiteColors = Object.assign(
          { single: "salmon", double: "lightblue", multi: "lightgrey" },
          this.cutsiteLabelColors
        );
        if (numberOfCuts === 1) {
          cutsite.labelColor = mergedCutsiteColors.single;
          cutsite.labelClassname = "singleCutter";
        } else if (numberOfCuts === 2) {
          cutsite.labelColor = mergedCutsiteColors.double;
          cutsite.labelClassname = "doubleCutter";
        } else {
          cutsite.labelColor = mergedCutsiteColors.multi;
          cutsite.labelClassname = "multiCutter";
        }
      });
    });
    // create an array of the cutsites
    const cutsitesArray = flatMap(cutsitesByName, (cutsitesForEnzyme) => {
      return cutsitesForEnzyme;
    });
    return {
      cutsitesByName,
      cutsitesById,
      cutsitesArray
    };
  }
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
    console.log(`computin 2`);

    const toRet = Math.floor(
      this.innerWidthRV /
        (this.isProtein ? this.charWidthRV * 3 : this.charWidthRV)
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
    if (this.selectedPartTags.length) {
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
      filteredParts = omitBy(filteredParts, (ann) => {
        const hideIndividually =
          this.annotationVisibility.partIndividualToHide[ann.id];
        const shouldHide =
          hideAnnByLengthFilter(
            this.partLengthsToHide,
            ann,
            this.sequenceLength
          ) || hideIndividually;

        return shouldHide;
      });
    }

    return addWrappedAddons(filteredParts, this.sequenceLength).slice(
      0,
      this.limits.parts
    );
  }
  get filteredPrimers() {
    return this.primers.slice(0, this.limits.primers);
  }
  get filteredTranslations() {
    return this.translations.slice(0, this.limits.translations);
  }
  get filteredCutsites() {
    const returnVal = {
      cutsitesByName: {},
      cutsiteIntersectionCount: 0,
      cutsiteTotalCount: 0,
      cutsitesArray: [],
      cutsitesById: {}
    };
    // const cutsitesByName = getLowerCaseObj(cutsitesByName);

    const hiddenEnzymesByName = {};
    let filteredEnzymes = [];
    let enzymesFromGroups = [];
    let hasUserGroup;
    let groupCount = 0;
    //handle adding enzymes that are included in user created groups
    this.filteredRestrictionEnzymes.forEach((e) => {
      if (e.value.includes("__userCreatedGroup")) {
        hasUserGroup = true;

        const enzymes =
          this.enzymeGroups[e.value.replace("__userCreatedGroup", "")] || [];
        const zs = flatMap(enzymes, (e) => (e ? { value: e } : []));
        filteredEnzymes = filteredEnzymes.concat(zs);
        enzymesFromGroups = enzymesFromGroups.concat(zs);
        groupCount += 4;
      } else if (e.isHidden) {
        hiddenEnzymesByName[e.value] = e;
      } else {
        if (!e) return;
        groupCount += 5;
        filteredEnzymes.push(e);
      }
    });

    const cutSiteList = [];
    if (!filteredEnzymes || (filteredEnzymes.length === 0 && !hasUserGroup)) {
      returnVal.cutsitesByName = this.cutsites.cutsitesByName;
    } else {
      //loop through each filter option ('Single Cutters', 'BamHI')
      filteredEnzymes.forEach(({ value, ...rest }) => {
        if (!value) {
          console.error(`Missing value for filtered enzyme`, rest);
          return;
        }
        const lowerValue = value.toLowerCase();

        const cutsThisManyTimes =
          specialCutsiteFilterOptions[value] &&
          specialCutsiteFilterOptions[value].cutsThisManyTimes;
        if (value === "type2s") {
          Object.keys(this.cutsites.cutsitesByName).forEach((key) => {
            if (hiddenEnzymesByName[key]) return; //don't show that cutsite
            if (
              this.cutsites.cutsitesByName[key].length &&
              this.cutsites.cutsitesByName[key][0]?.restrictionEnzyme?.isType2S
            ) {
              cutSiteList.push(key);
              returnVal.cutsitesByName[key] = this.cutsites.cutsitesByName[key];
            }
          });
        } else if (cutsThisManyTimes > 0) {
          //the cutter type is either 9,2,3 for single, double or triple cutters
          Object.keys(this.cutsites.cutsitesByName).forEach((key) => {
            if (hiddenEnzymesByName[key]) return; //don't show that cutsite
            if (
              this.cutsites.cutsitesByName[key].length === cutsThisManyTimes
            ) {
              cutSiteList.push(key);
              returnVal.cutsitesByName[key] = this.cutsites.cutsitesByName[key];
            }
          });
        } else {
          if (hiddenEnzymesByName[lowerValue]) return; //don't show that cutsite
          //normal enzyme ('BamHI')
          if (!this.cutsites.cutsitesByName[lowerValue]) return;
          cutSiteList.push(lowerValue);
          returnVal.cutsitesByName[lowerValue] =
            this.cutsites.cutsitesByName[lowerValue];
        }
      });
    }

    const enzymeCounts = {};
    cutSiteList.forEach(
      (enzyme) =>
        (enzymeCounts[enzyme] = enzymeCounts[enzyme]
          ? enzymeCounts[enzyme] + 1
          : 1)
    );

    const intersectionCutSites = [];
    Object.keys(enzymeCounts).forEach((key) => {
      if (enzymeCounts[key] === groupCount) intersectionCutSites.push(key);
    });

    returnVal.cutsiteIntersectionCount = intersectionCutSites.length;

    const cutsbyname_AND = {};
    intersectionCutSites.forEach((value) => {
      cutsbyname_AND[value] = this.cutsites.cutsitesByName[value];
    });

    returnVal.cutsiteTotalCount = Object.keys(returnVal.cutsitesByName).length;

    if (this.isEnzymeFilterAnd && returnVal.cutsiteIntersectionCount > 0) {
      returnVal.cutsitesByName = cutsbyname_AND;
    }

    returnVal.cutsitesArray = flatMap(
      returnVal.cutsitesByName,
      (cutsitesByNameArray) => cutsitesByNameArray
    );
    returnVal.cutsitesById = returnVal.cutsitesArray.reduce((obj, item) => {
      if (item && item.id) {
        obj[item.id] = item;
      }
      return obj;
    }, {});
    return returnVal;
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
  // get annotationToAdd() {
  //   let annotationToAdd;
  // [
  //   ["AddOrEditFeatureDialog", "filteredFeatures", "features"],
  //   ["AddOrEditPrimerDialog", "primers", "primers"],
  //   ["AddOrEditPartDialog", "filteredParts", "parts"]
  // ].forEach(([n, type, annotationTypePlural]) => {
  //   const vals = getFormValues(n)(state);
  //   if (vals) {
  //     annotationToAdd = {
  //       color: getFeatureToColorMap({ includeHidden: true })[
  //         vals.type || "primer_bind"
  //       ], //we won't have the correct color yet so we set it here
  //       ...vals,
  //       formName: n,
  //       type,
  //       annotationTypePlural,
  //       name: vals.name || "Untitled"
  //     };
  //     if (!vals.useLinkedOligo) {
  //       delete annotationToAdd.bases;
  //     }
  //   }
  // });

  //   if (annotationToAdd) {
  //     const selectionLayer = convertRangeTo0Based(annotationToAdd);
  //     delete selectionLayer.color;
  //     const id = annotationToAdd.id || "tempId123";
  //     const name = annotationToAdd.name || "";
  //     const anns = keyBy(sequenceDataToUse[annotationToAdd.type], "id");
  //     let toSpread = {};
  //     if (
  //       annotationToAdd.annotationTypePlural === "features" &&
  //       allowMultipleFeatureDirections &&
  //       annotationToAdd.arrowheadType !== undefined
  //     ) {
  //       toSpread = {
  //         forward: annotationToAdd.arrowheadType !== "BOTTOM",
  //         arrowheadType: annotationToAdd.arrowheadType
  //       };
  //     }
  //     anns[id] = {
  //       ...annotationToAdd,
  //       id,
  //       name,
  //       ...selectionLayer,
  //       ...(annotationToAdd.bases && {
  //         // ...getStartEndFromBases({ ...annotationToAdd, sequenceLength }),
  //         fullSeq: sequenceData.sequence
  //       }),
  //       ...toSpread,
  //       locations: annotationToAdd.locations
  //         ? annotationToAdd.locations.map(convertRangeTo0Based)
  //         : undefined
  //     };
  //     sequenceDataToUse[annotationToAdd.type] = anns;
  //     toReturn.selectionLayer = selectionLayer;
  //   }
  // }

  async updateCircular(isCircular) {
    if (!isCircular && hasAnnotationThatSpansOrigin(this.sequenceData)) {
      const doAction = await showConfirmationDialog({
        intent: Intent.DANGER, //applied to the right most confirm button
        confirmButtonText: "Truncate Annotations",
        canEscapeKeyCancel: true, //this is false by default
        text: "Careful! Origin spanning annotations will be truncated. Are you sure you want to make the sequence linear?"
      });
      if (!doAction) return; //stop early
      this.isBatchUndo = true;
      truncateOriginSpanningAnnotations(this.sequenceData);
    }
    this.isCircular = isCircular;
    this.isBatchUndo = false;
  }
  isBatchUndo = false;

  defaultLinkedOligoMessage = undefined;
  allowMultipleFeatureDirections = undefined;
  getAdditionalEditAnnotationComps = undefined;
  getAdditionalCreateOpts = undefined;
  getLinkedOligoLink = undefined;
  additionalTopRightToolbarButtons = undefined;
  getCustomAutoAnnotateList = undefined;
  allowPartsToOverlapSelf = undefined;
  allowPrimerBasesToBeEdited = undefined;
  truncateLabelsThatDoNotFit = undefined;
  smartCircViewLabelRender = undefined;
  onConfigureFeatureTypesClick = undefined;
  allPartTags = undefined;
  editTagsLink = undefined;
  readOnly = undefined;
  shouldAutosave = undefined;
  hideSingleImport = undefined;
  beforeAnnotationCreate = undefined;
  disableSetReadOnly = undefined;
  showReadOnly = undefined;
  showCircularity = undefined;
  onHiddenEnzymeAdd = undefined;
  showMoleculeType = undefined;
  showAvailability = undefined;
  showCicularViewInternalLabels = undefined;
  showGCContentByDefault = undefined;
  GCDecimalDigits = undefined;
  onlyShowLabelsThatDoNotFit = undefined;
  fullscreenMode = undefined;
  maxAnnotationsToDisplay = undefined;
  onNew = undefined;
  onImport = undefined;
  onSave = undefined;
  onSaveAs = undefined;
  alwaysAllowSave = undefined;
  generatePng = undefined;
  onRename = undefined;
  getVersionList = undefined;
  getSequenceAtVersion = undefined;
  onDuplicate = undefined;
  onSelectionOrCaretChanged = undefined;
  beforeSequenceInsertOrDelete = undefined;
  enzymeManageOverride = undefined;
  enzymeGroupsOverride = undefined;
  _additionalEnzymes = undefined;
  onDelete = undefined;
  onCopy = undefined;
  autoAnnotateFeatures = undefined;
  autoAnnotateParts = undefined;
  autoAnnotatePrimers = undefined;
  onCreateNewFromSubsequence = undefined;
  onPreviewModeFullscreenClose = undefined;
  onPaste = undefined;
  menuFilter = undefined;
  propertiesList = [
    "general",
    "features",
    "parts",
    "primers",
    "translations",
    "cutsites",
    "orfs",
    "genbank"
  ];
  exportSequenceToFile(format) {
    let convert, fileExt;

    if (format === "genbank") {
      convert = jsonToGenbank;
      fileExt = "gb";
    } else if (format === "genpept") {
      convert = jsonToGenbank;
      fileExt = "gp";
    } else if (format === "teselagenJson") {
      convert = jsonToJson;
      fileExt = "json";
    } else if (format === "fasta") {
      convert = jsonToFasta;
      fileExt = "fasta";
    } else {
      console.error(`Invalid export format: '${format}'`); // dev error
      return;
    }
    const blob = new Blob([convert(this.sequenceData)], { type: "text/plain" });
    const filename = `${
      this.sequenceData.name || "Untitled_Sequence"
    }.${fileExt}`;
    FileSaver.saveAs(blob, filename);
    window.toastr.success("File Downloaded Successfully");
  }

  upsertTranslation() {
    return async (translationToUpsert) => {
      if (!translationToUpsert) return;
      const { sequenceData } = this;
      if (
        !translationToUpsert.id &&
        some(sequenceData.translations || [], (existingTranslation) => {
          if (
            //check if an identical existingTranslation exists already
            existingTranslation.translationType === "User Created" &&
            existingTranslation.start === translationToUpsert.start &&
            existingTranslation.end === translationToUpsert.end &&
            !!translationToUpsert.forward === !!existingTranslation.forward
          ) {
            return true;
          }
        })
      ) {
        const doAction = await showConfirmationDialog({
          // intent: Intent.DANGER, //applied to the right most confirm button
          confirmButtonText: "Create Translation",
          canEscapeKeyCancel: true, //this is false by default
          text: "This region has already been translated. Are you sure you want to make another translation for it?"
        });
        if (!doAction) return; //stop early
      }
      this.translations.push(translationToUpsert);
    };
  }

  async handleSave(opts = {}) {
    const {
      onSave,
      onSaveAs,
      generatePng,
      readOnly,
      alwaysAllowSave,
      sequenceData,
      lastSavedIdUpdate
    } = this;
    const saveHandler = opts.isSaveAs ? onSaveAs || onSave : onSave;

    const updateLastSavedIdToCurrent = () => {
      lastSavedIdUpdate(sequenceData.stateTrackingId);
    };

    // Optionally generate png
    if (generatePng) {
      opts.pngFile = await generatePngFromPrintDialog();
    }

    // TODO: pass additionalProps (blob or error) to the user
    const promiseOrVal =
      (!readOnly || alwaysAllowSave || opts.isSaveAs) &&
      saveHandler &&
      saveHandler(
        opts,
        tidyUpSequenceData(sequenceData, { annotationsAsObjects: true }),
        this,
        updateLastSavedIdToCurrent
      );

    if (promiseOrVal && promiseOrVal.then) {
      return promiseOrVal.then(updateLastSavedIdToCurrent);
    }
  }
  async importSequenceFromFile(file, opts = {}) {
    const { onImport } = this;
    const result = await anyToJson(file, { acceptParts: true, ...opts });
    // TODO maybe handle import errors/warnings better
    const failed = !result[0].success;
    const messages = result[0].messages;
    if (isArray(messages)) {
      messages.forEach((msg) => {
        const type = msg.substr(0, 20).toLowerCase().includes("error")
          ? failed
            ? "error"
            : "warning"
          : "info";
        window.toastr[type](msg);
      });
    }
    if (failed) {
      window.toastr.error(
        "Error importing sequence(s). See console for more errors"
      );
      console.error(`Seq import results:`, result);
    } else if (result.length > 1) {
      showDialog({
        dialogType: "MultipleSeqsDetectedOnImportDialog",
        props: {
          finishDisplayingSeq,
          results: result
        }
      });
    } else {
      finishDisplayingSeq(result[0].parsedSequence);
    }
    const finishDisplayingSeq = async (seqData) => {
      if (onImport) {
        seqData = await onImport(seqData);
      }

      if (seqData) {
        seqData.stateTrackingId = shortid();
        this.updateEditor({ sequenceData: seqData });
        this.panelsShown.flipActiveTabFromLinearOrCircularIfNecessary(
          seqData.circular
        );

        window.toastr.success("Sequence Imported");
      }
    };
  }
  isRna = false;
  isOligo = false;
  isProtein = false;
  get isDna() {
    return !this.isOligo && !this.isRna && !this.isProtein;
  }
  get isAlreadyProteinEditor() {
    return this.isProtein || this.isRna || this.isOligo;
  }
  updateEditor(initialVals) {
    const {
      justPassingPartialSeqData,
      sequenceData,
      annotationVisibility,
      annotationsToSupport,
      convertAnnotationsFromAAIndices
    } = initialVals;
    const { findTool, isAlreadyProteinEditor } = this;

    let toSpread = {};
    let payload;
    if (justPassingPartialSeqData) {
      payload = {
        sequenceData: tidyUpSequenceData(
          { ...this.sequenceData, ...sequenceData },
          {
            convertAnnotationsFromAAIndices,
            //if we have sequence data coming in make sure to tidy it up for the user :)
            annotationsAsObjects: true
          }
        )
      };
    } else {
      if (sequenceData) {
        if (sequenceData.isProtein && !isAlreadyProteinEditor) {
          //we're editing a protein but haven't initialized the protein editor yet
          toSpread = {
            findTool: {
              dnaOrAA: "AA",
              ...findTool //we spread this here to allow the user to override this .. if they must!
            },

            annotationVisibility: {
              caret: true,
              ...annotationVisibility, //we spread this here to allow the user to override this .. if they must!
              sequence: false,
              reverseSequence: false,
              cutsites: false,
              translations: false,
              aminoAcidNumbers: false,
              primaryProteinSequence: true
            },
            annotationsToSupport: {
              features: true,
              translations: false,
              primaryProteinSequence: true,
              parts: true,
              orfs: false,
              cutsites: false,
              primers: false,
              ...annotationsToSupport
            }
          };
        } else if (sequenceData.isOligo && !this.isOligo) {
          toSpread = {
            findTool: {
              dnaOrAA: "DNA",
              ...findTool //we spread this here to allow the user to override this .. if they must!
            },
            annotationVisibility: {
              caret: true,
              ...annotationVisibility, //we spread this here to allow the user to override this .. if they must!
              sequence: true,
              cutsites: false,
              reverseSequence: false,
              translations: false,
              aminoAcidNumbers: false,
              primaryProteinSequence: false
            },
            annotationsToSupport: {
              features: true,
              translations: true,
              primaryProteinSequence: false,
              parts: true,
              orfs: false,
              cutsites: true,
              primers: false,
              ...annotationsToSupport //we spread this here to allow the user to override this .. if they must!
            }
          };
        } else if (sequenceData.isRna && !this.isRna) {
          toSpread = {
            findTool: {
              dnaOrAA: "DNA",
              ...findTool //we spread this here to allow the user to override this .. if they must!
            },
            annotationVisibility: {
              caret: true,
              ...annotationVisibility, //we spread this here to allow the user to override this .. if they must!
              sequence: true,
              cutsites: false,
              reverseSequence: false,
              translations: false,
              aminoAcidNumbers: false,
              primaryProteinSequence: false
            },
            annotationsToSupport: {
              features: true,
              translations: true,
              primaryProteinSequence: false,
              parts: true,
              orfs: true,
              cutsites: true,
              primers: true,
              ...annotationsToSupport //we spread this here to allow the user to override this .. if they must!
            }
          };
        } else if (this.isAlreadySpecialEditor && this.isDna) {
          //we're editing dna but haven't initialized the dna editor yet
          sequenceData.isProtein = false;
          toSpread = {
            findTool: {
              dnaOrAA: "DNA",
              ...findTool //we spread this here to allow the user to override this .. if they must!
            },
            annotationVisibility: {
              caret: true,
              ...annotationVisibility, //we spread this here to allow the user to override this .. if they must!
              sequence: true,
              reverseSequence: true,
              translations: false,
              aminoAcidNumbers: false,
              primaryProteinSequence: false
            },
            annotationsToSupport: {
              features: true,
              translations: true,
              primaryProteinSequence: false,
              parts: true,
              orfs: true,
              cutsites: true,
              primers: true,
              ...annotationsToSupport //we spread this here to allow the user to override this .. if they must!
            }
          };
        }
      }
      payload = {
        ...initialVals,
        ...toSpread,
        ...(sequenceData && {
          sequenceData: tidyUpSequenceData(sequenceData, {
            convertAnnotationsFromAAIndices,
            //if we have sequence data coming in make sure to tidy it up for the user :)
            annotationsAsObjects: true
          })
        })
      };
    }
    annotationTypes.forEach((t) => {
      if (Object.keys(sequenceData?.[t] || {}).length > 100) {
        set(payload, `annotationLabelVisibility.${t}`, false);
      }
    });
    if (sequenceData && sequenceData.size > 20000) {
      set(payload, "annotationVisibility.translations", false);
      set(payload, "annotationVisibility.cutsites", false);
    }

    this.updateSequenceData({ sequenceData: payload });
  }

  propertiesViewTabUpdate(propertiesTabId) {
    this.propertiesTabId = propertiesTabId;
  }
  propertiesTabId = "general";
  selectedAnnotationId = undefined;
  selectedAnnotationIdUpdate(selectedAnnotationOrAnnotationId) {
    this.selectedAnnotationId = selectedAnnotationOrAnnotationId;
  }
  initializeSeqData({ sequenceData }) {
    this.updateSequenceData({ sequenceData });
    this.initializeSequenceDataHistory();
  }
  //add additional "computed handlers here"
  selectAll() {
    const { sequenceLength, selectionLayerUpdate } = this;
    sequenceLength > 0 &&
      selectionLayerUpdate({
        start: 0,
        end: sequenceLength - 1
      });
  }
  // deleteFeature tnwtodo //add these handlers
  // upsertFeature
  handleNewAnnotation(type) {
    const { readOnly, selectionLayer, caretPosition, sequenceData } = this;

    if (readOnly) {
      window.toastr.warning(
        `Sorry, Can't Create New ${type}s in Read-Only Mode`
      );
    } else {
      const rangeToUse =
        selectionLayer.start > -1
          ? { ...selectionLayer, id: undefined }
          : caretPosition > -1
          ? {
              start: caretPosition,
              end: sequenceData.isProtein ? caretPosition + 2 : caretPosition
            }
          : {
              start: 0,
              end: sequenceData.isProtein ? 2 : 0
            };
      showAddOrEditAnnotationDialog({
        type: type.toLowerCase(),
        annotation: {
          ...rangeToUse,
          forward: !(selectionLayer.forward === false)
        }
      });
    }
  }
  handleNewPart() {
    this.handleNewAnnotation("Part");
  }
  handleNewFeature() {
    this.handleNewAnnotation("Feature");
  }
  handleNewPrimer() {
    this.handleNewAnnotation("Primer");
  }
  handleRotateToCaretPosition() {
    const {
      caretPosition,
      readOnly,
      sequenceData,
      updateSequenceData,
      caretPositionUpdate
    } = this;
    if (readOnly) {
      return;
    }
    if (caretPosition < 0) return;
    updateSequenceData({
      sequenceData: rotateSequenceDataToPosition(sequenceData, caretPosition)
    });
    caretPositionUpdate(0);
  }

  insertSequenceDataAtPositionOrRange(...a) {
    const {
      sequenceDataToInsert,
      existingSequenceData,
      caretPositionOrRange,
      options
    } = this.beforeSequenceInsertOrDelete(...a);
    return insertSequenceDataAtPositionOrRange(
      sequenceDataToInsert,
      existingSequenceData,
      caretPositionOrRange,
      options
    );
  }

  handleReverseComplementSelection() {
    const {
      sequenceData,
      updateSequenceData,
      insertSequenceDataAtPositionOrRange,
      selectionLayer
    } = this;
    if (!(selectionLayer.start > -1)) {
      return; //return early
    }
    const reversedSeqData = getReverseComplementSequenceAndAnnotations(
      sequenceData,
      {
        range: selectionLayer
      }
    );
    const [newSeqData] = insertSequenceDataAtPositionOrRange(
      reversedSeqData,
      sequenceData,
      selectionLayer,
      {
        maintainOriginSplit: true
      }
    );
    updateSequenceData({ sequenceData: newSeqData });
  }

  handleComplementSelection() {
    const {
      sequenceData,
      updateSequenceData,
      selectionLayer,
      insertSequenceDataAtPositionOrRange
    } = this;
    if (!(selectionLayer.start > -1)) {
      return; //return early
    }
    const comp = getComplementSequenceAndAnnotations(sequenceData, {
      range: selectionLayer
    });
    const [newSeqData] = insertSequenceDataAtPositionOrRange(
      comp,
      sequenceData,
      selectionLayer,
      {
        maintainOriginSplit: true
      }
    );
    updateSequenceData({ sequenceData: newSeqData });
  }

  handleReverseComplementSequence() {
    const { sequenceData, updateSequenceData } = this;
    updateSequenceData({
      sequenceData: getReverseComplementSequenceAndAnnotations(sequenceData)
    });
    window.toastr.success("Reverse Complemented Sequence Successfully");
  }
  updateSequenceData({ sequenceData }) {
    forEach(sequenceData, (v, k) => {
      this[k] = v;
    });
  }

  handleComplementSequence() {
    const { sequenceData, updateSequenceData } = this;
    updateSequenceData({
      sequenceData: getComplementSequenceAndAnnotations(sequenceData)
    });
    window.toastr.success("Complemented Sequence Successfully");
  }
  handleInverse() {
    const {
      sequenceLength,
      selectionLayer,
      caretPosition,
      selectionLayerUpdate,
      caretPositionUpdate
    } = this;

    if (sequenceLength <= 0) {
      return false;
    }
    if (selectionLayer.start > -1) {
      if (getRangeLength(selectionLayer, sequenceLength) === sequenceLength) {
        caretPositionUpdate(selectionLayer.start);
      } else {
        selectionLayerUpdate(invertRange(selectionLayer, sequenceLength));
      }
    } else {
      if (caretPosition > -1) {
        selectionLayerUpdate(
          normalizeRange(
            {
              start: caretPosition,
              end: caretPosition - 1
            },
            sequenceLength
          )
        );
      } else {
        selectionLayerUpdate({
          start: 0,
          end: sequenceLength - 1
        });
      }
    }
  }
}

// const ed = new EditorStore({});
// // ed.digestTool.selectedFragment

// autorun(() => {
//   console.log("someData:", ed.c.d);
// });

// ed.c.b = "weee";
// ed.sequence = "gaga";

// ed.primers = []
// ed.primers = []
// ed.primers = []
// ed.primers = []
// ed.parts = []
// ed.parts = []
// ed.parts = []
// ed.parts = []

// //
// //

// // ed.features[0] = "asdf";

const jsonToJson = (incomingJson) => {
  return JSON.stringify(
    omit(
      cleanUpTeselagenJsonForExport(
        tidyUpSequenceData(incomingJson, { annotationsAsObjects: false })
      ),
      [
        "sequenceFragments",
        "sequenceFeatures",
        "cutsites",
        "orfs",
        "filteredParts",
        "filteredFeatures"
      ]
    )
  );
};
