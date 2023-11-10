import React, { useEffect } from "react";
import { graphql } from "gatsby";
import CodeSpace from "../components/layouts/CodeSpace";
import Explorer from "../components/layouts/Explorer";
import Menubar from "../components/layouts/Menubar";
import { loadTabsInfo, saveTabsInfo } from "../utils/sessionStorage";
import { TabsInfo } from "../types/types";

const layoutStyle = {
  display: "flex",
};

export default function BlogPostTemplate({
  data, // this prop will be injected by the GraphQL query below.
}: any) {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark;

  useEffect(() => {
    console.log(frontmatter);
    const oldTabsInfo = loadTabsInfo();
    const isAlreadySaved = oldTabsInfo.some(
      (d: TabsInfo) => d.slug === frontmatter.slug
    );
    if (!isAlreadySaved) {
      saveTabsInfo([...oldTabsInfo, frontmatter]);
    }
  }, []);
  return (
    <div style={layoutStyle}>
      <Menubar />
      <Explorer />
      <div>
        <div>
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
