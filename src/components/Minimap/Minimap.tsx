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
      if (!elem || !minimapBoxRef.current) return;
      const curr = elem.scrollTop;
      const total = elem.scrollHeight;
      const view = elem.clientHeight;
      minimapBoxRef.current.style.height = (view / total) * 100 + "%";
      minimapBoxRef.current.style.top = (curr / total) * 100 + "%";
    };

    /**
     * This resizeObserver handles two things
     * 1. it resizes minimap-box on deckdeckgo and katex redering
     * 2. it resizes minimap-box on window resizing
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
   * PART2: handle minimap scroll
   * minimap-box drag triggers ContentWrapper scroll which in turn triggers minimap-box top change.
   */
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.preventDefault(); // Prevent text selection, etc.
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    if (!minimapBoxRef.current || !contentRef.current) return;

    // Calculate new scroll position
    const totalHeight = contentRef.current.scrollHeight;
    const viewHeight = contentRef.current.clientHeight;
    const deltaY = e.movementY / 3;

    // Adjust the scroll position of content based on drag
    const scrollPercentage = deltaY / minimapBoxRef.current.offsetHeight;
    contentRef.current.scrollTop += scrollPercentage * totalHeight;
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

  return (
    <div
      className="minimap-container hide-on-firefox hide-on-1400"
      data-nosnippet
    >
      <div
        className="minimap-box"
        onMouseDown={handleMouseDown}
        ref={minimapBoxRef}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.15)",
          width: "100%",
          position: "absolute",
          right: 0,
          top: 0,
          zIndex: 10,
        }}
      ></div>
      <div
        className="markdown-content"
        style={{ userSelect: "none", padding: "0px 30px" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default Minimap;
