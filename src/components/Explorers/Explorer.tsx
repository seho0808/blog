import React, { useState } from "react";
import styled from "@emotion/styled";
import FileExplorer from "./FileExplorer";
import { Resizable, ResizeCallback, NumberSize } from "re-resizable";
import {
  loadExplorerWidth,
  saveExplorerWidth,
} from "../../utils/sessionStorage";
import SearchExplorer from "./SearchExplorer";

export default function Explorer({
  showExplorer,
  explorerType,
}: {
  showExplorer: boolean;
  explorerType: "file" | "search";
}) {
  const [defaultExplorerWidth, _] = useState<number>(loadExplorerWidth());

  const resizeHandler: ResizeCallback = (
    event: MouseEvent | TouchEvent,
    direction: string,
    elementRef: HTMLElement,
    delta: NumberSize
  ) => {
    saveExplorerWidth(Number(elementRef.style.width.slice(0, -2)));
  };

  return (
    <Resizable
      defaultSize={{
        width: defaultExplorerWidth,
        height: "calc(90vh)",
      }}
      maxWidth="40%"
      handleClasses={{
        top: "pointer-events-none",
        bottom: "pointer-events-none",
        left: "pointer-events-none",
        topRight: "pointer-events-none",
        bottomRight: "pointer-events-none",
        bottomLeft: "pointer-events-none",
        topLeft: "pointer-events-none",
      }}
      onResizeStop={resizeHandler}
    >
      <Nav doShow={showExplorer}>
        <Title>{explorerType === "file" ? "EXPLORER" : "SEARCH"}</Title>
        {explorerType === "file" && <FileExplorer />}
        {explorerType === "search" && <SearchExplorer />}
        <LegacyLink
          href="https://d1ykeqyorqdego.cloudfront.net."
          rel="no-follow"
        >
          <ArrowImg src="/icons/arrow-right-1.svg" alt="arrow-right" />
          <LegacyDiv>Legacy Website</LegacyDiv>
        </LegacyLink>
      </Nav>
    </Resizable>
  );
}

const Nav = styled.nav<{ doShow: boolean }>`
  background-color: #1e1f1c;
  height: 100%;
  color: #ccc;
  cursor: default;
  user-select: none;
  display: flex;
  flex-direction: column;

  @media (max-width: 1050px) {
    z-index: 10;
    position: fixed;
    top: 48px;
    height: calc(100% - 48px);
    width: 100vw;
    display: ${(props) => (props.doShow ? "flex" : "none")};
  }
`;

const Title = styled.div`
  padding: 10px 14px;
  font-size: 12px;
`;

const LegacyLink = styled.a`
  text-decoration: none;
  display: flex;
  background-color: #272822;
  margin-top: auto;
`;

export const ArrowImg = styled.img`
  vertical-align: 0%;
  padding-right: 2px;
  width: 10px;
`;

const LegacyDiv = styled.div`
  padding: 4px 2px;
  font-weight: 800;
  color: #ccc;
  font-size: 12px;
  font-size: 12px;
`;
