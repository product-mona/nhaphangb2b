import "antd/dist/antd.css";
import React, { ReactElement } from "react";
import { TlayoutWithChild } from "~/types/layout";
import Header from "./header";
import { MobileProtector } from "./MobileProtector";

export const MobileLayout: TlayoutWithChild & React.FC<{}> = ({ children }) => {
  return (
    <MobileProtector>
      <Header />
      {children}
    </MobileProtector>
  );
};

MobileLayout.getLayout = (page: ReactElement) => (
  <MobileLayout>{page}</MobileLayout>
);
