import withEditorProps from "../withEditorProps";
import Ladder from "./Ladder";
import { compose, withProps } from "recompose";

// import {List, DropDownMenu} from 'material-ui';

export default compose(
  withEditorProps,
  withProps(props => {
    return {
      ...props
    };
  })
)(Ladder);
