import React from "react";
import { Icon, IconClasses, Button, Intent } from "@blueprintjs/core";
import {
  FileUploadField,
  TextareaField,
  EditableTextField
} from "teselagen-react-components";
import { reduxForm } from "redux-form";
import { anyToJson } from "bio-parsers";

export default {
  updateKeys: ["alignmentTool", "toggleFindTool"],
  itemProps: ({ alignmentTool = {}, toggleDropdown }) => {
    return {
      Icon: <Icon iconName={IconClasses.ALIGN_LEFT} />,
      // toggled: alignmentTool.isOpen,
      renderIconAbove: alignmentTool.isOpen,
      // onIconClick: toggleFindTool,
      Dropdown: AlignmentToolInner,
      onIconClick: toggleDropdown,
      noDropdownIcon: true,
      tooltip: alignmentTool.isOpen
        ? "Hide Alignment Tool"
        : "Show Alignment Tool"
    };
  }
};

class AlignmentTool extends React.Component {
  sendSelectedDataToBackendForAlignment = () => {
    console.log("sending data to backend!");
  };

  const tagDict = {
    "baseCalls1": { "tagName": "PBAS", "tagNum": 1, "typeToReturn": "getChar" },
    "baseCalls2": { "tagName": "PBAS", "tagNum": 2, "typeToReturn": "getChar" },
    "qualNums": { "tagName": "PCON", "tagNum": 2, "typeToReturn": "getNumber" },
    "peakLocations": { "tagName": "PLOC", "tagNum": 2, "typeToReturn": "getShort" },
    "peakDev": { "tagName": "P1RL", "tagNum": 1, "typeToReturn": "getShort" },
    "peakOneAmp": { "tagName": "P1AM", "tagNum": 1, "typeToReturn": "getShort" },
    "colorDataA": { "tagName": "DATA", "tagNum": 10, "typeToReturn": "getShort" },
    "colorDataT": { "tagName": "DATA", "tagNum": 11, "typeToReturn": "getShort" },
    "colorDataG": { "tagName": "DATA", "tagNum": 9, "typeToReturn": "getShort" },
    "colorDataC": { "tagName": "DATA", "tagNum": 12, "typeToReturn": "getShort" }
  };

  readAb1File = (sequenceFiles, onChange) => {
    const sequenceFile = sequenceFiles[0];
    // const newFile = {
    //   ...sequenceFile,
    //   loading: false
    // };
    // let fileObj = new FileReader();
    fileObj.onload = e => {
      const contents = e.target.result;
      const dataview = new DataView(contents);
      const converter = new abConverter(dataview);
    }
    fileObj.readAsArrayBuffer(sequenceFile);
    // onChange([newFile]);
  };

