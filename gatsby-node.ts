import dotenv from "dotenv";
import { GitHubCommit } from "./src/types/types";
import { TranslationService } from "./src/utils/translation";

dotenv.config();

// Translation rate limiting configuration
const TRANSLATION_DELAY_SECONDS = 10;

// Store nodes that need translation
let nodesToTranslate: Array<{
  node: any;
  actions: any;
  createNodeId: any;
  createContentDigest: any;
}> = [];

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}: {
  actions: any;
  createNodeId: any;
  createContentDigest: any;
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

exports.onCreateNode = async ({
  node,
  actions,
  createNodeId,
  createContentDigest,
}: {
  node: any;
  actions: any;
  createNodeId: any;
  createContentDigest: any;
}) => {
  const { createNode } = actions;

  // Only process MarkdownRemark nodes
  if (node.internal.type === "MarkdownRemark") {
    // Add field to original node to mark it as original
    node.fields = {
      ...node.fields,
      isTranslated: false,
    };

    // Skip translation if API key is not set
    if (!process.env.OPENAI_API_KEY) {
      console.log(
        "⚠️  OPENAI_API_KEY not set, skipping translation for:",
        node.frontmatter?.title || "Unknown"
      );
      return;
    }

    // Skip translation in development unless explicitly enabled
    if (
      process.env.NODE_ENV === "development" &&
      !process.env.ENABLE_TRANSLATION
    ) {
      console.log(
        "🚀 Development mode: skipping translation for:",
        node.frontmatter?.title || "Unknown"
      );
      return;
    }

    // Add this node to the translation queue instead of processing immediately
    nodesToTranslate.push({
      node,
      actions,
      createNodeId,
      createContentDigest,
    });
  }
};

// New hook to process all translations sequentially after all nodes are created
exports.onPostBootstrap = async () => {
  if (nodesToTranslate.length === 0) {
    console.log("📝 No nodes require translation");
    return;
  }

  console.log(
    `🌍 Starting sequential translation of ${nodesToTranslate.length} markdown files...`
  );
  console.log(`⏱️  Using ${TRANSLATION_DELAY_SECONDS}s delay between requests`);

  const translationService = new TranslationService();

  for (let i = 0; i < nodesToTranslate.length; i++) {
    const { node, actions, createNodeId, createContentDigest } =
      nodesToTranslate[i];
    const { createNode, createNodeField } = actions;

    try {
      console.log(
        `\n📄 [${i + 1}/${nodesToTranslate.length}] Processing: ${
          node.frontmatter?.title || "Unknown"
        }`
      );

      // Get the original content
      const originalContent = node.internal.content;

      // Generate translation
      const translatedContent = await translationService.translateContent(
        originalContent
      );

      // Only create translated node if content actually changed
      if (translatedContent !== originalContent) {
        // Create a new node for the translated version
        const translatedNodeId = createNodeId(`${node.id}-translated`);

        // Create clean node without Gatsby-managed fields
        const translatedNode = {
          // Copy basic node properties
          children: [],
          parent: node.parent,

          // Copy frontmatter and other safe properties
          frontmatter: node.frontmatter,
          excerpt: node.excerpt,
          rawMarkdownBody: node.rawMarkdownBody,
          fileAbsolutePath: node.fileAbsolutePath,

          // Set new ID
          id: translatedNodeId,

          // Create clean internal object with different type
          internal: {
            type: "TranslatedMarkdown",
            mediaType: "text/markdown",
            content: translatedContent,
            contentDigest: createContentDigest(translatedContent),
          },
        };

        await createNode(translatedNode);

        // Add the isTranslated field using createNodeField
        createNodeField({
          node: translatedNode,
          name: "isTranslated",
          value: true,
        });

        console.log(`✅ Created translated version`);
      } else {
        console.log(`📝 No translation needed (content unchanged)`);
      }

      // Wait before next translation (except for the last one)
      if (i < nodesToTranslate.length - 1) {
        console.log(
          `⏱️  Waiting ${TRANSLATION_DELAY_SECONDS}s before next translation...`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, TRANSLATION_DELAY_SECONDS * 1000)
        );
      }
    } catch (error) {
      console.warn(
        `❌ Failed to create translation for "${
          node.frontmatter?.title || "Unknown"
        }":`,
        (error as Error).message
      );
      // Don't throw - just skip this translation and continue
    }
  }

  console.log(
    `\n🎉 Translation process completed! Processed ${nodesToTranslate.length} files`
  );

  // Clear the queue
  nodesToTranslate = [];
};
