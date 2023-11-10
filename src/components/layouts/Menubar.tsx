import * as React from "react";

const asideStyle = {
  backgroundColor: "#272822",
  minHeight: "100vh",
  textAlign: "center" as const,
  width: "48px",
};

const topStyle = {
  paddingTop: "10px",
};

export default function Menubar() {
  return (
    <aside style={asideStyle}>
      <img src="/folder.svg" style={topStyle} />
    </aside>
  );
}
