import React, { useEffect } from "react";
import { graphql } from "gatsby";
import CodeSpace from "../components/layouts/CodeSpace";
import Explorer from "../components/layouts/Explorer";
import Menubar from "../components/layouts/Menubar";
import { BlogMarkdownRemark, TabsInfo } from "../types/types";
import TabsWrapper from "../components/Tabs/TabsWrapper";

const layoutStyle = {
  display: "flex",
};

const contentWindowStyle = {
  backgroundColor: "#272822",
  flexGrow: 1,
};

const contentWrapperStyle = {
  paddingLeft: "20px",
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
          <h1>{frontmatter.title}</h1>
          <h2>{frontmatter.date}</h2>
          <div dangerouslySetInnerHTML={{ __html: html }} />
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
