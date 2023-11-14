import * as React from "react";
import PostList from "../Menubar/PostList";

const asideStyle = {
  backgroundColor: "#1E1F1C",
  minHeight: "100vh",
  minWidth: "275px",
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
  return (
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
  );
}
