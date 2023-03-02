import { Tag } from "antd";
import React from "react";
import { ActionButton, DataTable } from "~/components";
import { ERechargeStatusData, moneyStatus } from "~/configs/appConfigs";
import { TColumnsType, TTable } from "~/types/table";
import { _format } from "~/utils";

export const WithDrawalVNDTable: React.FC<TTable<TWithDraw>> = ({
  data,
  loading,
  pagination,
  handlePagination,
  handleModal,
}) => {
  const columns: TColumnsType<TWithDraw> = [
    {
      dataIndex: "Id",
      title: "ID đơn",
    },
    {
      dataIndex: "Created",
      title: "Ngày rút",
      render: (date) => <>{_format.getVNDate(date)}</>,
      responsive: ["xl"],
    },
    {
      dataIndex: "Amount",
      title: "Số tiền rút (VNĐ)",
      align: "right",
      render: (record) => _format.getVND(record, " "),
    },
    {
      dataIndex: "Note",
      title: "Nội dung",
      responsive: ["xl"],
    },
    {
      dataIndex: "Status",
      title: "Trạng thái",
      render: (status, _) => {
        const color = moneyStatus.find((x) => x.id === status);
        return <Tag color={color?.color}>{_?.StatusName}</Tag>;
      },
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      align: "right",
      render: (_, record) => {
        return record?.Status === ERechargeStatusData.Pending ? (
          <ActionButton
            onClick={() => handleModal(record)}
            icon="far fa-trash-alt"
            title="Xóa"
            btnRed
          />
        ) : (
          <></>
        );
      },
    },
  ];

  const expandable = {
    expandedRowRender: (record) => (
      <ul className="px-2 text-xs">
        <li className="justify-between flex py-2">
          <span className="font-medium mr-4">Nội dung:</span>
          <span>{record?.Note}</span>
        </li>
        <li className="justify-between flex py-2">
          <span className="font-medium mr-4">Ngày tạo:</span>
          <span>{_format.getVNDate(record?.Created)}</span>
        </li>
      </ul>
    ),
  };

  return (
    <div className="tableBox">
      <p className="titleTable !py-0">Lịch sử rút tiền</p>
      <div className="mt-4">
        <DataTable
          {...{
            loading,
            columns,
            data,
            style: "secondary",
            pagination,
            onChange: handlePagination,
            expandable: expandable,
          }}
        />
      </div>
    </div>
  );
};
