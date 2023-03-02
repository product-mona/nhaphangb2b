import { useState } from "react";
import { useQuery } from "react-query";
import { reportHistoryPayWallet } from "~/api";
import {
  Layout,
  showToast,
  TransactionChart,
  TransactionFilter,
  TransactionTable,
} from "~/components";
import { breadcrumb } from "~/configs";
import { SEOConfigs } from "~/configs/SEOConfigs";
import { selectUser, useAppSelector } from "~/store";
import { TNextPageWithLayout } from "~/types/layout";
import { _format } from "~/utils";

const Index: TNextPageWithLayout = () => {
  const { user: userStore } = useAppSelector(selectUser);
  if (!userStore) return null;
  const [filter, setFilter] = useState({
    PageIndex: 1,
    PageSize: 999999,
    OrderBy: "Id desc",
    FromDate: null,
    ToDate: null,
  });
  const [chartData, setChartData] = useState<Record<string, number>>(null);
  const handleFilter = (newFilter) => setFilter({ ...filter, ...newFilter });

  const { data, isFetching, isLoading } = useQuery(
    ["clientTransactionReportData", { filter }],
    () => reportHistoryPayWallet.getList(filter).then((res) => res.Data),
    {
      onSuccess: (data) => {
        setChartData({
          TotalAmount: data?.Items[0]?.TotalAmount,
          TotalDeposit: data?.Items[0]?.TotalDeposit,
          TotalReciveDeposit: data?.Items[0]?.TotalReciveDeposit,
          TotalPaymentBill: data?.Items[0]?.TotalPaymentBill,
          TotalAdminSend: data?.Items[0]?.TotalAdminSend,
          TotalWithDraw: data?.Items[0]?.TotalWithDraw,
          TotalCancelWithDraw: data?.Items[0]?.TotalCancelWithDraw,
          TotalComplain: data?.Items[0]?.TotalComplain,
          TotalPaymentTransport: data?.Items[0]?.TotalPaymentTransport,
          TotalPaymentHo: data?.Items[0]?.TotalPaymentHo,
          TotalPaymentSaveWare: data?.Items[0]?.TotalPaymentSaveWare,
          TotalRecivePaymentTransport:
            data?.Items[0]?.TotalRecivePaymentTransport,
        });
      },
      onError: () => {
        showToast({
          title: "Lỗi!",
          message: "Đường truyền kết nối server bị lỗi! Vui lòng thử lại!",
          type: "error",
        });
      },
    }
  );

  return (
    <div className="tableBox">
      <TransactionFilter handleFilter={handleFilter} />
      <div className="text-lg text-[#333]">
        Tổng số tiền giao dịch:{" "}
        <span className="font-bold">
          {_format.getVND(data?.Items[0]?.TotalAmount)}
        </span>
      </div>
      <TransactionChart dataChart={chartData} />
      <div className="mt-10">
        <TransactionTable
          {...{
            data: data?.Items,
            loading: isFetching,
          }}
        />
      </div>
    </div>
  );
};

Index.displayName = SEOConfigs.statistical.transaction;
Index.breadcrumb = breadcrumb.statistical.transaction;
Index.Layout = Layout;

export default Index;
