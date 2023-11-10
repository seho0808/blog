import React, { useEffect, useState } from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import { loadTabsInfo, saveTabsInfo } from "../../utils/sessionStorage";
import { TabsInfo } from "../../types/types";

// TODO: check if slug and title structure and graphql usage is optimal
type Node = {
  id: string;
  frontmatter: {
    title: string;
    slug: string;
  };
};

const PostList = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark {
        edges {
          node {
            id
            frontmatter {
              title
              slug
            }
          }
        }
      }
    }
  `);

  /**
   * tabsInfo is only supposed to change the highlight colors of the components.
   * newly clicked post's info is saved to sessionStorage on page load,
   * not when `Link` is clicked.
   */
  const [tabsInfo, setTabsInfo] = useState<TabsInfo[]>(() => loadTabsInfo());
  console.log(tabsInfo);

  const saveBeforeReload = () => {
    saveTabsInfo(tabsInfo);
  };

  return (
    <div>
      <ul>
        {data.allMarkdownRemark.edges.map(({ node }: { node: Node }) => {
          // console.log(node);
          return (
            <Link to={node.frontmatter.slug} key={node.id}>
              <li key={node.id}>{node.frontmatter.title}</li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default PostList;
