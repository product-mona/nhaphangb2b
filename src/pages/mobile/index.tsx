import { Collapse } from "antd";
import { useState } from "react";
import { MobileLayout } from "~/components/globals/layout/mobileLayout";
import {
  Money,
  Order,
  Payment,
  Report,
  Surplus,
  ToolList,
  Transport,
} from "~/components/screens/mobile";

import { TNextPageWithLayout } from "~/types/layout";

const headerStyles = `flex justify-between items-center w-full`;
const headerTitle = ``;
const headerIcon = ` mr-2 bg-[#0c5963] rounded-[100%] text-[#fff] py-[5px] px-[6px]`;
const headerText = ``;
const headerArrow = `transition-all text-[#fe4e15] text-[16px]`;

const HeaderCus = ({ title, icon, keyActive, defaultActiveKey }) => {
  return (
    <div className={headerStyles}>
      <div>
        <span className={headerIcon}>
          <i className={`${icon} text-[12px]`}></i>
        </span>
        <span className={headerText}>{title}</span>
      </div>
      <span
        className={headerArrow}
        style={{
          transform:
            defaultActiveKey?.filter((k) => k === keyActive).length > 0
              ? "rotate3d(1, 0, 0, 180deg)"
              : "unset",
        }}
      >
        <i className="fas fa-chevron-circle-down"></i>
      </span>
    </div>
  );
};

const Index: TNextPageWithLayout = () => {
  const [defaultActiveKey, setDefaultActiveKey] = useState(["1", "2", "3"]);
  const componentsInfo = [
    {
      key: "1",
      title: "Mua hộ",
      icon: "fas fa-shopping-basket",
      comp: <Order />,
    },
    {
      key: "2",
      title: "Ký gửi",
      icon: "fas fa-dolly",
      comp: <Transport />,
    },
    {
      key: "3",
      title: "Thanh toán hộ",
      icon: "fas fa-credit-card",
      comp: <Payment />,
    },
    {
      key: "4",
      title: "Tài chính",
      icon: "fas fa-hands-usd",
      comp: <Money />,
    },
    {
      key: "5",
      title: "Kiểm tra",
      icon: "fas fa-shield-check",
      comp: <Report />,
    },
  ];

  return (
    <div className="mobileHome">
      <ToolList />
      <Surplus />
      {/* <Notification /> */}
      <Collapse
        defaultActiveKey={defaultActiveKey}
        expandIconPosition={"right"}
        className="mobile-collapse"
        onChange={(x: any) => setDefaultActiveKey(x)}
      >
        {componentsInfo?.map((compo) => (
          <Collapse.Panel
            key={compo?.key}
            header={
              <HeaderCus
                title={compo?.title}
                icon={compo?.icon}
                keyActive={compo?.key}
                defaultActiveKey={defaultActiveKey}
              />
            }
            showArrow={false}
            collapsible={"header"}
          >
            {compo.comp}
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  );
};

Index.displayName = "Mobile view";
Index.Layout = MobileLayout;

export default Index;
