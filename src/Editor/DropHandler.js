import React from "react";
import Dropzone from "react-dropzone";
import classNames from "classnames";
import "./DropHandler.css";

export default class DropHandler extends React.Component {
  handleDrop = (files) => {
    if (!files || !files.length) {
      return window.toastr.warning("Unrecognized File Type");
    }
    this.props.importSequenceFromFile(files[0]);
  };
  render() {
    const { children, style, className, disabled } = this.props;
    return (
      <Dropzone
        disabled={disabled}
        onClick={(evt) => evt.preventDefault()}
        multiple={false}
        accept={[
          ".gb",
          ".gbk",
          ".fasta",
          ".fa",
          ".gp",
          ".txt",
          ".dna",
          ".ab1",
          ".json"
        ]}
        onDropRejected={() => {
          window.toastr.error("Error: Incorrect File Type");
        }}
        onDrop={this.handleDrop}
      >
        {({ getRootProps, isDragActive, isDragReject }) => (
          <div
            {...getRootProps()}
            {...{
              style,
              className: classNames(className, {
                isActive: isDragActive,
                isRejected: isDragReject
              })
            }}
          >
            <DraggingMessage />
            {children}
          </div>
        )}
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
