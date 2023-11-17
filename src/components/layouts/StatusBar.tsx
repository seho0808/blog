import React, { useState } from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import styled from "@emotion/styled";

export default function StatusBar() {
  // only fetch github commits on build time. it has rate limiting.
  const { allGitHubCommit } = useStaticQuery(graphql`
    query {
      allGitHubCommit {
        edges {
          node {
            commit {
              author {
                date
                email
                name
              }
            }
            id
          }
        }
      }
    }
  `);

  const last_commit_author = allGitHubCommit.edges[0].node.commit.author.name;
  const last_commit_time = allGitHubCommit.edges[0].node.commit.author.date;
  const last_commit_id = allGitHubCommit.edges[0].node.id;

  return (
    <Layout>
      <Icon>&lt;/&gt;</Icon>
      <StyledA href="https://github.com/seho0808/blog">
        <Summary>
          <div>Latest Commit</div>
          <div>{last_commit_id}</div>
        </Summary>
        <Summary style={{ marginLeft: "auto" }}>
          <div>{last_commit_author}</div>
          <div>{last_commit_time}</div>
        </Summary>
      </StyledA>
    </Layout>
  );
}

const Layout = styled.div`
  width: 100vw;
  height: 24px;
  font-family: "Pretendard";
  background-color: #414339;
  position: fixed;
  bottom: 0;
  display: flex;
  font-size: 12px;
`;

const StyledA = styled.a`
  display: flex;
  text-decoration: none;
  width: 100%;
`;

const Icon = styled.div`
  background-color: #1e1f1c;
  color: #ccc;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 6px;
`;

const Summary = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 20px;
  color: #ccc;
  gap: 10px;
`;
