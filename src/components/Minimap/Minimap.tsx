import React, { useState, useEffect, useRef } from "react";
// Import necessary libraries like html2canvas if using that approach

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
   * PART1: send original scroll info to minimap
   */
  const updateMinimap = (curr: number, total: number, view: number) => {
    if (!minimapBoxRef.current) return;
    console.log((total / view) * 100 + "");
    minimapBoxRef.current.style.height = (view / total) * 100 + "%";
    minimapBoxRef.current.style.top = (curr / total) * 100 + "%";
  };

  useEffect(() => {
    if (!contentRef.current) return;
    const handleScroll = (e: Event) => {
      let elem = contentRef.current;
      if (!elem) return;
      updateMinimap(elem.scrollTop, elem.scrollHeight, elem.clientHeight);
    };

    // Add event listener
    const contentElement = contentRef.current;
    contentElement.addEventListener("scroll", handleScroll);

    return () => {
      // Remove event listener on cleanup
      contentElement.removeEventListener("scroll", handleScroll);
    };
  }, [contentRef]);

  /**
   * PART2: handle minimap scroll
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
    // Add mouse move and mouse up listeners to window
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="minimap-container hide-on-firefox hide-on-1400">
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
