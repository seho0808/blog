import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import CodeSpace from "../components/_layouts/CodeSpace";
import Explorer from "../components/Explorers/SearchExplorer";
import Menubar from "../components/_layouts/Menubar";

const layoutStyle = {
  display: "flex",
};

/**
 * this page is currently not used. slug "/" on main .md seems to redirect
 * the user to {markdownRemark.frontmatter__slug}.tsx component
 * @returns
 */
const IndexPage: React.FC<PageProps> = () => {
  return (
    <div style={layoutStyle}>
      <CodeSpace />
    </div>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
