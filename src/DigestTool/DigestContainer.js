// import uniqid from "uniqid";
import withEditorProps from "../withEditorProps";
// import Ladder from "./Ladder";
import { compose, withProps } from "recompose";
import { normalizePositionByRangeLength, getRangeLength } from "ve-range-utils";
// import selectionLayer from "../redux/selectionLayer";

export default compose(
  withEditorProps,
  withProps(props => {
    const {
      sequenceData,
      sequenceLength,
      selectionLayerUpdate,
      updateSelectedFragment
    } = props;
    const fragments = [];
    const overlappingEnzymes = [];
    const pairs = [];
    const sortedCutsites = sequenceData.cutsites.sort((a, b) => {
      return a.topSnipPosition - b.topSnipPosition;
    });

    sortedCutsites.forEach((cutsite1, index) => {
      pairs.push([
        cutsite1,
        sortedCutsites[index + 1]
          ? sortedCutsites[index + 1]
          : sortedCutsites[0]
      ]);
    });

    pairs.forEach(([cut1, cut2]) => {
      const start = normalizePositionByRangeLength(
        cut1.topSnipPosition,
        sequenceLength
      );
      const end = normalizePositionByRangeLength(
        cut2.topSnipPosition - 1,
        sequenceLength
      );
      const size = getRangeLength({ start, end }, sequenceLength);

      // const id = uniqid()
      const id = start + "-" + end + "-" + size + "-";
      getRangeLength({ start, end }, sequenceLength);
      fragments.push({
        cut1,
        cut2,
        start,
        end,
        size,
        id,
        onFragmentSelect: () => {
          selectionLayerUpdate({
            start,
            end
          });
          updateSelectedFragment(id);
        }
      });
    });

    fragments.filter(fragment => {
      if (!fragment.size) {
        overlappingEnzymes.push(fragment);
        return false;
      }
      return true;
    });
    return {
      lanes: [fragments],
      overlappingEnzymes
    };
  })
);
