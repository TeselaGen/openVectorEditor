import {
  editorDragStarted,
  handleSelectionEndGrabbed
} from "../../../src/withEditorInteractions/clickAndDragUtils";

describe("handleSelectionEndGrabbed", () => {
  it("handleSelectionEndGrabbed will still update selection layer even if there isn't one yet", (done) => {
    editorDragStarted({
      caretPositionOnDragStart: 10,
      selectionStartOrEndGrabbed: "end"
    });
    handleSelectionEndGrabbed({
      selectionLayer: { start: 10, end: 20 },
      nearestCaretPos: 10,
      sequenceLength: 30,
      doNotWrapOrigin: true,
      caretPositionUpdate: (newCaret) => {
        expect(newCaret).to.eq(10);

        done();
      }
    });
  });
  it("handleSelectionEndGrabbed removes selection and updates caret when doNotWrapOrigin=true and nearestCaretPos===selectionLayerStart", (done) => {
    editorDragStarted({
      caretPositionOnDragStart: 10,
      selectionStartOrEndGrabbed: "end"
    });
    handleSelectionEndGrabbed({
      selectionLayer: { start: 10, end: 20 },
      nearestCaretPos: 10,
      sequenceLength: 30,
      doNotWrapOrigin: true,
      caretPositionUpdate: (newCaret) => {
        expect(newCaret).to.eq(10);

        done();
      }
    });
  });
  it("handleSelectionEndGrabbed selects till end when selection is exactly at the end", (done) => {
    editorDragStarted({
      caretPositionOnDragStart: 10,
      selectionStartOrEndGrabbed: "end"
    });
    handleSelectionEndGrabbed({
      selectionLayer: { start: 10, end: 20 },
      nearestCaretPos: 30,
      sequenceLength: 30,
      doNotWrapOrigin: false,
      selectionLayerUpdate: (newSelection) => {
        expect(newSelection.start).to.eq(10);
        expect(newSelection.end).to.eq(29);
        done();
      }
    });
  });
  it("handleSelectionEndGrabbed selects till end when selection is way past the end", (done) => {
    editorDragStarted({
      caretPositionOnDragStart: 10,
      selectionStartOrEndGrabbed: "end"
    });
    handleSelectionEndGrabbed({
      selectionLayer: { start: 10, end: 20 },
      nearestCaretPos: 350,
      sequenceLength: 30,
      doNotWrapOrigin: false,
      selectionLayerUpdate: (newSelection) => {
        expect(newSelection.start).to.eq(10);
        expect(newSelection.end).to.eq(29);
        done();
      }
    });
  });
  it("handleSelectionEndGrabbed selects till end when selection is just past the end", (done) => {
    editorDragStarted({
      caretPositionOnDragStart: 10,
      selectionStartOrEndGrabbed: "end"
    });
    handleSelectionEndGrabbed({
      selectionLayer: { start: 10, end: 20 },
      nearestCaretPos: 31,
      sequenceLength: 30,
      doNotWrapOrigin: false,
      selectionLayerUpdate: (newSelection) => {
        expect(newSelection.start).to.eq(10);
        expect(newSelection.end).to.eq(29);
        done();
      }
    });
  });
});
