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
    `gatsby-transformer-remark`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-react-helmet`,
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
