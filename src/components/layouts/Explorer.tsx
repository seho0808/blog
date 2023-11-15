import React, { useState } from "react";
import styled from "@emotion/styled";
import PostList from "../Menubar/PostList";
import { Resizable, ResizeCallback, NumberSize } from "re-resizable";
import {
  loadExplorerWidth,
  saveExplorerWidth,
} from "../../utils/sessionStorage";

const Aside = styled.aside<{ doShow: boolean }>`
  background-color: #1e1f1c;
  height: 100vh;
  color: #ccc;
  cursor: default;
  user-select: none;

  @media (max-width: 1050px) {
    z-index: 10;
    position: fixed;
    top: 48px;
    height: 100vh;
    width: 100vw;
    display: ${(props) => (props.doShow ? "block" : "none")};
  }
`;

const Title = styled.div`
  padding: 10px 14px;
  font-size: 12px;
`;

const SubTitle = styled.div`
  background-color: #272822;
  padding: 4px 2px;
  font-size: 12px;
  font-weight: 800;
`;

export default function Explorer() {
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
      <Aside doShow={true}>
        <Title>EXPLORER</Title>
        <SubTitle>
          <img
            src="/arrow-down.svg"
            style={{ verticalAlign: "0%", paddingRight: "2px" }}
          />
          LOCAL &#40;seholee.com&#41;
        </SubTitle>
        <PostList />
      </Aside>
    </Resizable>
  );
}
