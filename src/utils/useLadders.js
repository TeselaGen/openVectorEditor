import { createLocalStorageStateHook } from "use-local-storage-state";

const useLadders = createLocalStorageStateHook("tg-additional-ladder", []);
export default useLadders;
