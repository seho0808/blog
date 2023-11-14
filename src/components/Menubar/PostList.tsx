import React, { useEffect, useState } from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import { loadTabsInfo, saveTabsInfo } from "../../utils/sessionStorage";
import { TabsInfo } from "../../types/types";
import { useLocation } from "@reach/router";

// TODO: check if slug and title structure and graphql usage is optimal
type Node = {
  relativePath: string;
  name: string;
  childMarkdownRemark: {
    frontmatter: {
      title: string;
      slug: string;
    };
  };
};

type FileNode = {
  title: string;
  slug: string;
};

type Tree = {
  [key: string]: Tree | FileNode;
};

const PostList = () => {
  const location = useLocation();
  const data: { node: Node }[] = useStaticQuery(graphql`
    query {
      allFile {
        edges {
          node {
            relativePath
            name
            childMarkdownRemark {
              frontmatter {
                title
                slug
              }
            }
          }
        }
      }
    }
  `).allFile.edges;
  const treeData = transformDataToTree(data);

  return (
    <div style={treeWrapperStyle}>
      <RenderTree
        tree={treeData}
        currSlug={location.pathname.slice(0, -1)}
        depth={0}
      />
    </div>
  );
};

//TODO: detailed commenting on this file.
const transformDataToTree = (edges: { node: Node }[]) => {
  const tree = {} as Tree;

  edges.forEach(({ node }) => {
    const filename = node.name;
    const slug = node.childMarkdownRemark.frontmatter.slug;
    const title = node.childMarkdownRemark.frontmatter.title;
    const pathParts = node.relativePath.split("/").filter(Boolean);
    let currentLevel = tree;

    pathParts.forEach((part, index) => {
      // last one is file
      if (index === pathParts.length - 1) {
        currentLevel[filename] = { title: title, slug: slug };
        return;
      }
      // rest are directory
      if (!currentLevel[part]) {
        currentLevel[part] = {};
      }
      currentLevel = currentLevel[part] as Tree;
    });
  });

  return tree;
};

const RenderTree = ({
  tree,
  currSlug,
  depth,
}: {
  tree: Tree;
  currSlug: string;
  depth: number;
}) => {
  const files = [];
  const dirs = [];
  for (let key in tree) {
    if (tree[key].title) {
      files.push(tree[key] as FileNode);
    } else {
      dirs.push({ dirname: key, tree: tree[key] as Tree });
    }
  }

  return (
    <ul style={ulStyle}>
      {files.map((f) => (
        <Link to={f.slug} style={linkStyle} key={f.slug}>
          <li style={liStyle}>
            <div
              style={
                currSlug === f.slug
                  ? { ...lineStyle, backgroundColor: "#414339" }
                  : lineStyle
              }
            >
              {/* file hierarchy indent is done like this to keep the background color fully colored when selected */}
              <img
                src="/file-document.svg"
                style={{ ...iconStyle, paddingLeft: `${10 * depth}px` }} // file hierarchy indent
              />
              {f.title}
            </div>
          </li>
        </Link>
      ))}
      {dirs.map((d) => (
        <li key={d.dirname} style={liStyle}>
          <div style={lineStyle}>
            <img
              src="/folder.svg"
              style={{ ...iconStyle, paddingLeft: `${10 * depth}px` }} // file hierarchy indent
            />
            {d.dirname}
          </div>
          <RenderTree tree={d.tree} currSlug={currSlug} depth={depth + 1} />
        </li>
      ))}
    </ul>
  );
};

export default PostList;

const treeWrapperStyle = {
  marginTop: "0px",
};

const ulStyle = {
  listStyleType: "none",
  margin: "0px 0px",
  padding: "0px 0px",
  color: "#ccc",
};

const liStyle = {};

const linkStyle = { textDecoration: "none", color: "#ccc" };

const iconStyle = {
  margin: "0px 10px",
  width: "20px",
};

const lineStyle = {
  padding: "4px 0px",
  display: "flex",
  alignItems: "center",
};
