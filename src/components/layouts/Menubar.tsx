import styled from "@emotion/styled";
import * as React from "react";

const StyledAside = styled.aside`
  background-color: #272822;
  min-height: 100vh;
  text-align: center;
  width: 48px;
  user-select: none;
`;

const StyledImage = styled.img`
  padding-top: 10px;
`;

export default function Menubar() {
  return (
    <StyledAside>
      <StyledImage src="/folder_sax.svg" />
    </StyledAside>
  );
}
