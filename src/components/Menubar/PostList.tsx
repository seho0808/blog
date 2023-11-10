import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";

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

  return (
    <div>
      <ul>
        {data.allMarkdownRemark.edges.map(({ node }: any) => (
          <Link to={node.frontmatter.slug}>
            <li key={node.id}>{node.frontmatter.title}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
