import { useSyncExternalStore } from "react";
import { getStore, subscribe } from "./store";

const EMPTY = { enquiries: [], tasks: [], activity: [] } as ReturnType<typeof getStore>;

export function useStore() {
  return useSyncExternalStore(subscribe, getStore, () => EMPTY);
}
