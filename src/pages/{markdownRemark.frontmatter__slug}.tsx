import "../markdownStyle.css";
import React, { useEffect, useRef } from "react";
import { graphql } from "gatsby";
import CodeSpace from "../components/layouts/CodeSpace";
import Explorer from "../components/layouts/Explorer";
import Menubar from "../components/layouts/Menubar";
import { BlogMarkdownRemark, TabsInfo } from "../types/types";
import TabsWrapper from "../components/Tabs/TabsWrapper";
import Footer from "../components/layouts/Footer";
import Minimap from "../components/Minimap/Minimap";

const layoutStyle = {
  display: "flex",
};

const contentWindowStyle = {
  backgroundColor: "#272822",
  flexGrow: 1,
};

const contentWrapperStyle = {
  // display: "flex",
  // justifyContent: "center",
  position: "relative" as const,
  padding: "0px 30px",
  maxHeight: "calc(100vh - 36px)",
  overflowY: "auto" as const,
};
export default function BlogPostTemplate({
  data, // this prop will be injected by the GraphQL query below.
}: {
  data: BlogMarkdownRemark;
}) {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark;

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div style={layoutStyle}>
      <Menubar />
      <Explorer />
      <div style={contentWindowStyle}>
        <TabsWrapper frontmatter={frontmatter} />
        <div style={contentWrapperStyle}>
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: html }}
            ref={contentRef}
          />
          <Minimap contentRef={contentRef} html={html} />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export const pageQuery = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
      }
    }
  }
`;
