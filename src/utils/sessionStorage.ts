import { TabsInfo } from "../types/types";

export const saveTabsInfo = (state: TabsInfo[]) => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem("tabsInfo", serializedState);
  } catch (err) {
    // Handle errors here
  }
};

export const loadTabsInfo = () => {
  try {
    const serializedState = sessionStorage.getItem("tabsInfo");
    if (serializedState === null) {
      return []; // No state saved in session storage
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined; // Handle errors or invalid state
  }
};
