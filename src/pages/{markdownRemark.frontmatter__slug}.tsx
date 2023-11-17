import "../markdownStyle.css";
import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { graphql } from "gatsby";
import CodeSpace from "../components/layouts/CodeSpace";
import Explorer from "../components/Explorers/Explorer";
import Menubar from "../components/layouts/Menubar";
import { BlogMarkdownRemark, TabsInfo } from "../types/types";
import TabsWrapper from "../components/Tabs/TabsWrapper";
import Footer from "../components/layouts/Footer";
import Minimap from "../components/Minimap/Minimap";
import StatusBar from "../components/layouts/StatusBar";
import { SEO } from "../components/SEO/SEO";
import FileExplorer from "../components/Explorers/Explorer";

export default function BlogPostTemplate({
  data, // this prop will be injected by the GraphQL query below.
}: {
  data: BlogMarkdownRemark;
}) {
  // this is for minimap scroll tracking
  const contentRef = useRef<HTMLDivElement>(null);

  // markdown data
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark;

  // explorer toggle logic
  const [showExplorer, setShowExplorer] = useState<boolean>(true);
  const [explorerType, setExplorerType] = useState<"file" | "search">("file");
  useEffect(() => {
    const isMobile = window.innerWidth <= 1050;
    setShowExplorer(!isMobile);

    // resize handling
    const handleResize = () => {
      setShowExplorer(window.innerWidth > 1050);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <OuterLayout>
      <SEO
        title={frontmatter.title}
        pathname={frontmatter.slug}
        description={frontmatter.subtitle}
      />
      <WindowsLayout>
        {/* explorer, search selector */}
        <Menubar
          setShowExplorer={setShowExplorer}
          setExplorerType={setExplorerType}
          explorerType={explorerType}
        />
        {/* explorer window */}
        <Explorer showExplorer={showExplorer} explorerType={explorerType} />
        {/* content window */}
        <ContentWindow>
          <TabsWrapper frontmatter={frontmatter} />
          <ContentWrapper ref={contentRef}>
            <article
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
        subtitle
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

const ContentWrapper = styled.main`
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