import { Button, Drawer, Dropdown, Grid, Menu, Image } from "antd";
import "antd/dist/antd.css";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";

const { useBreakpoint } = Grid;

const handleSetMenu = (dataMenu) => {
  if (!dataMenu) return;
  const newDataMenu = dataMenu.map((menu) => {
    if (menu?.Children < 0) return menu;
    const newChildren = [];

    for (let i in menu?.Children) {
      if (menu.Children[i].Active) {
        newChildren.push(menu.Children[i]);
      }
    }

    return {
      ...menu,
      Children: newChildren,
    };
  });

  return newDataMenu;
};

const Navbar = ({ dataConfig, dataMenu }) => {
  const { sm, md, lg } = useBreakpoint();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(
    `${router?.query?.code}`.split("/")[0]
  );
  const [visible, setVisible] = useState(false);
  const [newMenu, setNewMenu] = useState(handleSetMenu(dataMenu));

  useEffect(() => {
    if (!dataMenu) return;
    setNewMenu(handleSetMenu(dataMenu));
  }, [dataMenu]);

  useEffect(() => {
    setActiveMenu(`${router?.query?.code}`.split("/")[0]);
  }, [router?.query?.code]);

  return (
    <React.Fragment>
      <div className={styles.mobileHidden}>
        <ul className={styles.MenuList}>
          <li
            key={"trang-chu"}
            className={`${
              (activeMenu === "" || activeMenu === "undefined") &&
              styles.liActive
            }`}
            onClick={() => {
              setActiveMenu("");
              router.push("/");
            }}
          >
            <a>Trang chủ</a>
          </li>
          {newMenu?.map((item) => {
            return item?.Children.length <= 0 ? (
              <React.Fragment key={item?.Id}>
                <li
                  key={item?.Name}
                  className={`${activeMenu === item?.Code && styles.liActive}`}
                  onClick={() => {
                    setActiveMenu(item?.Name);
                  }}
                >
                  <a
                    onClick={() =>
                      router.push({
                        pathname: "/chuyen-muc",
                        query: { code: item?.Link },
                      })
                    }
                  >
                    {item?.Name}
                  </a>
                </li>
              </React.Fragment>
            ) : (
              <Dropdown
                overlay={
                  <Menu>
                    {item?.Children.map((child) => (
                      <Menu.Item key={child?.Id}>
                        <a
                          onClick={() =>
                            router.push({
                              pathname: "/chuyen-muc/detail",
                              query: { code: child?.Link },
                            })
                          }
                        >
                          {child?.Name}
                        </a>
                      </Menu.Item>
                    ))}
                  </Menu>
                }
                key={item?.Id}
              >
                <li
                  key={item?.Name}
                  className={`${activeMenu === item?.Code && styles.liActive}`}
                  onClick={() => {
                    setActiveMenu(item?.Name);
                    // router.push(`/chuyen-muc/${item?.Code}`);
                  }}
                >
                  <a
                    onClick={() =>
                      router.push({
                        pathname: "/chuyen-muc",
                        query: { code: item?.Code },
                      })
                    }
                  >
                    {item?.Name}
                  </a>
                </li>
              </Dropdown>
            );
          })}
        </ul>
      </div>
      <div className={styles.mobileVisible}>
        <div className={styles.mobileVisibleLogo}>
          <Link href="/">
            <a className="flex items-center">
              <Image
                src={`${dataConfig?.LogoIMG}` ?? "/new_logo.png"}
                // src="/main-logo.png"
                alt=""
                width={"100%"}
                style={{
                  filter: " drop-shadow(3px 6px 2px rgba(0, 0, 0, 0.2))",
                }}
                height={"auto"}
                preview={false}
              />
            </a>
          </Link>
        </div>
        <div>
          <Button className={styles.bgColor} onClick={() => setVisible(true)}>
            <i className="fas fa-bars"></i>
          </Button>
          <Drawer
            title={`${dataConfig?.CompanyLongName}`}
            placement="left"
            width={300}
            onClose={() => setVisible(false)}
            visible={visible}
            closable={false}
            style={{ zIndex: "10000000" }}
          >
            <Menu
              className={styles.MenuList}
              mode={lg ? "horizontal" : "inline"}
            >
              <li
                key={"Trang chủ"}
                className={`${
                  (activeMenu === "" || activeMenu === "undefined") &&
                  styles.liActive
                }`}
                onClick={() => {
                  setActiveMenu("Trang chủ");
                  router.push("/");
                }}
              >
                <a>Trang chủ</a>
              </li>
              {newMenu?.map((item) => (
                <li
                  key={item?.Name}
                  className={`${activeMenu === item?.Code && styles.liActive}`}
                  onClick={() => {
                    setActiveMenu(item?.Name);
                    router.push({
                      pathname: "/chuyen-muc",
                      query: { code: item?.Code },
                    });
                  }}
                >
                  <a>{item?.Name}</a>
                </li>
              ))}
            </Menu>
          </Drawer>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Navbar;
