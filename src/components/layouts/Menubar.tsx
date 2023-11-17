import styled from "@emotion/styled";
import * as React from "react";

const Nav = styled.nav`
  background-color: #272822;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
  width: 48px;
  user-select: none;

  @media (max-width: 1050px) {
    position: fixed;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 100vw;
    height: 48px;
  }
`;

const Icon = styled.img`
  padding-top: 10px;
  @media (max-width: 1050px) {
    padding-right: 10px;
    padding-top: 0px;
  }
`;

export default function Menubar({
  setShowExplorer,
}: {
  setShowExplorer: Function;
}) {
  const folderClickHandler = () => {
    setShowExplorer((v: boolean) => !v);
  };

  return (
    <Nav>
      <Icon
        src="/icons/folder_sax.svg"
        onClick={folderClickHandler}
        alt="folder-icon"
      />
    </Nav>
  );
}
