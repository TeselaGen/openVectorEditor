import { startCase } from "lodash";
import pluralize from "pluralize";
import React, { useEffect, useState } from "react";
import { compose } from "recompose";
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
import { Colors, Tab, Tabs } from "@blueprintjs/core";
import { reduxForm, SubmissionError } from "redux-form";
import {
  getFeatureToColorMap,
  getFeatureTypes,
  convertApELikeRegexToRegex,
  autoAnnotate,
  tidyUpAnnotation
} from "ve-sequence-utils";
import shortid from "shortid";

window.addOnGlobals = {
  tidyUpAnnotation,
  wrapDialog,
  reduxForm,
  shortid,
  FileUploadField,
  Colors,
  Tab,
  Tabs,
  convertApELikeRegexToRegex,
  autoAnnotate,
  SubmissionError,
  getFeatureToColorMap,
  getFeatureTypes,
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
