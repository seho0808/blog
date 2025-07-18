import React, { useEffect, useState } from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import { loadOpenFolders, saveOpenFolders } from "../../utils/sessionStorage";
import { useLocation } from "@reach/router";
import styled from "@emotion/styled";
import { ArrowImg } from "./Explorer";
import { ExplorerFileNode, FileNode } from "../../types/types";

type Tree = {
  [key: string]: Tree | FileNode;
};

const extractFolderNames = (
  allFiles: { node: ExplorerFileNode }[],
  pathName: string
) => {
  let res = [] as string[];
  allFiles.forEach(({ node }) => {
    if (node.childMarkdownRemark.frontmatter.slug + "/" !== pathName) return;
    res = node.relativePath.split("/").filter(Boolean);
    res.pop(); // remove file name
  });
  return res;
};

/**
 * Uses recursion to create Tree structure for rendering Explorer Tab.
 */
const FileExplorer = () => {
  const location = useLocation();
  const [openFolders, setOpenFolders] = useState<string[]>([]);
  const data: { node: ExplorerFileNode }[] = useStaticQuery(graphql`
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

  /**
   * On initial render, guarantee that all folders(directories) to current page is open.
   * To do so flawlessly, I moved initial openFolders value to be inited here instead.
   **/
  useEffect(() => {
    const openFolders = loadOpenFolders();
    const mustOpen = extractFolderNames(data, location.pathname);
    const merged = Array.from(new Set([...openFolders, ...mustOpen]));
    setOpenFolders(merged);
    saveOpenFolders(merged);
  }, []);

  // convert
  const treeData = transformDataToTree(data);

  /**
   * Flips status of open folder on UI AND Session Storage
   * - Having folder names in string list makes O(n^2) search on render, but
   * n < 200, so shouldn't be too much of an issue.
   * - don't need to use usecallback since renderTree renders anyway due to `openFolders` state change
   * @param folderName folderName to Open or Close
   */
  const handleFolderClick = (folderName: string) => {
    setOpenFolders((prev) => {
      if (prev.includes(folderName)) {
        const newList = prev.filter((n) => n !== folderName);
        saveOpenFolders(newList);
        return newList;
      } else {
        const newList = [...prev, folderName];
        saveOpenFolders(newList);
        return newList;
      }
    });
  };

  return (
    <>
      <SubTitle>
        <ArrowImg src="/icons/arrow-down.svg" alt="arrow-down" />
        LOCAL &#40;seholee.com&#41;
      </SubTitle>

      <TreeWrapper>
        <RenderTree
          tree={treeData}
          currSlug={location.pathname.slice(0, -1)}
          depth={0}
          openTrees={openFolders}
          handleFolderClick={handleFolderClick}
        />
      </TreeWrapper>
    </>
  );
};

/**
 * converts 1d files array into tree structure that parses all directories and files used
 * @param edges
 * @returns object literal that represents a file tree
 */
const transformDataToTree = (edges: { node: ExplorerFileNode }[]) => {
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

/**
 * renders tree data into an actual dom element
 * @param param0
 * @returns Explorer UI
 */
const RenderTree = ({
  tree,
  currSlug,
  depth,
  openTrees,
  handleFolderClick,
}: {
  tree: Tree;
  currSlug: string;
  depth: number;
  openTrees: string[];
  handleFolderClick: (folderName: string) => void;
}) => {
  const files = [];
  const dirs = [];
  for (let key in tree) {
    if (tree[key] && tree[key].title) {
      files.push(tree[key] as FileNode);
    } else if (tree[key]) {
      dirs.push({ dirname: key, tree: tree[key] as Tree });
    }
  }

  files.sort((a, b) => {
    if (a.title > b.title) {
      return 1;
    } else {
      return -1;
    }
  });
  dirs.sort((a, b) => {
    if (a.dirname > b.dirname) {
      return 1;
    } else {
      return -1;
    }
  });

  if (currSlug === "") currSlug = "/"; // exception for main page
  return (
    <Ul>
      {/* ============ FILE RENDER ============ */}
      {/* first, render the file list */}
      {files.map((f) => (
        <li key={f.slug}>
          <Link to={f.slug} style={{ textDecoration: "none", color: "#ccc" }}>
            {/* color background if the file is selected. */}
            <FolderLine selected={currSlug === f.slug}>
              {/* file hierarchy indent is done like this to keep the background color fully colored when selected */}
              <FileIcon
                src="/icons/file-document.svg"
                alt="file-icon"
                depth={depth} // file hierarchy indent
              />
              {f.title}
            </FolderLine>
          </Link>
        </li>
      ))}
      {/* ============ DIRECTORY RENDER ============ */}
      {/* secondly, render the directory(folders) list */}
      {dirs.map((d) => {
        const isOpen = openTrees.includes(d.dirname);
        return (
          <li key={d.dirname}>
            {/* clickable component for folder closing / opening */}
            <FolderLine
              selected={false}
              onClick={() => handleFolderClick(d.dirname)}
            >
              <FileIcon
                src={isOpen ? "/icons/folder-open.svg" : "/icons/folder.svg"}
                depth={depth} // file hierarchy indent
              />
              {d.dirname} ({Object.keys(d.tree).length})
            </FolderLine>
            {/* render children if folder is open */}
            <div style={isOpen ? {} : { display: "none" }}>
              <RenderTree
                tree={d.tree}
                currSlug={currSlug}
                depth={depth + 1}
                openTrees={openTrees}
                handleFolderClick={handleFolderClick}
              />
            </div>
          </li>
        );
      })}
    </Ul>
  );
};

export default FileExplorer;

const TreeWrapper = styled.div`
  margin-top: 0px;
  font-size: 12px;
`;

const Ul = styled.ul`
  list-style-type: none;
  margin: 0px 0px;
  padding: 0px 0px;
  color: #ccc;
`;

const FileIcon = styled.img<{ depth: number }>`
  margin: 0px 8px;
  width: 16px;
  padding-left: ${(props) => 8 * props.depth + "px"};
`;

const FolderLine = styled.div<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? "#414339" : "transparent")};
  padding: 4px 0px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const SubTitle = styled.div`
  background-color: #272822;
  padding: 4px 2px;
  font-size: 12px;
  font-weight: 800;
`;
