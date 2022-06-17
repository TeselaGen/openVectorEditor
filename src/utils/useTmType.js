import tgUseLocalStorageState from "tg-use-local-storage-state";

const useTmType = () => {
  return tgUseLocalStorageState("tmType", {
    isSimpleString: true,
    defaultValue: "default"
  });
};

export default useTmType;
