import { Image } from "antd";
import clsx from "clsx";
import Cookies from "js-cookie";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { user as userApi } from "~/api";
import {
  ForgotPasswordForm,
  RegisterForm,
  SignInForm,
} from "~/components/screens/auth";
import { getLevelId, socialList } from "~/configs";
import {
  selectConnection,
  selectFirstPageDashboard,
  useAppSelector,
} from "~/store";
import { _format } from "~/utils";
import Navbar from "../Navbar";
import styles from "./index.module.css";
// import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

const Header = ({ dataConfig, dataMenu }) => {
  const isLogOut = localStorage.getItem("currentUser");
  const user = useAppSelector((state) => state.user.current);
  const userId = user?.UserId;
  const firstPage = useAppSelector(selectFirstPageDashboard);
  const connection = useAppSelector(selectConnection);
  const [openModal, setOpenModal] = useState("");

  if (dataConfig) {
    socialList?.forEach((social) => (social.link = dataConfig[social.title]));
  }

  const { data: dataUser } = useQuery(
    ["clientData", userId],
    () => userApi.getByID(userId),
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!userId && isLogOut !== null,
    }
  );

  // Handling scroll effect
  const [y, setY] = useState(window.scrollY);

  const handleNavigation = useCallback((e) => setY(window.scrollY), [y]);

  useEffect(() => {
    setY(window.scrollY);
    window.addEventListener("scroll", handleNavigation);

    return () => {
      window.removeEventListener("scroll", handleNavigation);
    };
  }, [handleNavigation]);

  return (
    <>
      <header className={styles.fixed}>
        <div
          className={clsx(
            styles.headerTop,
            `${y > 0 ? styles.headerTopHidden : ""}`
          )}
        >
          <div className="container">
            <div className={styles.headerTopInner}>
              <div className={clsx(styles.left, " lg:block hidden")}>
                <Link href="/">
                  <a className="flex items-center">
                    <div className={styles.logo}>
                      <Image
                        src={`${dataConfig?.LogoIMG}` ?? "/new_logo.png"}
                        // src="/main-logo.png"
                        alt=""
                        width={"100%"}
                        style={{
                          filter:
                            " drop-shadow(3px 6px 2px rgba(0, 0, 0, 0.2))",
                        }}
                        height={"auto"}
                        preview={false}
                      />
                    </div>
                    <span className={styles.branchName}>NHAPHANGB2B</span>
                  </a>
                </Link>
              </div>
              <div className="flex font-semibold text text-orange h-8 items-center">
                <a href={`tel:${dataConfig?.HotlineSupport}`}>
                  <div className="flex w-fit text-[18px] !mx-2">
                    <span className={styles.headerTopLinkAuth}>Tư vấn:</span>
                    <span className="text-[#4A8916]">
                      {dataConfig?.HotlineSupport}
                    </span>
                  </div>
                </a>
                <a href={`tel:${dataConfig?.Hotline}`}>
                  <div className="flex w-fit text-[18px] !mx-2">
                    <span className={styles.headerTopLinkAuth}>Hotline:</span>
                    <span className="text-[#4A8916]">
                      {dataConfig?.Hotline}
                    </span>
                  </div>
                </a>
              </div>
              <div className="flex items-center">
                {!user?.UserId || isLogOut === null ? (
                  <div className="login-user flex items-center justify-end">
                    <a
                      className={styles.headerTopLinkAuth}
                      onClick={() => setOpenModal("register")}
                    >
                      Đăng Ký
                    </a>
                    <span className={styles.headerTopLinkAuth}>
                      &nbsp;/&nbsp;
                    </span>
                    <a
                      className={styles.headerTopLinkAuth}
                      onClick={() => setOpenModal("signIn")}
                    >
                      Đăng Nhập
                    </a>
                  </div>
                ) : (
                  <div className="relative group">
                    <Link href={firstPage ? firstPage : "/user"}>
                      <a className="uppercase font-semibold flex text !text-[#4A8916] login-user flex items-center">
                        <i className="text-[##4A8916] text fas fa-user mr-2"></i>
                        <div>{user?.UserName || "Anonymus"} </div>
                      </a>
                    </Link>
                    <div className="z-50 rounded-[12px] shadow-xl group-hover:scale-100 scale-0 transition-all duration-300 origin-[88%_-6%] before:content-[''] before:absolute before:right-[24px] before:top-[-28px] before:border-solid before:border-[14px] before:border-[transparent] before:border-b-[#464646] absolute right-[-20px] top-[40px] w-[300px] overflow-hidden">
                      <div className={styles.expandInforHeader}>
                        {
                          <span
                            className={`${dataUser?.Data?.LevelId} font-semibold text-lg`}
                          >
                            {getLevelId[dataUser?.Data?.LevelId]?.Name}
                          </span>
                        }
                      </div>
                      <div className="bg-white">
                        <div className="p-4 bg-[#f8f8f8]">
                          <div className="flex mb-2 items-center justify-between">
                            <span className="text-sm font-semibold text-[#000]">
                              Level
                            </span>
                            {
                              <span
                                className={`${
                                  dataUser?.Data?.LevelId > 3
                                    ? "text-[#8a64e3]"
                                    : "text-orange"
                                } font-semibold text-xs`}
                              >
                                {getLevelId[dataUser?.Data?.LevelId]?.Name}
                              </span>
                            }
                          </div>
                          <div className="h-5 bg-[#ebebeb] rounded-xl p-[2px]">
                            <div
                              className="rounded-[9px] bg-[#4A8916] bg-custom h-full"
                              style={{
                                width: `${
                                  (dataUser?.Data?.LevelId * 100) / 9
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-[#000] flex p-4 items-center justify-between">
                          <span className="text-sm font-semibold">Số dư:</span>
                          <span className="text-sm font-bold text-[#4A8916]">
                            {dataUser?.Data?.Wallet !== 0
                              ? _format.getVND(dataUser?.Data?.Wallet)
                              : "0 VNĐ"}
                          </span>
                        </div>
                        <Link href={firstPage ? firstPage : "/user"}>
                          <a>
                            <div className="hover:text-[#4A8916] text-[#000] transition-all duration-300 flex bg-[#f8f8f8] p-4 items-center justify-between">
                              <span className="text-sm font-semibold">
                                Quản trị:
                              </span>
                              <span className="text-sm font-bold text-[#4A8916]">
                                <i className="fas fa-caret-right"></i>
                              </span>
                            </div>
                          </a>
                        </Link>
                        <Link href={"/user/cart"}>
                          <a>
                            <div className="hover:text-[#4A8916] text-[#000] transition-all duration-300 flex p-4 items-center justify-between">
                              <span className="text-sm font-semibold">
                                Giỏ hàng của bạn:
                              </span>
                              <span className="text-sm font-bold text-[#4A8916]">
                                <i className="fas fa-caret-right"></i>
                              </span>
                            </div>
                          </a>
                        </Link>
                        <Link href={"/user/info-users"}>
                          <a>
                            <div className="hover:text-[#4A8916] text-[#000] transition-all duration-300  bg-[#f8f8f8] flex p-4 items-center justify-between">
                              <span className="text-sm font-semibold">
                                Thông tin tài khoản:
                              </span>
                              <span className="text-sm font-bold text-[#4A8916]">
                                <i className="fas fa-caret-right"></i>
                              </span>
                            </div>
                          </a>
                        </Link>
                      </div>
                      <div
                        className={`cursor-pointer !py-[10px] !text-[16px] ${styles.expandInforHeader}`}
                        onClick={() => {
                          connection &&
                            connection.invoke(
                              "leave",
                              user.UserId.toString(),
                              user.UserGroupId.toString()
                            );
                          localStorage.removeItem("currentUser");
                          Cookies.remove("tokenNHTQ-nhaphangb2b");
                          window.location.reload();
                        }}
                      >
                        Đăng xuất
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.headerBottom}>
          <div className="container">
            <div className="justify-start xl:justify-center flex items-center">
              <Navbar dataConfig={dataConfig} dataMenu={dataMenu} />
            </div>
          </div>
        </div>
      </header>

      <SignInForm
        setOpenModal={(target) => setOpenModal(target)}
        visible={openModal === "signIn" ? true : false}
      />
      <RegisterForm
        setOpenModal={(target) => setOpenModal(target)}
        visible={openModal === "register" ? true : false}
      />
      <ForgotPasswordForm
        setOpenModal={(target) => setOpenModal(target)}
        visible={openModal === "forgetPassword" ? true : false}
      />
    </>
  );
};

export default Header;
