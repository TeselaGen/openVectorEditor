import { createLocalStorageStateHook } from "use-local-storage-state";

const useAAColorType = createLocalStorageStateHook(
  "aaColorType",
  "byHydrophobicity"
);
export default useAAColorType;
