import React, { useEffect, useState } from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import { loadTabsInfo, saveTabsInfo } from "../../utils/sessionStorage";
import { TabsInfo } from "../../types/types";

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

type Tree = {
  [key: string]: Tree | string;
};

const PostList = () => {
  const data: { node: Node }[] = useStaticQuery(graphql`
    query {
      allFile {
        edges {
          node {
            relativePath
            name
            childMarkdownRemark {
              frontmatter {
                slug
                date
              }
            }
          }
        }
      }
    }
  `).allFile.edges;
  console.log(data);
  const treeData = transformDataToTree(data);
  console.log(data, treeData);

  return (
    <div>
      <RenderTree tree={treeData} />
    </div>
  );
};

const transformDataToTree = (edges: { node: Node }[]) => {
  const tree = {} as Tree;

  edges.forEach(({ node }) => {
    const pathParts = node.relativePath.split("/").filter(Boolean);
    let currentLevel = tree;

    pathParts.forEach((part, index) => {
      // last one is file
      if (index === pathParts.length - 1) {
        currentLevel[part] = "file";
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

const RenderTree = ({ tree }: { tree: Tree }) => {
  const files = [];
  const dirs = [];
  for (let key in tree) {
    if (tree[key] === "file") {
      files.push(key);
    } else {
      dirs.push({ dirname: key, tree: tree[key] as Tree });
    }
  }

  return (
    <>
      <ul>
        {files.map((f) => (
          <li key={f}>{f}</li>
        ))}
        {dirs.map((d) => (
          <li key={d.dirname}>
            {d.dirname}
            <RenderTree tree={d.tree} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default PostList;
