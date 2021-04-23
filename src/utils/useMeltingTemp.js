import { createLocalStorageStateHook } from "use-local-storage-state";

const useMeltingTemp = createLocalStorageStateHook("showMeltingTemp");
export default useMeltingTemp;
