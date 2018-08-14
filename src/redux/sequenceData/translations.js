import { createReducer } from "redux-act";
import createAction from "../utils/createMetaAction";
import upsertDeleteActionGenerator from "./upsertDeleteActionGenerator";

// ------------------------------------
// Actions
// ------------------------------------
export const _upsertTranslation = createAction("UPSERT_TRANSLATION");
export const deleteTranslation = createAction("DELETE_TRANSLATION");

const defaultValue = {};
// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer(
  {
    ...upsertDeleteActionGenerator(_upsertTranslation, deleteTranslation)
  },
  defaultValue
);
