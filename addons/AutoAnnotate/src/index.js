/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-throw-literal */
import {
  DialogFooter,
  FileUploadField,
  InfoHelper,
  showConfirmationDialog,
  wrapDialog
} from "teselagen-react-components";
import React, { useState } from "react";
import downloadjs from "downloadjs";
import { showDialog } from "../../../src/GlobalDialogUtils";
import { compose } from "recompose";
import { withEditorProps } from "../../../src";
import { Colors, Tab, Tabs } from "@blueprintjs/core";
import { reduxForm, SubmissionError } from "redux-form";
import { autoAnnotate, convertApELikeRegexToRegex } from "./autoAnnotate";
import { featureColors, FeatureTypes } from "ve-sequence-utils";
import {
  parseCsvFile,
  validateCSVRequiredHeaders,
  validateCSVRow
} from "./fileUtils";
import shortid from "shortid";
import { startCase } from "lodash";
import { unparse } from "papaparse";
import CreateAnnotationsPage from "./CreateAnnotationsPage";
import { formName } from "./constants";
import { AutoAnnotateBpMatchingDialog } from "./AutoAnnotateBpMatchingDialog";

export function autoAnnotateFeatures() {
  showDialog({
    ModalComponent: AutoAnnotateModal, //we want to use a ModalComponent here so our addon does not
    props: {
      annotationType: "feature"
    }
  });
}

