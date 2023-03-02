import { Tag } from "antd";
import React from "react";
import { ActionButton, DataTable } from "~/components";
import { ERechargeStatusData, rechargeStatusData } from "~/configs/appConfigs";
import { TColumnsType, TTable } from "~/types/table";
import { _format } from "~/utils";

export const HistoryRechargeVNDTable: React.FC<
  TTable<TUserHistoryRechargeVND>
> = ({ data, pagination, handlePagination, loading, handleModal }) => {
  const columns: TColumnsType<TUserHistoryRechargeVND> = [
    {
      dataIndex: "Id",
      title: "ID đơn",
      width: 80,
    },
    {
      title: "Nội dung",
      dataIndex: "TradeContent",
      responsive: ["md"],
    },
    {
      dataIndex: "Amount",
      title: "Số tiền nạp (VNĐ)",
      align: "right",
      render: (money) => _format.getVND(money, " "),
      width: 140,
    },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      render: (status) => (
        <Tag color={rechargeStatusData[status - 1].color}>
          {rechargeStatusData[status - 1].name}
        </Tag>
      ),
      responsive: ["lg"],
      width: 200,
    },
    {
      title: "Ngày nạp",
      dataIndex: "Created",
      render: (date) => _format.getVNDate(date),
      responsive: ["xl"],
      width: 200,
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      align: "right",
      render: (_, record) =>
        record?.Status === ERechargeStatusData.Pending && (
          <ActionButton
            onClick={() => handleModal(record)}
            icon="far fa-trash-alt"
            title="Xóa"
          />
        ),
      responsive: ["xl"],
      width: 100,
    },
  ];

  const expandable = {
    expandedRowRender: (record) => (
      <ul className="px-2 text-xs">
        <li className="justify-between flex py-2">
          <span className="font-medium mr-4">Ngày nạp:</span>
          <div>{_format.getVNDate(record.Created)}</div>
        </li>
        <li className="justify-between flex py-2">
          <span className="font-medium mr-4">Thao tác:</span>
          {record?.Status === ERechargeStatusData.Pending && (
            <ActionButton
              onClick={() => handleModal(record)}
              icon="far fa-trash-alt"
              title="Xóa"
            />
          )}
        </li>
      </ul>
    ),
  };

  return (
    <div className=" bg-white rounded-sm py-4">
      <p className="text-base text-[#595857] px-4">LỊCH SỬ NẠP GẦN ĐÂY</p>
      <div className="mt-4">
        <DataTable
          {...{
            columns,
            data,
            pagination,
            onChange: handlePagination,
            loading,
            expandable: expandable,
            scroll: { y: 600 },
          }}
        />
      </div>
    </div>
  );
};
