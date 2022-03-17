import tgUseLocalStorageState from "tg-use-local-storage-state";

const useAAColorType = () =>
  tgUseLocalStorageState("aaColorType", {
    isSimpleString: true,
    defaultValue: "byHydrophobicity"
  });
export default useAAColorType;
