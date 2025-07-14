import styled from "@emotion/styled";
import * as React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function Menubar({
  setShowExplorer,
  setExplorerType,
  explorerType,
}: {
  setShowExplorer: Function;
  setExplorerType: Function;
  explorerType: "file" | "search";
}) {
  const { currentLanguage, toggleLanguage } = useLanguage();

  const folderClickHandler = () => {
    if (explorerType === "file") {
      setShowExplorer((v: boolean) => !v);
    } else {
      setShowExplorer(true);
      setExplorerType("file");
    }
  };

  const searchClickHandler = () => {
    if (explorerType === "search") {
      setShowExplorer((v: boolean) => !v);
    } else {
      setShowExplorer(true);
      setExplorerType("search");
    }
  };

  return (
    <Nav>
      <IconWrapper selected={explorerType === "file"}>
        <Icon
          src="/icons/folder-menu.svg"
          onClick={folderClickHandler}
          alt="folder-icon"
        />
      </IconWrapper>
      <IconWrapper selected={explorerType === "search"}>
        <Icon
          src="/icons/magnify.svg"
          onClick={searchClickHandler}
          alt="search-icon"
        />
      </IconWrapper>

      {/* Language Toggle */}
      <LanguageToggleWrapper>
        <LanguageToggle
          onClick={toggleLanguage}
          isTranslated={currentLanguage === "translated"}
        >
          <ToggleSlider isTranslated={currentLanguage === "translated"} />
          <ToggleLabels>
            <ToggleLabel active={currentLanguage === "original"}>
              원본
            </ToggleLabel>
            <ToggleLabel active={currentLanguage === "translated"}>
              번역
            </ToggleLabel>
          </ToggleLabels>
        </LanguageToggle>
      </LanguageToggleWrapper>

      <MediaLinks>
        <Github href="https://github.com/seho0808">
          <Icon src="/images/github.png" alt="github" />
        </Github>
        <LinkedIn href="https://www.linkedin.com/in/seho-lee-5922a2173/">
          in
        </LinkedIn>
      </MediaLinks>
    </Nav>
  );
}

const Nav = styled.nav`
  padding-top: 12px;
  background-color: #272822;
  display: flex;
  gap: 16px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: calc(100vh - 12px);
  width: 48px;
  user-select: none;

  @media (max-width: 1050px) {
    padding-top: 0px;
    padding-left: 14px;
    position: fixed;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100vw;
    height: 48px;
  }
`;

const IconWrapper = styled.div<{ selected: boolean }>`
  border-left: ${(props) =>
    props.selected ? "2px solid #aaa" : "2px solid transparent"};
  border-right: 2px solid transparent;
  width: calc(100% - 4px);
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 1050px) {
    width: fit-content;
    border: none;
  }
`;

const Icon = styled.img`
  width: 24px;
  cursor: pointer;
`;

const MediaLinks = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 48px;
  align-items: center;
  gap: 16px;

  @media (max-width: 1050px) {
    flex-direction: row;
    padding: 0px;
    padding-right: 28px;
    justify-content: center;
    margin: 0;
    margin-left: auto;
  }
`;

const Github = styled.a`
  display: flex;
  align-items: center;
  filter: grayscale(100%) brightness(70%) contrast(90%);
`;

const LinkedIn = styled.a`
  display: block;
  font-size: 24px;
  color: #aaa;
  text-decoration: none;
  font-weight: 600;
`;

const LanguageToggleWrapper = styled.div`
  margin-top: 16px;
  padding: 8px 0;

  @media (max-width: 1050px) {
    margin: 0;
    margin-right: 16px;
  }
`;

const LanguageToggle = styled.div<{ isTranslated: boolean }>`
  position: relative;
  width: 40px;
  height: 60px;
  background-color: #3a3a3a;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: 1px solid #555;

  &:hover {
    background-color: #444;
  }

  @media (max-width: 1050px) {
    width: 50px;
    height: 24px;
    border-radius: 12px;
  }
`;

const ToggleSlider = styled.div<{ isTranslated: boolean }>`
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: #61dafb;
  border-radius: 50%;
  transition: transform 0.3s ease;
  transform: translateY(${(props) => (props.isTranslated ? "40px" : "6px")});
  left: 50%;
  margin-left: -8px;

  @media (max-width: 1050px) {
    width: 20px;
    height: 20px;
    margin-left: -10px;
    transform: translateX(${(props) => (props.isTranslated ? "22px" : "2px")})
      translateY(2px);
  }
`;

const ToggleLabels = styled.div`
  position: absolute;
  left: -20px;
  right: -20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  font-size: 8px;
  pointer-events: none;

  @media (max-width: 1050px) {
    flex-direction: row;
    left: -25px;
    right: -25px;
    top: -20px;
    height: auto;
  }
`;

const ToggleLabel = styled.span<{ active: boolean }>`
  color: ${(props) => (props.active ? "#61dafb" : "#888")};
  font-weight: ${(props) => (props.active ? "600" : "400")};
  transition: color 0.3s ease;
  user-select: none;
`;
