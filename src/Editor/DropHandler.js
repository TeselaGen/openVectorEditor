import React from "react";
import Dropzone from "react-dropzone";
import "./DropHandler.css";

export default class DropHandler extends React.Component {
  handleDrop = files => {
    this.props.importSequenceFromFile(files[0]);
  };
  render() {
    const { children, style, className, disabled } = this.props;
    return (
      <Dropzone
        disabled={disabled}
        disableClick
        multiple={false}
        accept={[".gb", ".gbk", ".fasta", ".fa", ".gp", ".txt"]}
        activeClassName="isActive"
        rejectClassName="isRejected"
        onDropRejected={() => {
          window.toastr.error("Error: Incorrect File Type");
        }}
        onDrop={this.handleDrop}
        {...{ style, className }}
      >
        <DraggingMessage />
        {children}
      </Dropzone>
    );
  }
}
function DraggingMessage() {
  return (
    <div className="dropzone-dragging-message">
      Drop Fasta or Genbank files to view them in the editor. The following
      extensions are accepted: .gb .gbk .fasta .fa .gp .txt
    </div>
  );
}