export const AutoAnnotateModal = compose(
  wrapDialog({ title: "Auto Annotate" }),
  withEditorProps,
  reduxForm({ form: formName })
)((props) => {
  const {
    sequenceData,
    handleSubmit,
    annotationType = "feature",
    error
  } = props;
  const [fileType, setSelectedImportType] = useState("csvFile");
  const [newAnnotations, setNewAnns] = useState(false);
  if (newAnnotations) {
    return (
      <CreateAnnotationsPage
        {...props}
        newAnnotations={newAnnotations}
      ></CreateAnnotationsPage>
    );
  }
  return (
    <div className={"bp3-dialog-body"}>
      <Tabs
        renderActiveTabPanelOnly
        onChange={setSelectedImportType}
        selectedTabId={fileType}
      >
        <Tab
          panel={
            <div>
              <div>
                <InfoHelper
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    showDialog({
                      ModalComponent: AutoAnnotateBpMatchingDialog
                    });
                  }}
                  content={
                    true ? (
                      <span>
                        Any valid regexes allowed. Click for more info about
                        regex matching
                      </span>
                    ) : (
                      `All valid IUPAC bases allowed as well as a couple special characters. Click for more info`
                    )
                  }
                ></InfoHelper>
                Select a CSV file with the following columns -
                name,description,sequence,type,isRegex (
                <a
                  onClick={() => {
                    const rows = [
                      {
                        name: `Example ${startCase(annotationType)} 1`,
                        description: "I'm a description",
                        sequence: `gatNNtacaggttt`,
                        ...(annotationType === "feature" && {
                          type: `cds`
                        }),
                        isRegex: false
                      },
                      {
                        name: `Example ${startCase(annotationType)} 2`,
                        description: "I'm another description",
                        sequence: `gat.*tacccc.*aggttt`,
                        ...(annotationType === "feature" && {
                          type: `cds`
                        }),
                        isRegex: true
                      }
                    ];
                    const csv = unparse(rows);
                    // const blob = new Blob([convert(sequenceData)], { type: "text/plain" });
                    // const filename = `${sequenceData.name || "Untitled_Sequence"}.${fileExt}`;
                    // FileSaver.saveAs(blob, filename);
                    downloadjs(
                      csv,
                      `Example CSV Annotation Upload File.csv`,
                      "text/plain"
                    );
                  }}
                >
                  download example
                </a>
                ):
              </div>
              <FileUploadField
                name={"csvFile"}
                fileLimit={1}
                isRequired
                accept={".csv"}
              ></FileUploadField>
            </div>
          }
          id="csvFile"
          title="CSV"
        ></Tab>
        <Tab
          panel={
            <div>
              <div>
                Select an ApE style features .txt file (
                <a
                  onClick={() => {
                    downloadjs(
                      `T3	ATTAACCCTCACTAAAGGGA	primer_bind	cyan	green	0	0
M13-fwd	TGTAAAACGACGGCCAGT	primer_bind	cyan	green	0	0
FRT	GAAGTTCCTATTCTCTAGAAAGTATAGGAACTTC	misc_recomb	orchid	pink	0	0`,
                      `Example APE Feature List Upload File.txt`,
                      "text/plain"
                    );
                  }}
                >
                  download example
                </a>
                ):
              </div>
              <FileUploadField
                fileLimit={1}
                name={"apeFile"}
                isRequired
                accept={".txt"}
              ></FileUploadField>
              {error && (
                <div style={{ padding: 5, color: Colors.RED1 }}>{error}</div>
              )}
            </div>
          }
          id="apeFile"
          title="ApE File"
        ></Tab>
      </Tabs>
      <DialogFooter
        onClick={handleSubmit(async ({ apeFile, csvFile }) => {
          let convertNonStandardTypes = false;
          const annsToCheck = [];
          try {
            const validateRow = async (row, rowName) => {
              const { type = "", sequence } = row;
              let regexConvertedSeq;

              if (annotationType === "feature") {
                const cleanedType = FeatureTypes.find(
                  (t) => t.toLowerCase() === type.toLowerCase()
                );
                if (!cleanedType) {
                  if (!convertNonStandardTypes) {
                    convertNonStandardTypes = await showConfirmationDialog({
                      cancelButtonText: "Stop Auto-Annotate",
                      text: `Detected that ${rowName} has a non-standard type of ${type}. We will assign it and all subsequent non-standard types to use the misc_feature type instead`
                    });
                    if (!convertNonStandardTypes) {
                      throw {
                        validationError: `${rowName} specifies the feature type ${type} which is not valid`
                      };
                    }
                  }
                  row.type = "misc_feature";
                } else {
                  row.type = cleanedType;
                }
              }
              if (!sequence) {
                throw {
                  validationError: `${rowName} did not have a sequence`
                };
              }
              if (row.isRegex && row.isRegex.toUpperCase() === "TRUE") {
                try {
                  new RegExp(regexConvertedSeq); //just trying out whether the regexConvertedSeq will work as a valid regex
                } catch (error) {
                  throw {
                    validationError: `${rowName} has an invalid sequence/regex. Please fix it manually.`
                  };
                }
                row.isRegex = true;
              } else {
                row.isRegex = undefined;
              }
              annsToCheck.push(row);
            };
            if (fileType === "csvFile") {
              const csvHeaders = ["name", "description", "sequence"];
              if (annotationType === "feature") {
                csvHeaders.push("type");
              }
              csvHeaders.push("isRegex");
              const {
                data,
                meta: { fields }
              } = await parseCsvFile(csvFile[0]);
              const error = validateCSVRequiredHeaders(fields, csvHeaders);
              if (error) {
                throw {
                  validationError: error
                };
              }

              for (const [index, row] of data.entries()) {
                const error = validateCSVRow(row, csvHeaders, index);
                if (error) {
                  throw {
                    validationError: error
                  };
                }
                await validateRow(row, `Row ${index + 1}`);
              }
            } else if (fileType === "apeFile") {
              const { data } = await parseCsvFile(apeFile[0], {
                header: false
              });
              for (const [i, [name, sequence, type]] of data.entries()) {
                await validateRow({ name, sequence, type }, `Row ${i + 1}`);
              }
            } else {
              console.info(`we shouldn't be here!`);
              console.info(`fileType:`, fileType);
            }

            if (!annsToCheck.length) {
              return window.toastr.warning(
                "No Annotations Detected on File. Please check that your file is in the correct format."
              );
            }
            const annotationsToCheckById = {};
            annsToCheck.forEach((ann) => {
              const id = shortid();
              annotationsToCheckById[id] = {
                ...ann,
                sequence: ann.isRegex
                  ? ann.sequence
                  : convertApELikeRegexToRegex(ann.sequence),
                id
              };
            });

            const seqId = "placeholderId";
            const { [seqId]: newAnns } = autoAnnotate({
              seqsToAnnotateById: {
                [seqId]: { ...sequenceData, id: seqId }
              },
              annotationsToCheckById
            });

            if (newAnns && newAnns.length) {
              setNewAnns(
                newAnns.map((a) => {
                  const toRet = {
                    ...annotationsToCheckById[a.id],
                    ...a,
                    forward: a.strand !== -1,
                    id: shortid()
                  };
                  toRet.color = toRet.color || featureColors[toRet.type];
                  return toRet;
                })
              );
            } else {
              window.toastr.warning(
                `No ${annotationType}s detected on sequence.`
              );
            }
          } catch (error) {
            console.error(`error:`, error);
            if (error.validationError) {
              throw new SubmissionError({ [fileType]: error.validationError });
            } else {
              window.toastr.error(
                `Error annotating ${annotationType}(s). Double check your file to make sure it is valid!`
              );
            }
          }
        })}
        text="Annotate"
      ></DialogFooter>
    </div>
  );
});
