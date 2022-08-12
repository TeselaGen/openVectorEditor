import { startCase } from "lodash";
import pluralize from "pluralize";
import React, { useEffect, useState } from "react";
import { compose } from "react-recompose";
import {
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
import {
  featureColors,
  FeatureTypes,
  convertApELikeRegexToRegex,
  autoAnnotate,
  tidyUpAnnotation
} from "ve-sequence-utils";
import shortid from "shortid";

window.addOnGlobals = {
  tidyUpAnnotation,
  wrapDialog,
  withEditorProps,
  reduxForm,
  shortid,
  FileUploadField,
  Colors,
  Tab,
  Tabs,
  convertApELikeRegexToRegex,
  autoAnnotate,
  SubmissionError,
  featureColors,
  FeatureTypes,
  InfoHelper,
  showConfirmationDialog,
  showDialog,
  DialogFooter,
  useState,
  startCase,
  compose,
  hideDialog,
  typeField,
  pluralize,
  React,
  useEffect,
  DataTable,
  withSelectedEntities,
  withSelectTableRecords
};
