// core
import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { graphql } from "gatsby";

// types
import { BlogMarkdownRemark } from "../types/types";

// components
import Explorer from "../components/Explorers/Explorer";
import Menubar from "../components/_layouts/Menubar";
import TabsWrapper from "../components/Tabs/TabsWrapper";
import Footer from "../components/_layouts/Footer";
import Minimap from "../components/Minimap/Minimap";
import StatusBar from "../components/_layouts/StatusBar";
import { SEO } from "../components/SEO/SEO";
import { LanguageProvider, useLanguage } from "../contexts/LanguageContext";

// markdown custom css
import "../markdownStyle.css";

// katex support
import "katex/dist/katex.min.css";

// deckdeckgo code highlight support
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";
deckDeckGoHighlightElement();

function BlogPostContent({ data }: { data: BlogMarkdownRemark }) {
  const { currentLanguage } = useLanguage();

  // this is for minimap scroll tracking
  const contentRef = useRef<HTMLDivElement>(null);

  // markdown data - select based on language
  const { markdownRemark, translatedMarkdown } = data;
  const translatedNode = translatedMarkdown?.nodes?.[0];
  const selectedMarkdown =
    currentLanguage === "translated" && translatedNode
      ? translatedNode
      : markdownRemark;

  const { frontmatter, html } = selectedMarkdown;

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

export default function BlogPostTemplate({
  data,
}: {
  data: BlogMarkdownRemark;
}) {
  return (
    <LanguageProvider>
      <BlogPostContent data={data} />
    </LanguageProvider>
  );
}

export const pageQuery = graphql`
  query ($id: String!, $slug: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        subtitle
      }
      fields {
        isTranslated
      }
    }
    translatedMarkdown: allMarkdownRemark(
      filter: {
        fields: { isTranslated: { eq: true } }
        frontmatter: { slug: { eq: $slug } }
      }
      limit: 1
    ) {
      nodes {
        html
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          slug
          title
          subtitle
        }
        fields {
          isTranslated
        }
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
