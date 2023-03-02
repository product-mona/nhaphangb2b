import { Menu, Tooltip } from "antd";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useCallback, useState } from "react";
import { userRouter } from "~/configs/routers";
import { Layout } from "../mainLayouts";
import styles from "./index.module.css";
import Marquee from "react-fast-marquee";
import { useQuery } from "react-query";
import configHomeData from "~/api/config-home";
import { toast } from "react-toastify";

export const UserLayout: FC<{}> = ({ children }) => {
  const { route } = useRouter();

  const [dropdown, setDropdown] = useState("");
  const handleDropdown = useCallback((name: string) => {
    setDropdown((dropdown) => (dropdown != name ? name : ""));
  }, []);

  const [hover, setHover] = useState(true);
  const [tabbar, setTabbar] = useState(false);

  const { data } = useQuery(["homeConfig"], () => configHomeData.get(), {
    onSuccess: (res) => {
      const data = res?.Data;
    },
    onError: toast.error,
    // retry: false,
    refetchOnMount: false,
    // refetchOnWindowFocus: false,
  });

  return (
    <Layout userPage>
      <div
        className={clsx(
          styles.navigation,
          hover && styles.expand,
          !hover && "hidden md:block"
        )}
      >
        <div className="container">
          <Menu className={clsx(styles.list)}>
            {userRouter.map((item, index) => (
              <React.Fragment key={index}>
                {item.controllers.map((subItem) => (
                  <React.Fragment key={subItem.name}>
                    <Menus
                      {...{
                        ...subItem,
                        sidebarTabbar: tabbar,
                        sidebarHovered: hover,
                        dropdown: dropdown === subItem.name,
                        handleDropdown: () => handleDropdown(subItem.name),
                        activeRouter:
                          subItem?.childrens?.some(
                            (item) => item.path === route
                          ) ?? subItem.path === route,
                        subItemName: subItem.name,
                      }}
                    ></Menus>
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
            {/* <Menu>
							<Menu.SubMenu>
								<Menu.Item>
									<Link href={data?.data?.CocCocExtensionLink ?? "/"}>
										<a target="_blank" className={styles.btnExt}>
											<img src="/logo-coccoc.png" alt="" width={30} height={30} />
											<span>Cốc Cốc</span>
										</a>
									</Link>
								</Menu.Item>
								<Menu.Item>
									<Link href={data?.data?.ChromeExtensionLink ?? "/"}>
										<a target="_blank" className={styles.btnExt}>
											<img src="/logo-chrome.png" alt="" width={30} height={30} />
											<span>Chrome</span>
										</a>
									</Link>
								</Menu.Item>
							</Menu.SubMenu>
						</Menu> */}
            {/* <Dropdown
							overlay={
								<Menu>
									<Menu.Item>
										<Link href={data?.data?.CocCocExtensionLink ?? "/"}>
										<a target="_blank" className={styles.btnExt}>
											<img src="/logo-coccoc.png" alt="" width={30} height={30} />
											<span>Cốc Cốc</span>
										</a>
										</Link>
									</Menu.Item>
									<Menu.Item>
										<Link href={data?.data?.ChromeExtensionLink ?? "/"}>
											<a target="_blank" className={styles.btnExt}>
												<img src="/logo-chrome.png" alt="" width={30} height={30} />
												<span>Chrome</span>
											</a>
										</Link>
									</Menu.Item>
								</Menu>
							}
						>
							Cài đặt công cụ
						</Dropdown> */}
          </Menu>
        </div>
      </div>
      {data?.Data?.NotiRun && (
        <Marquee
          direction="right"
          speed={70}
          gradient={false}
          style={{
            height: "36px",
            background: "#0c5964db",
            color: "#fff",
            fontSize: "20px",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          <i className="fas fa-bullhorn mr-4 rotate-[-20deg]"></i>
          {data?.Data?.NotiRun}
        </Marquee>
      )}
      <div className={`${styles.toolsExt}`}>
        <Link href={data?.Data?.CocCocExtensionLink ?? "/"}>
          <a target="_blank" className={styles.icon}>
            <Tooltip title="Cài đặt công cụ trên Cốc Cốc" placement="right">
              <img src="/logo-coccoc.png" alt="" width={30} height={30} />
            </Tooltip>
          </a>
        </Link>
        <Link href={data?.Data?.ChromeExtensionLink ?? "/"}>
          <a target="_blank" className={styles.icon}>
            <Tooltip title="Cài đặt công cụ trên Chrome" placement="right">
              <img src="/logo-chrome.png" alt="" width={30} height={30} />
            </Tooltip>
          </a>
        </Link>
      </div>
      <div className={`${styles.mainUserPage} container`}>{children}</div>
    </Layout>
  );
};

type TMenu = {
  // router
  path: string;
  icon: string;
  name: string;
  childrens?: {
    path: string;
    name: string;
  }[];
  subItemName: string;

  // animation
  sidebarHovered: boolean;
  sidebarTabbar: boolean;
  activeRouter: boolean;
  dropdown: boolean;
  handleDropdown: () => void;
};

const Menus: FC<TMenu> = ({
  icon,
  sidebarHovered,
  name,
  path,
  childrens,
  activeRouter,
  dropdown,
  subItemName,
  handleDropdown,
  sidebarTabbar,
}) => {
  return (
    <ul className="" style={{ width: "calc(7/12 * 100%)" }}>
      <li onClick={handleDropdown} className={`${styles.item}`}>
        {!childrens?.length ? (
          <>
            <Link href={path}>
              <a className={clsx(styles.link, activeRouter && styles.active)}>
                <span className={clsx(styles.span, "mb-4")}>
                  <i className={clsx(icon, styles.icon)}></i>
                </span>
                <span className="flex items-center">
                  <span className={styles.title}>{name}</span>
                  {!!childrens?.length && (
                    <span className={styles.arrow}>
                      <i className="fal fa-angle-right"></i>
                    </span>
                  )}
                </span>
              </a>
            </Link>
          </>
        ) : (
          <a className={clsx(styles.link, activeRouter && styles.active)}>
            <span className={clsx(styles.span, "mb-4")}>
              <i className={clsx(icon, styles.icon)}></i>
            </span>
            <span className="flex items-center">
              <span className={styles.title}>{name}</span>
              {!!childrens?.length && (
                <span
                  className={clsx(
                    styles.arrow,
                    ((sidebarHovered && activeRouter) ||
                      (dropdown && sidebarHovered)) &&
                      "rotate-90"
                  )}
                >
                  <i className="fal fa-angle-right"></i>
                </span>
              )}
            </span>
          </a>
        )}
        {!!childrens?.length && (
          <ul
            className={`${styles.dropdown} absolute`}
            style={{
              height: dropdown && sidebarHovered ? 50 * childrens.length : 0,
            }}
          >
            {childrens.map((children) => (
              <li key={children.name} className={`${styles.item}`}>
                <Link href={children.path}>
                  <a className={clsx(styles.link)}>
                    <span className={`${styles.title}`}>{children.name}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    </ul>
  );
};
