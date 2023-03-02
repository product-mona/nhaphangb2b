import { Tag } from "antd";
import React from "react";
import { DataTable } from "~/components";
import { complainStatus, reportStatus } from "~/configs/appConfigs";
import { TColumnsType, TTable } from "~/types/table";
import { _format } from "~/utils";

export const ReportListTable: React.FC<TTable<TReport>> = ({
  data,
  loading,
  pagination,
  handlePagination,
}) => {
  const columns: TColumnsType<TReport> = [
    {
      dataIndex: "MainOrderId",
      title: "Mã đơn hàng",
      width: 120,
    },
    {
      dataIndex: "ComplainText",
      title: "Nội dung",
    },
    {
      dataIndex: "Amount",
      align: "right",
      title: "Tiền bồi thường (VNĐ)",
      render: (money) => _format.getVND(money, ""),
    },
    {
      dataIndex: "Created",
      align: "right",
      title: "Ngày tạo",
      render: (date) => <div>{_format.getVNDate(date)}</div>,
    },
    {
      dataIndex: "Status",
      title: "Trạng thái",
      render: (status, record) => (
        <Tag color={reportStatus[status]?.color}>{record?.StatusName}</Tag>
      ),
      width: 200,
    },
  ];

  return (
    <DataTable
      {...{
        columns,
        data,
        loading,
        bordered: false,
        pagination,
        onChange: handlePagination,
        scroll: { y: 600 },
      }}
    />
  );
};
