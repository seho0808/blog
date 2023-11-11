export interface TabsInfo {
  title: string;
  slug: string;
  date: string;
}
export interface BlogMarkdownRemark {
  markdownRemark: {
    html: string;
    frontmatter: TabsInfo;
  };
}
