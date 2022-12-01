/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-throw-literal */
import { unparse } from "papaparse";
import CreateAnnotationsPage from "./CreateAnnotationsPage";
import { formName } from "./constants";
import { AutoAnnotateBpMatchingDialog } from "./AutoAnnotateBpMatchingDialog";
import {
  parseCsvFile,
  validateCSVRequiredHeaders,
  validateCSVRow
} from "./fileUtils";
import downloadjs from "downloadjs";
import { convertProteinSeqToDNAIupac } from "ve-sequence-utils";

const {
  shortid,
  FileUploadField,
  Colors,
  Tab,
  Tabs,
  pluralize,
  reduxForm,
  SubmissionError,
  getFeatureToColorMap,
  getFeatureTypes,
  InfoHelper,
  showConfirmationDialog,
  wrapDialog,
  showDialog,
  withEditorProps,
  DialogFooter,
  useState,
  hideDialog,
  startCase,
  compose,
  React,
  convertApELikeRegexToRegex,
  autoAnnotate,
  useEffect,
  DataTable,
  typeField
} = window.addOnGlobals;

export function autoAnnotateFeatures() {
  showDialog({
    ModalComponent: AutoAnnotateModal, //we want to use a ModalComponent here so our addon does not
    props: {
      annotationType: "feature"
    }
  });
}
export function autoAnnotateParts() {
  showDialog({
    ModalComponent: AutoAnnotateModal, //we want to use a ModalComponent here so our addon does not
    props: {
      annotationType: "part"
    }
  });
}
export function autoAnnotatePrimers() {
  showDialog({
    ModalComponent: AutoAnnotateModal, //we want to use a ModalComponent here so our addon does not
    props: {
      annotationType: "primer"
    }
  });
}

