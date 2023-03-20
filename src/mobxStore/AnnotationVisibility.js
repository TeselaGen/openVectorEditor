import { omit } from "lodash";
import { makeAutoObservable } from "mobx";

export default class AnnotationVisibility {
  constructor() {
    makeAutoObservable(this);
  }
  featureTypesToHide = {};
  featureIndividualToHide = {};
  partIndividualToHide = {};
  featureLengthsToHide;
  features = true;
  warnings = true;
  assemblyPieces = true;
  chromatogram = true;
  lineageAnnotations = true;
  translations = true;
  parts = true;
  orfs = false;
  orfTranslations = false;
  cdsFeatureTranslations = true;
  axis = true;
  cutsites = true;
  cutsitesInSequence = true;
  primers = true;
  dnaColors = false;
  sequence = true;
  reverseSequence = true;
  fivePrimeThreePrimeHints = true;
  axisNumbers = true;

  resetPartIndividualToHide() {
    this.partIndividualToHide = {};
  }

  showPartIndividual(payload) {
    this.partIndividualToHide = omit(this.partIndividualToHide, payload);
  }

  hidePartIndividual(payload) {
    this.featureIndividualToHide = {
      ...this.featureIndividualToHide,
      ...payload.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    };
  }

  resetFeatureIndividualToHide() {
    this.featureIndividualToHide = {};
  }

  showFeatureIndividual(payload) {
    this.featureIndividualToHide = omit(this.featureIndividualToHide, payload);
  }

  hideFeatureIndividual(payload) {
    this.featureIndividualToHide = {
      ...this.featureIndividualToHide,
      ...payload.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    };
  }

  resetFeatureTypesToHide() {
    this.featureIndividualToHide = {};
  }

  showFeatureTypes(payload) {
    this.featureTypesToHide = omit(this.featureTypesToHide, payload);
  }

  hideFeatureTypes(payload) {
    this.featureTypesToHide = {
      ...this.featureTypesToHide,
      ...payload.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    };
  }

  annotationVisibilityToggle(payload) {
    this[payload] = !this[payload];
    this.orfTranslations =
      payload === "orfs" && this.orfs === this.orfTranslations
        ? !this.orfTranslations
        : null;
  }

  annotationVisibilityHide(payload) {
    this[payload] = false;
  }

  annotationVisibilityShow(payload) {
    this[payload] = true;
  }

  annotationVisibilityUpdate(payload) {
    this[payload] = {
      ...this,
      ...payload
    };
  }
}
