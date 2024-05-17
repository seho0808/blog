import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { Link, navigate } from "gatsby";
import {
  loadTabsInfo,
  removeTabsInfo,
  saveTabsInfo,
} from "../../utils/sessionStorage";
import { TabsInfo } from "../../types/types";

const TabWrapper = styled.div`
  display: flex;
  background-color: #1e1f1c;
  align-items: stretch;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Tab = styled.div<{ isSelected: boolean }>`
  padding: 10px 8px 10px 14px;
  font-size: 12px;
  color: #ccc;
  background-color: #34352f;
  display: flex;
  gap: 6px;
  background-color: ${(props) => (props.isSelected ? "#272822" : "#34352F")};
  color: ${(props) => (props.isSelected ? "white" : "#ccc")};
`;

const CloseButton = styled.img<{ isSelected: boolean }>`
  background-color: #34352f;
  display: flex;
  align-items: center;
  width: 14px;
  color: #aaa;
  padding-right: 14px;
  margin-right: 1px;
  cursor: pointer;
  background-color: ${(props) => (props.isSelected ? "#272822" : "#34352F")};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

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
    <TabWrapper>
      {tabsInfo.map((tabInfo) => (
        <React.Fragment key={tabInfo.slug}>
          <StyledLink to={tabInfo.slug}>
            <Tab isSelected={currentTabSlug === tabInfo.slug}>
              {tabInfo.title}
            </Tab>
          </StyledLink>
          <CloseButton
            src="/icons/close.svg"
            isSelected={currentTabSlug === tabInfo.slug}
            onClick={(e) => handleTabClose(e, tabInfo.slug)}
          ></CloseButton>
        </React.Fragment>
      ))}
    </TabWrapper>
  );
}
