import { HubConnectionBuilder } from "@microsoft/signalr";
import router from "next/router";
import { FC, ReactElement, useEffect } from "react";
import { setToken } from "~/api/instance";
import {
  getCartInfoByUserId,
  selectConnection,
  selectUser,
  setApiRoles,
  setConnection,
  setRouter,
  setUser,
  useAppDispatch,
  useAppSelector,
} from "~/store";
import { _format } from "~/utils";
import { CheckAdminLayout } from "./AdminLayout";
import Cookies from "js-cookie";

const AuthLayoutProtector: FC<{ children: ReactElement[] | ReactElement }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectUser);
  const UserId = user?.UserId;
  const session = Cookies.get("tokenNHTQ-nhaphangb2b");
  const curUser = localStorage.getItem("currentUser");

  if (!curUser && !session) {
    router.push("/");
    return null;
  }

  useEffect(() => {
    if (!session) return;
    (async () => {
      session && setToken(session);

      const user: TUser = JSON.parse(
        _format.getJWTDecode(session)[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata"
        ]
      );

      dispatch(getCartInfoByUserId(user?.UserId));
      dispatch(setUser(user));
      dispatch(setRouter(user.UserGroupId));
      dispatch(setApiRoles(user));
    })();
  }, [session]);

  useEffect(() => {
    if (!UserId) return;
    (async () => {
      try {
        let connection = new HubConnectionBuilder()
          .withUrl(`${process.env.NEXT_PUBLIC_HUBS_SERVER}`)
          .withAutomaticReconnect()
          .build();

        await connection.start();
        await connection.invoke(
          "join",
          JSON.stringify(user.UserId),
          JSON.stringify(user.UserGroupId)
        );

        dispatch(setConnection(connection));

        return () => {
          connection.stop();
        };
      } catch (err) {
        console.log("error: ", err);
      }
    })();
  }, [UserId]);

  const connection = useAppSelector(selectConnection);
  const connectionId = connection?.connectionId;

  useEffect(() => {
    if (!connectionId) return;
    connection.on("change-temp", (resetCart) => {
      if (!resetCart) return;
      dispatch(getCartInfoByUserId(UserId));
    });
  }, [connectionId]);

  return <CheckAdminLayout>{children}</CheckAdminLayout>;
};

export default AuthLayoutProtector;
