import * as React from "react";
import { Link, HeadFC, PageProps } from "gatsby";
import styled from "@emotion/styled";

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <Main>
      <h1>페이지를 찾을 수 없었습니다.</h1>
      <A href="/">
        <div>메인으로</div>
      </A>
    </Main>
  );
};

const Main = styled.main`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #ccc;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const A = styled.a`
  color: #a6e22e;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export default NotFoundPage;
export const Head: HeadFC = () => <title>Not found</title>;
