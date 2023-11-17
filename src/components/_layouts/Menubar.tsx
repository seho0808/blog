import styled from "@emotion/styled";
import * as React from "react";

export default function Menubar({
  setShowExplorer,
  setExplorerType,
  explorerType,
}: {
  setShowExplorer: Function;
  setExplorerType: Function;
  explorerType: "file" | "search";
}) {
  const folderClickHandler = () => {
    if (explorerType === "file") {
      setShowExplorer((v: boolean) => !v);
    } else {
      setShowExplorer(true);
      setExplorerType("file");
    }
  };

  const searchClickHandler = () => {
    if (explorerType === "search") {
      setShowExplorer((v: boolean) => !v);
    } else {
      setShowExplorer(true);
      setExplorerType("search");
    }
  };

  return (
    <Nav>
      <Icon
        src="/icons/folder-menu.svg"
        onClick={folderClickHandler}
        alt="folder-icon"
      />
      <Icon
        src="/icons/magnify.svg"
        onClick={searchClickHandler}
        alt="folder-icon"
      />
      <MediaLinks>
        <Github href="https://github.com/seho0808">
          <Icon src="/images/github.png" alt="github" />
        </Github>
        <LinkedIn href="https://www.linkedin.com/in/seho-lee-5922a2173/">
          in
        </LinkedIn>
      </MediaLinks>
    </Nav>
  );
}

const Nav = styled.nav`
  padding-top: 12px;
  background-color: #272822;
  display: flex;
  gap: 6px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: calc(100vh - 12px);
  width: 48px;
  user-select: none;

  @media (max-width: 1050px) {
    padding-top: 0px;
    padding-left: 14px;
    position: fixed;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100vw;
    height: 48px;
  }
`;

const Icon = styled.img`
  width: 24px;
  margin-bottom: 10px;
  cursor: pointer;
  @media (max-width: 1050px) {
    margin-right: 10px;
    margin-bottom: 0px;
  }
`;

const MediaLinks = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 48px;
  align-items: center;
  gap: 6px;

  @media (max-width: 1050px) {
    flex-direction: row;
    padding: 0px;
    padding-right: 28px;
    justify-content: center;
    margin: 0;
    margin-left: auto;
  }
`;

const Github = styled.a`
  display: flex;
  align-items: center;
  filter: grayscale(100%) brightness(70%) contrast(90%);
`;

const LinkedIn = styled.a`
  display: block;
  font-size: 24px;
  color: #aaa;
  text-decoration: none;
  font-weight: 600;
`;
