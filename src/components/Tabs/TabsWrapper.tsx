import React, { useEffect, useState } from "react";
import { Link, navigate } from "gatsby";
import {
  loadTabsInfo,
  removeTabsInfo,
  saveTabsInfo,
} from "../../utils/sessionStorage";
import { TabsInfo } from "../../types/types";

const tabStyle = {
  padding: "10px 8px 10px 14px",
  fontSize: "12px",
  color: "#ccc",
  backgroundColor: "#34352F",
  display: "flex",
  gap: "6px",
};

const selectedTabStyle = {
  backgroundColor: "#272822",
  color: "white",
};

const xWrapper = {
  backgroundColor: "#34352F",
  display: "flex",
  alignItems: "center",
  fontSize: "12px",
  color: "#aaa",
  paddingRight: "14px",
  marginRight: "1px",
  cursor: "pointer",
};

const tabWrapperStyle = {
  display: "flex",
  backgroundColor: "#1E1F1C",
  alignItems: "stretch",
};

export default function TabsWrapper({
  frontmatter,
}: {
  frontmatter: TabsInfo;
}) {
  const [tabsInfo, setTabsInfo] = useState<TabsInfo[]>([]);
  const currentTabSlug = frontmatter.slug;

  /**
   * when a page is loaded, add the current page to the open tabs data
   * which is saved in session storage. also update the state to render
   * the correct tabs graphics.
   */
  useEffect(() => {
    const oldTabsInfo = loadTabsInfo();
    const isAlreadySaved = oldTabsInfo.some(
      (d: TabsInfo) => d.slug === frontmatter.slug
    );
    if (!isAlreadySaved) {
      const newTabsInfo = [...oldTabsInfo, frontmatter];
      saveTabsInfo(newTabsInfo);
      setTabsInfo(newTabsInfo);
    } else {
      setTabsInfo(oldTabsInfo);
    }
  }, []);

  const handleTabClose = (e: React.MouseEvent, slug: string) => {
    removeTabsInfo(slug);
    if (slug === currentTabSlug) {
      const currTabsInfo = tabsInfo.filter((d) => d.slug !== slug);
      if (currTabsInfo.length === 0) {
        navigate("/");
        return;
      }
      navigate(currTabsInfo[0].slug);
      return;
    }
    setTabsInfo((tabsInfo) => tabsInfo.filter((d) => d.slug !== slug));
  };

  // TODO: implement x-mark onmouseenter and out to toggle or use hover with other css framworks.
  return (
    <div style={tabWrapperStyle}>
      {tabsInfo.map((tabInfo) => {
        let moreStyle = currentTabSlug === tabInfo.slug ? selectedTabStyle : {};
        return (
          <React.Fragment key={tabInfo.slug}>
            <Link to={tabInfo.slug} style={{ textDecoration: "none" }}>
              <div style={{ ...tabStyle, ...moreStyle }}>{tabInfo.title}</div>
            </Link>
            <div
              style={{ ...xWrapper, ...moreStyle }}
              onClick={(e) => handleTabClose(e, tabInfo.slug)}
            >
              🗙
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
