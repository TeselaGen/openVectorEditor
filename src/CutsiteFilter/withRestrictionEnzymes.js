import { connectToEditor } from "../withEditorProps";
import restrictionEnzymesSelector from "../selectors/restrictionEnzymesSelector";

export const withRestrictionEnzymes = connectToEditor(
  (editorState, ownProps) => {
    const allRestrictionEnzymes = restrictionEnzymesSelector(
      editorState,
      ownProps.additionalEnzymes,
      ownProps.enzymeGroupsOverride
    );
    return {
      allRestrictionEnzymes
    };
  }
);
