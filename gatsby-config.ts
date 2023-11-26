import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  pathPrefix: "",
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/src/content`,
      },
    },
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 1100,
              wrapperStyle: "display: flex; justify-content: center;",
            },
          },
          {
            resolve: `gatsby-remark-highlight-code`,
            options: {
              terminal: "carbon",
              theme: "monokai",
              lineNumbers: true,
            },
          },
          {
            resolve: `gatsby-remark-katex`,
            options: {
              // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
              strict: `ignore`,
            },
          },
        ],
      },
    },
  ],
  siteMetadata: {
    author: `Seho Lee`,
    title: `Seho Lee`,
    description: `Web Dev / Software Engineer Seho Lee`,
    image: `/apple-touch-icon.png`,
    siteUrl: `https://seholee.com`,
    twitterUsername: `@seho08`,
  },
};

export default config;
