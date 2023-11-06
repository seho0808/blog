import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import CodeSpace from "../components/layouts/CodeSpace";
import Explorer from "../components/layouts/Explorer";
import Menubar from "../components/layouts/Menubar";

const layoutStyle = {
  display: "flex",
};

const IndexPage: React.FC<PageProps> = () => {
  return (
    <div style={layoutStyle}>
      <Menubar />
      <Explorer />
      <CodeSpace />
    </div>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
