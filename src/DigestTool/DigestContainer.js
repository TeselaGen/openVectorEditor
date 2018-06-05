import { getVirtualDigest } from "ve-sequence-utils";

// import uniqid from "uniqid";
import withEditorProps from "../withEditorProps";
// import Ladder from "./Ladder";
import { compose, withProps } from "recompose";
import {
  normalizePositionByRangeLength,
  getRangeLength
} from "ve-range-utils/lib";

// import selectionLayer from "../redux/selectionLayer";

export default compose(
  withEditorProps,
  withProps(props => {
    const { fragments, overlappingEnzymes } = getVirtualDigest({
      cutsites: sequenceData.cutsites,
      sequenceLength,
      isCircular,
      allowPartialDigests
    }).map(frag => {
      return {
        ...frag,
        onFragmentSelect: () => {
          selectionLayerUpdate({
            start: frag.start,
            end: frag.end
          });
          updateSelectedFragment(frag.id);
        }
      };
    });
    return {
      lanes: [fragments],
      overlappingEnzymes
    };
  })
);
