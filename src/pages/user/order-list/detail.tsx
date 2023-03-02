import router, { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { mainOrder } from "~/api";
import {
  MessageControlUser,
  OrderIDDetail,
  OrderIDPaymentHistory,
  OrderIDProductList,
  OrderOverView,
  OrderTransportList,
  showToast,
  toast,
  UserLayout,
} from "~/components";
import { SEOConfigs } from "~/configs/SEOConfigs";
import { TNextPageWithLayout } from "~/types/layout";

const Index: TNextPageWithLayout = () => {
  const { id } = router.query;
  const { query } = useRouter();

  const { data, isError, isLoading, refetch } = useQuery(
    ["orderList", +query?.id],
    () => mainOrder.getByID(+query?.id),
    {
      onSuccess: (data) => data.Data,
      onError: toast.error,
      retry: false,
      enabled: !!+query?.id,
    }
  );

  const updatePaid = (type: "deposit" | "payment") => {
    mainOrder
      .updateOrder([data?.Data?.Id], {
        Status: type === "deposit" ? 2 : 7,
      })
      .then((res) => {
        console.log(res);
        refetch();
      })
      .catch((error) => {
        showToast({
          title: "Đã xảy ra lỗi!",
          message: (error as any)?.response?.data?.ResultMessage,
          type: "error",
        });
      });
  };

  return (
    <React.Fragment>
      <div className="titlePageUser">Chi tiết đơn hàng #{id}</div>
      <div className="mb-4">
        <div className="sm:grid sm:grid-cols-2 gap-4">
          <div className="col-span-1">
            <OrderOverView data={data?.Data} updatePaid={updatePaid} />
          </div>
          <div className="col-span-1">
            <OrderIDDetail
              data2={data?.Data?.Orders}
              dataAll={data?.Data}
              data={data?.Data?.FeeSupports}
            />
          </div>
        </div>
        {/* <OrderTransportList data={data?.Data?.SmallPackages} /> */}
        <OrderIDProductList data={data?.Data?.Orders} />
        <OrderIDPaymentHistory data={data?.Data?.PayOrderHistories} />
        {data && (
          <MessageControlUser
            clientId={data.Data.UID}
            mainOrderId={+query?.id}
          />
        )}
      </div>
    </React.Fragment>
  );
};

Index.displayName = SEOConfigs.oder.detail;
Index.Layout = UserLayout;

export default Index;
