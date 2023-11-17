import "../markdownStyle.css";
import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { graphql } from "gatsby";
import CodeSpace from "../components/layouts/CodeSpace";
import Explorer from "../components/layouts/Explorer";
import Menubar from "../components/layouts/Menubar";
import { BlogMarkdownRemark, TabsInfo } from "../types/types";
import TabsWrapper from "../components/Tabs/TabsWrapper";
import Footer from "../components/layouts/Footer";
import Minimap from "../components/Minimap/Minimap";
import StatusBar from "../components/layouts/StatusBar";

export default function BlogPostTemplate({
  data, // this prop will be injected by the GraphQL query below.
}: {
  data: BlogMarkdownRemark;
}) {
  // explorer toggle logic
  const isMobile = () => window.innerWidth <= 1050;
  const [showExplorer, setShowExplorer] = useState<boolean>(!isMobile());

  // this is for minimap scroll tracking
  const contentRef = useRef<HTMLDivElement>(null);

  // markdown data
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark;

  return (
    <OuterLayout>
      <WindowsLayout>
        {/* explorer, search selector */}
        <Menubar setShowExplorer={setShowExplorer} />
        {/* explorer window */}
        <Explorer showExplorer={showExplorer} />
        {/* content window */}
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
      </WindowsLayout>
      <StatusBar />
    </OuterLayout>
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

const OuterLayout = styled.div`
  display: flex;
  flex-direction: column;
`;

const WindowsLayout = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100vh - 24px);
  @media (max-width: 1050px) {
    flex-direction: column;
  }
`;

const ContentWindow = styled.div`
  background-color: #272822;
  flex-grow: 1;

  @media (max-width: 1050px) {
    padding-top: 48px; // menubar
    padding-bottom: 24px; // statusbar
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  padding: 0px 30px;
  height: calc(100% - 36px);
  overflow-y: auto;

  @media (max-width: 1050px) {
    height: calc(100vh - 36px - 48px - 24px); // tab, menubar, statusbar
  }

  @media (max-width: 768px) {
    height: calc(100vh - 48px - 24px); // menubar, statusbar
  }
`;