export const AutoAnnotateModal = compose(
  wrapDialog((p) => ({
    canEscapeKeyClose: false,
    title: `Auto Annotate ${startCase(pluralize(p.annotationType))}`
  })),
  withEditorProps,
  reduxForm({ form: formName })
)((props) => {
  const {
    sequenceData,
    handleSubmit,
    annotationType = "feature",
    error,
    getCustomAutoAnnotateList
  } = props;
  const [fileType, setSelectedImportType] = useState("csvFile");
  const [newAnnotations, setNewAnns] = useState(false);
  const [customAnnResponse, setCustomAnnResponse] = useState();
  const [loadingCustomAnnList, setLoadingCustomAnnList] = useState();
  useEffect(() => {
    (async () => {
      if (getCustomAutoAnnotateList) {
        setLoadingCustomAnnList(true);
        try {
          const anns = await getCustomAutoAnnotateList(props);
          setCustomAnnResponse(anns);
        } catch (e) {
          window.toastr.warning("Error loading custom annotation list");
          console.error(`e:`, e);
        } finally {
          setLoadingCustomAnnList(false);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (newAnnotations) {
    return (
      <CreateAnnotationsPage
        {...props}
        newAnnotations={newAnnotations}
      ></CreateAnnotationsPage>
    );
  }
  return (
    <div className="bp3-dialog-body">
      <Tabs
        renderActiveTabPanelOnly
        onChange={setSelectedImportType}
        selectedTabId={fileType}
      >
        <Tab
          panel={
            <div>
              <div>
                Select a CSV file (
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
                        isRegex: false,
                        matchType: "dna"
                      },
                      {
                        name: `Example Protein ${startCase(annotationType)}`,
                        description: "I'm a description",
                        sequence: `APGSGTGGGSGSAPG`,
                        ...(annotationType === "feature" && {
                          type: `cds`
                        }),
                        isRegex: false,
                        matchType: "protein"
                      },
                      {
                        name: `Example ${startCase(annotationType)} 2`,
                        description: "I'm another description",
                        sequence: `gat.*tacccc.*aggttt`,
                        ...(annotationType === "feature" && {
                          type: `cds`
                        }),
                        isRegex: true,
                        matchType: "dna"
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
                ) with the following columns:<br></br>
                <br></br>
                <div style={{ display: "flex" }}>
                  name,description,sequence,type,
                  <span style={{ display: "flex" }}>
                    isRegex &nbsp;
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
                  </span>
                  ,matchType
                </div>
                <br></br>
                {annotationType !== "feature" && (
                  <React.Fragment>
                    <i>Note: the "type" column is optional</i>
                    <br></br>
                  </React.Fragment>
                )}
              </div>
              <FileUploadField
                validateAgainstSchema={validateAgainstSchema}
                name="csvFile"
                fileLimit={1}
                isRequired
                accept=".csv"
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
                name="apeFile"
                isRequired
                accept=".txt"
              ></FileUploadField>
              {error && (
                <div style={{ padding: 5, color: Colors.RED1 }}>{error}</div>
              )}
            </div>
          }
          id="apeFile"
          title="ApE File"
        ></Tab>
        {getCustomAutoAnnotateList &&
          (loadingCustomAnnList ? (
            <Tab disabled title="Loading..."></Tab>
          ) : (
            customAnnResponse &&
            customAnnResponse.list && (
              <Tab
                id="implementerDefined"
                title={customAnnResponse.title || "Custom List"}
                panel={
                  customAnnResponse.list.length ? (
                    <div>
                      <DataTable
                        isInfinite
                        schema={
                          annotationType === "feature"
                            ? customAnnsSchema
                            : customAnnsSchemaNoType
                        }
                        entities={customAnnResponse.list}
                      ></DataTable>
                    </div>
                  ) : (
                    <div>No Annotations Found</div>
                  )
                }
              ></Tab>
            )
          ))}
      </Tabs>
      <DialogFooter
        hideModal={hideDialog}
        disabled={
          fileType === "implementerDefined" &&
          !(
            customAnnResponse &&
            customAnnResponse.list &&
            customAnnResponse.list.length
          )
        }
        onClick={handleSubmit(async ({ apeFile, csvFile }) => {
          let convertNonStandardTypes = false;
          const annsToCheck = [];
          try {
            const validateRow = async (row, rowName) => {
              const { type = "", sequence } = row;
              let regexConvertedSeq;

              if (annotationType === "feature") {
                const cleanedType = getFeatureTypes().find(
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
            if (fileType === "implementerDefined") {
              for (const [
                // eslint-disable-next-line no-unused-vars
                i,
                // eslint-disable-next-line no-unused-vars
                { name, sequence, matchType, type, isRegex }
              ] of customAnnResponse.list.entries()) {
                await validateRow(
                  {
                    name,
                    sequence,
                    matchType,
                    type,
                    isRegex: isRegex ? "TRUE" : "FALSE"
                  },
                  `Row ${i + 1} (${name})`
                );
              }
            } else if (fileType === "csvFile") {
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

              // eslint-disable-next-line no-unused-vars
              for (const [index, row] of data.entries()) {
                const error = validateCSVRow(row, csvHeaders, index);
                if (error) {
                  throw {
                    validationError: error
                  };
                }
                await validateRow(row, `Row ${index + 1} (${row.name})`);
              }
            } else if (fileType === "apeFile") {
              const { data } = await parseCsvFile(apeFile[0], {
                header: false
              });
              // eslint-disable-next-line no-unused-vars
              for (const [i, [name, sequence, type]] of data.entries()) {
                await validateRow(
                  { name, sequence, type },
                  `Row ${i + 1} (${name})`
                );
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
              if (ann.matchType === "protein") {
                ann.sequence = convertProteinSeqToDNAIupac(ann.sequence);
              }
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
                  toRet.color =
                    toRet.color || getFeatureToColorMap()[toRet.type];
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

if (!window._ove_addons) window._ove_addons = {};
window._ove_addons.autoAnnotateFeatures = autoAnnotateFeatures;
window._ove_addons.autoAnnotateParts = autoAnnotateParts;
window._ove_addons.autoAnnotatePrimers = autoAnnotatePrimers;

const customAnnsSchema = ["name", "sequence", typeField, "isRegex"];
const customAnnsSchemaNoType = ["name", "sequence", typeField, "isRegex"];

const validateAgainstSchema = {
  fields: [
    {
      path: "name",
      type: "string",
      isRequired: true
    },
    {
      path: "description",
      type: "string"
    },
    {
      path: "sequence",
      type: "string",
      isRequired: true
    },
    {
      path: "type",
      type: "dropdown",
      values: getFeatureTypes(),
      defaultValue: "misc_feature"
    },
    {
      path: "isRegex",
      type: "boolean"
    },
    {
      path: "matchType",
      type: "dropdown",
      defaultValue: "dna",
      values: ["dna", "protein"]
    }
  ]
};
