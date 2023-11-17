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

  // Process and add the commits as nodes in Gatsby
  commits.forEach((commit: GitHubCommit) => {
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
  });
};
