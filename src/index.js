import "./createVectorEditor";

// import cleanSequenceData from './utils/cleanSequenceData';
// import deepEqual from 'deep-equal';
import "./style.css";

//export components
export {
  default as CircularView,
  CircularView as CircularViewUnconnected
} from "./CircularView";
export { default as RowView, RowView as RowViewUnconnected } from "./RowView";
export { default as RowItem, RowItem as RowItemUnconnected } from "./RowItem";
export { default as Editor, Editor as EditorUnconnected } from "./Editor";
export {
  default as VeToolBar,
  VeToolBar as VeToolBarUnconnected
} from "./VeToolBar";
export {
  default as CutsiteFilter,
  CutsiteFilter as CutsiteFilterUnconnected
} from "./CutsiteFilter";
export {
  default as LinearView,
  LinearView as LinearViewUnconnected
} from "./LinearView";
export {
  default as StatusBar,
  StatusBar as StatusBarUnconnected
} from "./StatusBar";
export {
  default as DigestTool,
  DigestTool as DigestToolUnconnected
} from "./DigestTool/DigestTool";
export { default as HoverHelper } from "./helperComponents/HoverHelper";

export { default as vectorEditorReducer } from "./redux";
export { default as updateEditor } from "./updateEditor";

export {
  default as getRangeAnglesSpecial
} from "./CircularView/getRangeAnglesSpecial";
export {
  default as PositionAnnotationOnCircle
} from "./CircularView/PositionAnnotationOnCircle";
