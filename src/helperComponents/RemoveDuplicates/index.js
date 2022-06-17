import React from "react";
import { reduxForm } from "redux-form";

import {
  wrapDialog,
  DataTable,
  withSelectedEntities,
  SwitchField
} from "teselagen-react-components";
import { compose } from "redux";
import { Button, Classes, Popover } from "@blueprintjs/core";
import classNames from "classnames";

import withEditorProps from "../../withEditorProps";
import { forEach, camelCase, startCase } from "lodash";
import { sizeSchema } from "../PropertiesDialog/utils";
import { getRangeLength } from "ve-range-utils";
import tgFormValues from "../../utils/tgFormValues";

const schema = {
  fields: [
    // ...(noColor
    //   ? []
    //   : [
    //       {
    //         path: "color",
    //         type: "string",
    //         render: color => {
    //           return (
    //             <ColorPickerPopover>
    //               <div style={{ height: 20, width: 20, background: color }} />
    //             </ColorPickerPopover>
    //           );
    //         }
    //       }
    //     ]),
    { path: "name", type: "string" },
    // ...(noType ? [] : [{ path: "type", type: "string" }]),
    sizeSchema,
    { path: "strand", type: "string" }
  ]
};

class RemoveDuplicatesDialog extends React.Component {
  state = {
    dups: []
  };
  componentDidMount() {
    this.recomputeDups();
  }

  checkboxStyle = { marginTop: 0, marginBottom: 0 };

  delayedRecomputeDups = () => {
    setTimeout(() => {
      this.recomputeDups();
    });
  };
  recomputeDups = () => {
    const {
      // hideModal,
      type,
      sequenceData = { sequence: "" },
      // handleSubmit,
      sequenceLength,
      ignoreName,
      ignoreStrand,
      ignoreStartAndEnd
      // circular,
      // upsertFeature
    } = this.props;

    const annotations = sequenceData[type];
    const dups = [];
    const seqsHashByStartEndStrandName = {};
    forEach(annotations, (a) => {
      const hash = `${ignoreStartAndEnd ? "" : a.start}&${
        ignoreStartAndEnd ? "" : a.end
      }&${ignoreStrand ? "" : a.strand}&${ignoreName ? "" : a.name}`;
      if (seqsHashByStartEndStrandName[hash]) {
        dups.push({ ...a, size: getRangeLength(a, sequenceLength) });
      } else {
        seqsHashByStartEndStrandName[hash] = true;
      }
    });
    this.setState({ dups });
  };
  render() {
    const { duplicatesToRemoveSelectedEntities, hideModal, type } = this.props;

    const selectedIds = this.state.dups.map((d) => d.id);
    // const sequenceLength = sequenceData.sequence.length;
    // const isCirc = (this.state || {}).circular;
    return (
      <div className={classNames(Classes.DIALOG_BODY, "tg-min-width-dialog")}>
        {/* {dups.map((d) => {
          return <div>

          </div>
        })} */}
        <DataTable
          noPadding
          withCheckboxes
          noFullscreenButton
          // onRowSelect={this.onRowSelect}
          maxHeight={400}
          selectedIds={selectedIds}
          formName="duplicatesToRemove"
          noRouter
          noRowsFoundMessage="No duplicates found"
          compact
          noHeader
          noFooter
          withSearch={false}
          hideSelectedCount
          isInfinite
          schema={schema}
          entities={this.state.dups}
        />
        <div
          style={{
            marginTop: 10,
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Popover
            target={<Button icon="settings" />}
            content={
              <div style={{ padding: 20, maxWidth: 250 }}>
                <div>Ignore These Fields While Finding Duplicates:</div>
                <br></br>
                <SwitchField
                  containerStyle={{ marginBottom: 2 }}
                  //delay the call to recompute dups until redux has had time to update
                  onFieldSubmit={this.delayedRecomputeDups}
                  style={this.checkboxStyle}
                  name="ignoreName"
                  label="Name"
                ></SwitchField>
                <SwitchField
                  containerStyle={{ marginBottom: 2 }}
                  //delay the call to recompute dups until redux has had time to update
                  onFieldSubmit={this.delayedRecomputeDups}
                  style={this.checkboxStyle}
                  name="ignoreStrand"
                  label="Strand"
                ></SwitchField>
                <SwitchField
                  containerStyle={{ marginBottom: 2 }}
                  //delay the call to recompute dups until redux has had time to update
                  onFieldSubmit={this.delayedRecomputeDups}
                  style={this.checkboxStyle}
                  name="ignoreStartAndEnd"
                  label="Start and End"
                ></SwitchField>
              </div>
            }
          ></Popover>

          <Button
            intent="primary"
            onClick={() => {
              this.props[camelCase(`delete_${type}`).slice(0, -1)](
                duplicatesToRemoveSelectedEntities.map((d) => d.id)
              );
              window.toastr.success(
                `Successfully Deleted ${
                  duplicatesToRemoveSelectedEntities.length
                } ${startCase(type)}`
              );
              hideModal();
            }}
            disabled={!(duplicatesToRemoveSelectedEntities || []).length}
          >
            Remove {duplicatesToRemoveSelectedEntities.length} Duplicates
          </Button>
        </div>
      </div>
    );
  }
}

export default compose(
  wrapDialog(),
  withEditorProps,

  withSelectedEntities("duplicatesToRemove"),

  reduxForm({
    form: "RemoveDuplicatesDialog"
  }),
  tgFormValues("ignoreName", "ignoreStrand", "ignoreStartAndEnd")
)(RemoveDuplicatesDialog);
