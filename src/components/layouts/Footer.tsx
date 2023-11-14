import React from "react";

export default function Footer() {
  return (
    <div style={footerWrapperStyle}>
      <span className="text-red">Copyright&nbsp;</span>
      <span className="text-purple">©&nbsp;</span>
      <span className="text-skyblue">2023</span>
      <a href="/" style={atagStyle}>
        &nbsp;Seho Lee&nbsp;
      </a>
      <span className="text-orange">All Rights Reserved</span>
      <span className="text-yellow">.</span>
    </div>
  );
}

const footerWrapperStyle = {
  fontFamily: "Pretendard",
  height: "60px",
  paddingTop: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#b4b4b4",
  fontSize: "14px",
};

const atagStyle = {
  textDecoration: "none",
  color: "#a6e22e",
};
