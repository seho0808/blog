import styled from "@emotion/styled";
import React from "react";

const FooterWrapper = styled.div`
  height: 60px;
  padding-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b4b4b4;
  font-size: 14px;
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: #a6e22e;
`;

export default function Footer() {
  return (
    <FooterWrapper>
      <span className="text-red">Copyright&nbsp;</span>
      <span className="text-purple">©&nbsp;</span>
      <span className="text-skyblue">2023</span>
      <StyledLink href="/">&nbsp;Seho Lee&nbsp;</StyledLink>
      <span className="text-orange">All Rights Reserved</span>
      <span className="text-yellow">.</span>
    </FooterWrapper>
  );
}
