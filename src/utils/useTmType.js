import { createLocalStorageStateHook } from "use-local-storage-state";

const useTmType = createLocalStorageStateHook("tmType", "default");
export default useTmType;
