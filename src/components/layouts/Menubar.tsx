import styled from "@emotion/styled";
import * as React from "react";

const StyledAside = styled.aside`
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

const StyledImage = styled.img`
  padding-top: 10px;
  @media (max-width: 1050px) {
    padding-right: 10px;
    padding-top: 0px;
  }
`;

export default function Menubar() {
  return (
    <StyledAside>
      <StyledImage src="/folder_sax.svg" />
    </StyledAside>
  );
}
