// import Cookie from "js-cookie";
import React from "react";

export const MobileProtector: React.FC<{}> = ({ children }) => {
  return <div className="mobileContainer">{children}</div>;
};
