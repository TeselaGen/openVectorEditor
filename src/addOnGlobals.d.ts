import { startCase } from "lodash";
import * as pluralize from "pluralize";
import React, { useEffect, useState } from "react";
import { compose } from "recompose";
import type {
  DataTable,
  DialogFooter,
  withSelectedEntities,
  withSelectTableRecords
} from "teselagen-react-components";
import { hideDialog } from "./GlobalDialogUtils";
import { typeField } from "./helperComponents/PropertiesDialog/typeField";

import {
  FileUploadField,
  InfoHelper,
  showConfirmationDialog,
  wrapDialog
} from "teselagen-react-components";

import { showDialog } from "./GlobalDialogUtils";
import withEditorProps from "./withEditorProps";
import { Colors, Tab, Tabs } from "@blueprintjs/core";
import { reduxForm, SubmissionError } from "redux-form";
import shortid from "shortid";

import {
  getReverseComplementSequenceString, bioData, convertApELikeRegexToRegex,
  autoAnnotate,
} from "ve-sequence-utils";

type AddOnGlobals = {
  wrapDialog: wrapDialog,
  withEditorProps: withEditorProps,
  reduxForm: reduxForm,
  shortid: shortid,
  FileUploadField: FileUploadField,
  Colors: Colors,
  Tab: Tab,
  Tabs: Tabs,
  SubmissionError: SubmissionError,
  featureColors: featureColors,
  FeatureTypes: FeatureTypes,
  InfoHelper: InfoHelper,
  showConfirmationDialog: showConfirmationDialog,
  showDialog: showDialog,
  DialogFooter: DialogFooter,
  useState: useState,
  startCase: startCase,
  compose: compose,
  hideDialog: hideDialog,
  typeField: typeField,
  pluralize: pluralize,
  React: React,
  useEffect: useEffect,
  DataTable: DataTable,
  withSelectedEntities: withSelectedEntities,
  withSelectTableRecords: withSelectTableRecords,
}
export global {
  interface Window {
    addOnGlobals: AddOnGlobals;
  }
}