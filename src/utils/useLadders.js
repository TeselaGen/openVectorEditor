import tgUseLocalStorageState from "tg-use-local-storage-state";

const useLadders = () => {
  return tgUseLocalStorageState("tg-additional-ladder", { defaultValue: [] });
};
export default useLadders;
