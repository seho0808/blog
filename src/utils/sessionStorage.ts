import { TabsInfo } from "../types/types";

const isBrowser = typeof window !== "undefined";

/**
 * save open tabs information
 * @param state tabs that are open
 */
export const saveTabsInfo = (state: TabsInfo[]) => {
  if (!isBrowser) return;
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem("tabsInfo", serializedState);
  } catch (err) {
    console.log("unexpected error at saveTabsInfo");
  }
};
/**
 * get open tabs information
 * @returns tabs that are open
 */
export const loadTabsInfo = () => {
  if (!isBrowser) return [];
  try {
    const serializedState = sessionStorage.getItem("tabsInfo");
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.log("unexpected error at loadTabsInfo");
    return [];
  }
};

/**
 * remove certain slug from session storage tabs data
 * @param slug
 * @returns false if something went wrong. true if executed.
 */
export const removeTabsInfo = (slug: string) => {
  if (!isBrowser) return false;
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

/**
 * save list of open folder names to session storage
 * @param folderNames folder names to save
 */
export const saveOpenFolders = (folderNames: string[]) => {
  if (!isBrowser) return false;
  try {
    sessionStorage.setItem("openFolders", JSON.stringify(folderNames));
    return true;
  } catch (e) {
    console.log("unexpected error at addOpenFolders");
    return false;
  }
};

/**
 * load open folders informations
 * @returns open folders' names
 */
export const loadOpenFolders = () => {
  if (!isBrowser) return [];
  try {
    const serializedState = sessionStorage.getItem("openFolders");
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.log("unexpected error at loadOpenFolders");
    return [];
  }
};

/**
 * close folder and remove name from session storage
 * @param folderName folder name to remove
 */
export const removeOpenFolders = (folderName: string) => {
  if (!isBrowser) return false;
  try {
    const serializedState = sessionStorage.getItem("openFolders");
    if (serializedState !== null) {
      sessionStorage.setItem(
        "openFolders",
        JSON.stringify([
          ...JSON.parse(serializedState).filter(
            (name: string) => name !== folderName
          ),
        ])
      );
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log("unexpected error at removeOpenFolders");
    return false;
  }
};

/**
 * save explorer width
 * @param width width in px
 */
export const saveExplorerWidth = (width: number) => {
  if (!isBrowser) return;
  try {
    sessionStorage.setItem("explorerWidth", JSON.stringify(width));
  } catch (err) {
    console.log("unexpected error at explorerWidth");
  }
};
/**
 * load explorer width
 * @returns width in px
 */
export const loadExplorerWidth = () => {
  if (!isBrowser) return 275;
  try {
    const serializedState = sessionStorage.getItem("explorerWidth");
    if (!serializedState) {
      return 275;
    }
    return Number(serializedState);
  } catch (err) {
    console.log(
      "Unexpected error at explorerWidth. Falling back to default value."
    );
    return 275;
  }
};
