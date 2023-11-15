import React, { useState } from "react";
import PostList from "../Menubar/PostList";
import { NumberSize, Resizable, ResizeCallback } from "re-resizable";
import {
  loadExplorerWidth,
  saveExplorerWidth,
} from "../../utils/sessionStorage";

const asideStyle = {
  backgroundColor: "#1E1F1C",
  height: "100vh",
  // width: "275px",
  color: "#ccc",
  cursor: "default",
  userSelect: "none" as const,
};

const titleStyle = {
  padding: "10px 14px",
  fontSize: "12px",
};

const subTitleStyle = {
  backgroundColor: "#272822",
  padding: "4px 2px",
  fontSize: "12px",
  fontWeight: 800,
};

export default function Explorer() {
  const [defaultExplorerWidth, _] = useState<number>(loadExplorerWidth());
  console.log(defaultExplorerWidth);

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
      handleClasses={{
        // only allow right side
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
      <aside style={asideStyle}>
        <div style={titleStyle}>EXPLORER</div>
        <div style={subTitleStyle}>
          <img
            src="/arrow-down.svg"
            style={{ verticalAlign: "0%", paddingRight: "2px" }}
          />
          LOCAL &#40;seholee.com&#41;
        </div>
        <PostList />
      </aside>
    </Resizable>
  );
}
