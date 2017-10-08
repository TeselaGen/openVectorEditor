import { connect } from "react-redux";
import { compose } from "redux";

import CutsiteFilter from "./CutsiteFilter";
import withEditorProps from "../withEditorProps";

export default compose(withEditorProps, connect())(CutsiteFilter);
