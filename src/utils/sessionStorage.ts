import { TabsInfo } from "../types/types";

export const saveTabsInfo = (state: TabsInfo[]) => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem("tabsInfo", serializedState);
  } catch (err) {
    console.log("unexpected error at saveTabsInfo");
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
    console.log("unexpected error at loadTabsInfo");
    return []; // Handle errors or invalid state
  }
};

/**
 * remove certain slug from session storage tabs data
 * @param slug
 * @returns false if something went wrong. true if executed.
 */
export const removeTabsInfo = (slug: string) => {
  try {
    const serializedState = sessionStorage.getItem("tabsInfo");
    if (serializedState === null) {
      console.log("slug does not exist in storage");
      return false;
    }
    const res = JSON.parse(serializedState).filter(
      (d: TabsInfo) => d.slug !== slug
    );
    sessionStorage.setItem("tabsInfo", JSON.stringify(res));
    return true;
  } catch (err) {
    console.log("unexpected error at removeTabsInfo");
    return false;
  }
};
