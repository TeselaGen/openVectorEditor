import { FocusStyleManager } from "@blueprintjs/core";
import { showContextMenu } from "teselagen-react-components";
import "./createVectorEditor";
import "./style.css";

window.tgCreateMenu = showContextMenu;
require("typeface-ubuntu-mono");
// window.tgCreateMenu = (menu, e, e2) => {
//   (e||e2).stopPropagation()
//   (e || e2)
// } //add this to the window so people can easily override the default context menus

FocusStyleManager.onlyShowFocusOnTabs();

export { default as withEditorProps, connectToEditor } from "./withEditorProps";
export { default as withEditorInteractions } from "./withEditorInteractions";
//export components
export {
  default as CircularView,
  CircularView as CircularViewUnconnected
} from "./CircularView";
export {
  default as SimpleCircularOrLinearView
} from "./SimpleCircularOrLinearView";
export { default as RowView, RowView as RowViewUnconnected } from "./RowView";
export { default as RowItem, RowItem as RowItemUnconnected } from "./RowItem";
export { default as Editor, Editor as EditorUnconnected } from "./Editor";
export { default as ToolBar, ToolBar as ToolBarUnconnected } from "./ToolBar";
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
export { default as withHover } from "./helperComponents/withHover";

export {
  default as vectorEditorReducer,
  vectorEditorMiddleware,
  actions
} from "./redux";
export { default as updateEditor } from "./updateEditor";
export { default as addAlignment } from "./addAlignment";

export {
  default as getRangeAnglesSpecial
} from "./CircularView/getRangeAnglesSpecial";
export {
  default as PositionAnnotationOnCircle
} from "./CircularView/PositionAnnotationOnCircle";
export { default as EnzymeViewer } from "./EnzymeViewer";
export { default as AlignmentView } from "./AlignmentView";
