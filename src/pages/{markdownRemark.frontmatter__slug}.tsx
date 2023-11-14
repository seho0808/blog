import "../markdownStyle.css";
import React, { useEffect } from "react";
import { graphql } from "gatsby";
import CodeSpace from "../components/layouts/CodeSpace";
import Explorer from "../components/layouts/Explorer";
import Menubar from "../components/layouts/Menubar";
import { BlogMarkdownRemark, TabsInfo } from "../types/types";
import TabsWrapper from "../components/Tabs/TabsWrapper";
import Footer from "../components/layouts/Footer";

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

  return (
    <div style={layoutStyle}>
      <Menubar />
      <Explorer />
      <div style={contentWindowStyle}>
        <TabsWrapper frontmatter={frontmatter} />
        <div style={contentWrapperStyle}>
          {/* <h1>{frontmatter.title}</h1>
          <h2>{frontmatter.date}</h2> */}
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
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