  abConverter = (inputArrayBuffer) => {
    const dirLocation = inputArrayBuffer.getInt32(26);
    const numElements = inputArrayBuffer.getInt32(18);
    const lastEntry = dirLocation + (numElements * 28);

    this.getFileID = () => {
      let output = "";
      for (let offset = 0; offset < 4; offset++) {
        output += String.fromCharCode(inputArrayBuffer.getInt8(offset));
      }
      return output;
    }

    this.getFileVersion = () => inputArrayBuffer.getInt16(4)

    this.getDirectoryStruct = () => {
      const br = "<br>";
      const indent = "  ";
      let output = br;
      let name = "";
      for (let offset = 6; offset < 10; offset++) {
        name += String.fromCharCode(inputArrayBuffer.getInt8(offset));
      }
      output += (`- tag name: ${name}${br}`);
      output += (`- tag number: ${inputArrayBuffer.getInt32(10)}${br}`);
      output += (`- element type: ${inputArrayBuffer.getInt16(14)}${br}`);
      output += (`- element size: ${inputArrayBuffer.getInt16(16)}${br}`);
      output += (`- num elements: ${inputArrayBuffer.getInt32(18)}${br}`);
      output += (`- data size: ${inputArrayBuffer.getInt32(22)}${br}`);
      output += (`- data offset: ${inputArrayBuffer.getInt32(26)}${br}`);
      return output;
    }

    this.getNumber = (inOffset, numEntries) => {
      const retArray = [];
      for (let counter = 0; counter < numEntries; counter += 1) {
        retArray.push(inputArrayBuffer.getInt8(inOffset + counter));
      }
      return retArray;
    };

    this.getChar = (inOffset, numEntries) => {
      const retArray = [];
      for (let counter = 0; counter < numEntries; counter += 1) {
        retArray.push(String.fromCharCode(inputArrayBuffer.getInt8(inOffset + counter)));
      }
      return retArray;
    };

    this.getShort = (inOffset, numEntries) => {
      const retArray = [];
      for (let counter = 0; counter < numEntries; counter += 2) {
        retArray.push(inputArrayBuffer.getInt16(inOffset + counter));
      }
      return retArray;

    };

    this.getByte = (inOffset, counter) => inputArrayBuffer.getUint8(inOffset + counter);

    this.getWord = (inOffset, numEntries) => {
      let retVal = "";
      for (let counter = 0; counter < numEntries; counter += 2) {
        retVal += inputArrayBuffer.getUint16(inOffset + counter);
      }
      return retVal;

    };

    this.getLong = (inOffset, counter) => inputArrayBuffer.getInt32(inOffset);

    this.getFloat = (inOffset, counter) => inputArrayBuffer.getFloat32(inOffset);

    this.getDouble = (inOffset, counter) => inputArrayBuffer.getFloat64(inOffset);

    this.getDate = (inOffset, counter) => {
      let date = "";
      date += inputArrayBuffer.getInt16(inOffset);
      date += inputArrayBuffer.getUint8(inOffset + 2);
      date += inputArrayBuffer.getUint8(inOffset + 3);
      return date;
    };

    this.getTime = (inOffset, counter) => {
      let time = "";
      time += inputArrayBuffer.getUint8(inOffset);
      time += inputArrayBuffer.getUint8(inOffset + 1);
      time += inputArrayBuffer.getUint8(inOffset + 2);
      time += inputArrayBuffer.getUint8(inOffset + 3);
      return time;
    };

    this.getPString = (inOffset, counter) => {
      let outString = "";
      for (let count = 1; count < inputArrayBuffer.getInt8(inOffset); count++) {
        outString += inputArrayBuffer.getInt8(inOffset + count);
      }
    };

    this.getCString = (inOffset, counter) => {
      let outString = "";
      let offset = inOffset;
      let currentByte = inputArrayBuffer.getInt8(offset);
      while (currentByte != 0) {
        outString += String.fromCharCode(currentByte);
        offset++;
        currentByte = inputArrayBuffer.getInt8(offset);
      }
      return outString;
    };

    this.getTagName = inOffset => {
      let name = "";
      for (let loopOffset = inOffset; loopOffset < inOffset + 4; loopOffset++) {
        name += String.fromCharCode(inputArrayBuffer.getInt8(loopOffset));
      }
      return name;
    };

    this.getDataTag = function (inTag) {
      let output;
      let curElem = dirLocation;
      do {
        const currTagName = this.getTagName(curElem);
        const tagNum = inputArrayBuffer.getInt32(curElem + 4);
        if (currTagName == inTag.tagName && tagNum === inTag.tagNum) {
          const numEntries = inputArrayBuffer.getInt32(curElem + 16);
          const entryOffset = inputArrayBuffer.getInt32(curElem + 20);
          output = this[inTag.typeToReturn](entryOffset, numEntries);
        }
        curElem += 28;
      } while (curElem < lastEntry);
      return output;
    }

    this.getTraceData = function () {
      const traceData = {};
      traceData.aTrace = this.getDataTag(tagDict.colorDataA);
      traceData.tTrace = this.getDataTag(tagDict.colorDataT);
      traceData.gTrace = this.getDataTag(tagDict.colorDataG);
      traceData.cTrace = this.getDataTag(tagDict.colorDataC);
      traceData.basePos = this.getDataTag(tagDict.peakLocations);
      traceData.baseCalls = this.getDataTag(tagDict.baseCalls2);
      traceData.qualNums = this.getDataTag(tagDict.qualNums);

      return traceData;
    }

    this.getFirstEntry = () => {

      let output = "";
      for (let curElem = dirLocation; curElem < lastEntry; curElem += 28) {
        let name = "";
        for (let offset = curElem; offset < curElem + 4; offset++) {
          name += String.fromCharCode(inputArrayBuffer.getInt8(offset));
        }
        output += (` - ${name}`);
      }
      return output;
    }
  }

  render() {
    const { hey } = this.props;
    return (
      <div className="veAlignmentTool">
        <h6>Upload files you'd like to align (.ab1, .fasta, .gb) </h6>
        <FileUploadField
          name="sequenceUpload"
          readBeforeUpload
          beforeUpload = {this.readAb1File}
          accept={".ab1"}
        />
        <h6>Or Select from your sequence library </h6>
        <h6>Or Enter sequences in plain text format</h6>
        <div className="veAlignmentToolAddYourOwn">
          <EditableTextField
            placeholder="Untitled Sequence"
            name="addYourOwnTextName"
          />
          <TextareaField placeholder="AGTTGAGC" name="addYourOwnTextBps" />
          <Button> Add </Button>
        </div>

        <div className="veAlignmentToolSelectedSequenceList">
          List of sequences goes here
        </div>

        <Button
          intent={Intent.PRIMARY}
          onClick={this.sendSelectedDataToBackendForAlignment}
        >
          Create alignment
        </Button>

        <Button
          intent={Intent.PRIMARY}
          // onClick={this.}
        >
          View chromatogram
        </Button>
      </div>
    );
  }
}

export const AlignmentToolInner = reduxForm({ form: "veAlignmentTool" })(
  AlignmentTool
);
