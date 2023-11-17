import React, { useState } from "react";
import styled from "@emotion/styled";
import { useStaticQuery, graphql } from "gatsby";
import { ExplorerFileNode, FileNode } from "../../types/types";

export default function SearchExplorer() {
  const data: FileNode[] = useStaticQuery(graphql`
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
  `).allFile.edges.map(({ node }: { node: ExplorerFileNode }) => ({
    slug: node.childMarkdownRemark.frontmatter.slug,
    title: node.childMarkdownRemark.frontmatter.title,
  }));
  const [searchRes, setSearchRes] = useState<FileNode[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value.toLowerCase();
    if (key === "") {
      setSearchRes([]);
    } else {
      setSearchRes(data.filter((f) => f.title.toLowerCase().includes(key)));
    }
  };

  return (
    <>
      <SearchInput
        type="text"
        placeholder={`Filter ${data.length} posts by title`}
        onChange={handleChange}
      />

      <Ul>
        {searchRes.map((f) => {
          return (
            <Li>
              <Icon src="file-document.svg" />
              {f.title}
            </Li>
          );
        })}
      </Ul>
    </>
  );
}

const SearchInput = styled.input`
  margin: 0px 12px;
  background-color: #414339;
  outline: none;
  color: #ccc;
  border: none;
  height: 20px;
  border-radius: 2px;
  padding: 4px 8px;
`;

const Ul = styled.ul`
  list-style-type: none;
  padding: 0px;
  margin: 12px 12px;
`;

const Li = styled.li`
  font-size: 12px;
  padding: 4px 0px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Icon = styled.img`
  width: 16px;
`;
