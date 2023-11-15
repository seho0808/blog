import "../markdownStyle.css";
import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { graphql } from "gatsby";
import CodeSpace from "../components/layouts/CodeSpace";
import Explorer from "../components/layouts/Explorer";
import Menubar from "../components/layouts/Menubar";
import { BlogMarkdownRemark, TabsInfo } from "../types/types";
import TabsWrapper from "../components/Tabs/TabsWrapper";
import Footer from "../components/layouts/Footer";
import Minimap from "../components/Minimap/Minimap";

export default function BlogPostTemplate({
  data, // this prop will be injected by the GraphQL query below.
}: {
  data: BlogMarkdownRemark;
}) {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark;

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <Layout>
      <Menubar />
      <Explorer />
      <ContentWindow>
        <TabsWrapper frontmatter={frontmatter} />
        <ContentWrapper ref={contentRef}>
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <Minimap contentRef={contentRef} html={html} />
          <Footer />
        </ContentWrapper>
      </ContentWindow>
    </Layout>
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

const Layout = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 1050px) {
    flex-direction: column;
  }
`;

const ContentWindow = styled.div`
  background-color: #272822;
  flex-grow: 1;
`;

const ContentWrapper = styled.div`
  position: relative;
  padding: 0px 30px;
  max-height: calc(100vh - 36px);
  overflow-y: auto;
`;
