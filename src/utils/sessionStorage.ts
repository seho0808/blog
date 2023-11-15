import { TabsInfo } from "../types/types";

/**
 * save open tabs information
 * @param state tabs that are open
 */
export const saveTabsInfo = (state: TabsInfo[]) => {
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

/**
 * save list of open folder names to session storage
 * @param folderNames folder names to save
 */
export const saveOpenFolders = (folderNames: string[]) => {
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
  try {
    const serializedState = sessionStorage.getItem("openFolders");
    if (serializedState === null) {
      return []; // No state saved in session storage
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
  try {
    console.log("saving", width);
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
  try {
    const serializedState = sessionStorage.getItem("explorerWidth");
    console.log(serializedState);
    if (!serializedState) {
      return 275; // No state saved in session storage
    }
    return Number(serializedState);
  } catch (err) {
    console.log("unexpected error at explorerWidth");
    return 275; // Handle errors or invalid state
  }
};
