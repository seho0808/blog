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
     * overlay update happens only whenever updateMinimap happens.
     */
    let overlayTimer: ReturnType<typeof setInterval>;
    const updateOverlayHeightWithDebounce = () => {
      clearTimeout(overlayTimer);
      overlayTimer = setTimeout(() => {
        updateOverlayHeight();
      }, 100); // debouncing with 0.1 second timeout
    };

    /**
     * update Minimap is triggered in four situations
     * 1. scrollListener: When markdown(ContentWrapper) is scrolled by the user
     * 2. When minimap-box is scrolled by the user => triggers markdown scroll so #1 is triggerd
     * 3. resizeObserver: When user resizes the browser and ContentWrapper is resized
     * 4. resizeObserver: When components inside ContentWrapper is rendered (i.e. deckdeckgo, latex)
     */
    const updateMinimap = () => {
      let elem = contentRef.current;
      if (!elem || !minimapBoxRef.current || !minimapContRef.current) return;
      const curr = elem.scrollTop;
      const total = elem.scrollHeight;
      const view = elem.clientHeight;
      // minimapBox Height
      minimapBoxRef.current.style.height = (view / total) * 100 + "%";

      // minimap Box scrollTop
      // TODO: need robust solution to fix additional margin
      const actualMinimapContHeight = minimapContRef.current.scrollHeight;
      minimapBoxRef.current.style.top =
        (curr / total) * actualMinimapContHeight + "px";

      // update MinimapContainer's scrollTop
      // from minimapContainer's perspective, clientHeight is the scroll thumb height.
      const maxScrollable =
        actualMinimapContHeight - minimapContRef.current.clientHeight;

      minimapContRef.current.scrollTop = (curr / total) * maxScrollable;

      updateOverlayHeightWithDebounce();
    };

    /**
     * This resizeObserver handles three things
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
   * ClickPreventOverlay is absolute and its parent is fixed.
   * Overlay's height gets rendered to the height of the viewport initially.
   * To extend Overlay's height beyond the viewport, we trigger resizing of Overlay when
   * deckdeckgo and katex is rendered.
   */
  const updateOverlayHeight = () => {
    if (!overlayRef.current || !minimapContRef.current) return;
    overlayRef.current.style.height =
      minimapContRef.current.scrollHeight + "px";
  };

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
    const minimapHeight = minimapContRef.current?.offsetHeight || 0;
    const boxHeight = minimapBoxRef.current?.offsetHeight || 0;
    const relativeMovement = e.movementY / (minimapHeight - boxHeight);
    const customConstant = 0.9; // custom constant for speed management

    // this makes it almost same speed for all markdown length, but not 100% same speed.
    contentRef.current.scrollTop +=
      customConstant * relativeMovement * contentRef.current.scrollHeight;
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
    if (!contentRef.current || !minimapContRef.current) return;

    // Get the Y position of the click relative to the minimap
    const minimapRect = minimapContRef.current.getBoundingClientRect();
    const clickYRelativeToMinimap = e.clientY - minimapRect.top;

    // Calculate the ratio
    const scrollRatio = clickYRelativeToMinimap / minimapRect.height;

    // Apply this ratio to the main content's scrollable height
    const targetScrollTop =
      scrollRatio *
      (contentRef.current.scrollHeight - contentRef.current.clientHeight);
    contentRef.current.scrollTop = targetScrollTop;
  };

  return (
    <MinimapContainer data-nosnippet ref={minimapContRef}>
      <MinimapBox onMouseDown={handleMouseDown} ref={minimapBoxRef} />
      <PreventClickOverlay ref={overlayRef} onClick={targetScroll} />
      <MinimapMarkdownContent
        className="markdown-content"
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
  max-height: calc(100vh - 24px - 36px);

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
  z-index: 11;
`;

const PreventClickOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0);
  z-index: 10;
`;

const MinimapMarkdownContent = styled.div`
  zoom: 0.15;
  user-select: none;
  padding: 0px 30px;
`;
