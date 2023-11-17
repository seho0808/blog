import { GitHubCommit } from "./src/types/types";

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions;

  // Fetch data from GitHub API
  const response = await fetch(
    "https://api.github.com/repos/seho0808/blog/commits"
  );
  const commits = await response.json();
  const commit: GitHubCommit = commits[0]; // only save the lastest commit record
  const nodeContent = JSON.stringify(commit);
  const nodeMeta = {
    id: createNodeId(`commit-${commit.sha}`),
    parent: null,
    children: [],
    internal: {
      type: `GitHubCommit`,
      mediaType: `text/html`,
      content: nodeContent,
      contentDigest: createContentDigest(commit),
    },
  };
  const node = { ...commit, ...nodeMeta };
  createNode(node);
};
