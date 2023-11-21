import styled from "@emotion/styled";
import React, { useState, useEffect, useRef } from "react";

/**
 * Minimap Component renders the page in small minimap.
 * The event cycle is as below:
 * - User drags minimap-box
 * - the drag changes the scroll location
 * - scroll event triggers minimap-box location to also change
 * - minimap-box is rendered to move along
 **/
const Minimap = ({
  contentRef,
  html,
}: {
  contentRef: React.RefObject<HTMLDivElement>;
  html: string;
}) => {
  const minimapBoxRef = useRef<HTMLDivElement>(null);
  const minimapContRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  /**
   * PART1: minimap sizing and resizing
   */
  useEffect(() => {
    if (!contentRef.current) return;

    /**
     * update Minimap is triggered in four situations
     * 1. scrollListener: When markdown(ContentWrapper) is scrolled by the user
     * 2. When minimap-box is scrolled by the user => triggers markdown scroll so #1 is triggerd
     * 3. resizeObserver: When user resizes the browser and ContentWrapper is resized
     * 4. resizeObserver: When components inside ContentWrapper is rendered (i.e. deckdeckgo, latex)
     */
    const updateMinimap = () => {
      let elem = contentRef.current;
      if (
        !elem ||
        !minimapBoxRef.current ||
        !overlayRef.current ||
        !minimapContRef.current
      )
        return;
      const curr = elem.scrollTop;
      const total = elem.scrollHeight;
      const view = elem.clientHeight;
      minimapBoxRef.current.style.height = (view / total) * 100 + "%";
      minimapBoxRef.current.style.top = (curr / total) * 100 + "%";

      // overlay height fix
      overlayRef.current.style.height =
        minimapContRef.current.clientHeight + "px";
    };

    /**
     * This resizeObserver handles two things
     * 1. it resizes minimap-box & overlay on deckdeckgo and katex redering
     * 2. it resizes minimap-box & overlay on window resizing
     */
    let resizeTimer: ReturnType<typeof setInterval>;
    const resizeObserver = new ResizeObserver((entries) => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateMinimap();
      }, 100); // debouncing with 0.1 second timeout
    });
    resizeObserver.observe(contentRef.current);

    // Add event listener
    const contentElement = contentRef.current;
    contentElement.addEventListener("scroll", updateMinimap);

    return () => {
      // Remove event listener on cleanup
      contentElement.removeEventListener("scroll", updateMinimap);
      // end observer
      resizeObserver.disconnect();
      // clear timeout
      clearInterval(resizeTimer);
    };
  }, [contentRef]);

  /**
   * PART2: handle minimap drag scroll
   * minimap-box drag triggers ContentWrapper scroll which in turn triggers minimap-box top change.
   */
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.preventDefault(); // Prevent text selection, etc.
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    if (!contentRef.current) return;

    // Calculate new scroll position
    contentRef.current.scrollTop += e.movementY * 6.5;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    // move and up listeners only exist while user is dragging!!
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  /**
   * PART 3: handle click minimap target scroll
   */
  const targetScroll = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log(e.pageX, e.screenX, e.clientX);
  };

  return (
    <MinimapContainer data-nosnippet ref={minimapContRef}>
      <MinimapBox onMouseDown={handleMouseDown} ref={minimapBoxRef} />
      <PreventClickOverlay ref={overlayRef} />
      <MinimapMarkdownContent
        onClick={targetScroll}
        className="markdown-content"
        style={{ userSelect: "none", padding: "0px 30px" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </MinimapContainer>
  );
};

export default Minimap;

const MinimapContainer = styled.div`
  position: fixed;
  top: 36px;
  right: 40px;
  max-height: calc(100vh - 36px - 24px);

  overflow: auto; /* Enable scrolling */
  scrollbar-width: none; /* For Firefox */
  -ms-overflow-style: none; /* For Internet Explorer and Edge */
  ::-webkit-scrollbar {
    display: none; /* For Chrome, Safari, and Opera */
  }

  @-moz-document url-prefix() {
    display: none;
  }

  @media (max-width: 1400px) {
    display: none;
  }
`;

const MinimapBox = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
`;

const PreventClickOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0);
`;

const MinimapMarkdownContent = styled.div`
  zoom: 0.15;
`;
