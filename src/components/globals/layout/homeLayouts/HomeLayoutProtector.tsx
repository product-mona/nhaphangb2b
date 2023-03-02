// import Cookie from "js-cookie";
import React, { useEffect } from "react";
import { setToken } from "~/api";
import {
  getCartInfoByUserId,
  setRouter,
  setUser,
  useAppDispatch,
} from "~/store";
import Cookies from "js-cookie";
import { _format } from "~/utils";

export const HomeLayoutProtector: React.FC<{}> = ({ children }) => {
  const session = Cookies.get("tokenNHTQ-nhaphangb2b");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const dispatchUser = async () => {
      const user: TUser = JSON.parse(
        _format.getJWTDecode(session)[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata"
        ]
      );

      localStorage.setItem("currentUser", JSON.stringify(user));
      dispatch(getCartInfoByUserId(user?.UserId));
      dispatch(setUser(user));
      dispatch(setRouter(user.UserGroupId));

      setToken(session);
    };
    if (session) {
      dispatchUser();
    }
  }, [session]);

  return <>{children}</>;
};
