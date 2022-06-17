import tgUseLocalStorageState from "tg-use-local-storage-state";

const useMeltingTemp = () => {
  return tgUseLocalStorageState("showMeltingTemp");
};

export default useMeltingTemp;
