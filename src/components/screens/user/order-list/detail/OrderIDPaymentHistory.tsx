import { Tag } from "antd";
import React from "react";
import { DataTable } from "~/components";
import { formalPaymentData } from "~/configs";
import { TColumnsType, TTable } from "~/types/table";
import { _format } from "~/utils";

export const OrderIDPaymentHistory: React.FC<TTable<TPayOrderHistory>> = ({
  data,
}) => {
  const columns: TColumnsType<TPayOrderHistory> = [
    {
      dataIndex: "Id",
      title: "ID",
    },
    {
      dataIndex: "Type",
      title: "Hình thức thanh toán",
      render: (record) => {
        const type = formalPaymentData.find((item) => item.id === record);
        return <Tag color={type.color}>{type?.name}</Tag>;
      },
      responsive: ["md"],
    },
    {
      dataIndex: "Amount",
      align: "right",
      title: "Số tiền (VNĐ)",
      render: (money) => _format.getVND(money, " "),
      responsive: ["lg"],
    },
    {
      dataIndex: "Created",
      title: "Ngày thanh toán",
      render: (date) => <>{_format.getVNDate(date)}</>,
    },
    {
      dataIndex: "StatusName",
      align: "right",
      title: "Loại thanh toán",
      render: (record) => <>{record}</>,
      responsive: ["sm"],
    },
  ];

  // const expandable = {
  // 	expandedRowRender: (record) => (
  // 		<ul className="px-2 text-xs">
  // 			<li className="sm:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Loại thanh toán:</span>
  // 				{<Tag color={record.Category !== 1 ? "yellow" : "red"}>{record.categoryName}</Tag>}
  // 			</li>
  // 			<li className="md:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Hình thức thanh toán:</span>
  // 				{record.form || "0"}
  // 			</li>
  // 			<li className="lg:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Số tiền:</span>
  // 				{record.money}
  // 			</li>
  // 		</ul>
  // 	),
  // };

  return (
    <div className="tableBox rounded-b-none mt-4">
      <div className="titleTable">Lịch sử thanh toán</div>
      <DataTable
        {...{
          columns,
          data,
          bordered: true,
          // expandable: expandable,
        }}
      />
    </div>
  );
};
