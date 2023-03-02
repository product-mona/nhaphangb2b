import { Pagination } from "antd";
import { isNumber } from "lodash";
import React from "react";
import { DataTable } from "~/components";
import { categoryPaymentData, ECategoryPaymentData } from "~/configs";
import { TColumnsType, TTable } from "~/types/table";
import { _format } from "~/utils";

export const HistoryTransactionVNDTable: React.FC<
  TTable<TUserHistoryTransactionVND> & { filter; handleFilter }
> = ({ data, filter, handleFilter, loading }) => {
  const columns: TColumnsType<TUserHistoryTransactionVND> = [
    {
      dataIndex: "Id",
      title: "ID giao dịch",
      width: 90,
    },
    {
      dataIndex: "Created",
      title: "Ngày giờ",
      render: (date) => <>{_format.getVNDate(date)}</>,
    },
    {
      dataIndex: "Content",
      title: "Nội dung",
    },
    {
      dataIndex: "TradeTypeName",
      title: "Loại giao dịch",
    },
    {
      dataIndex: "Amount",
      title: "Số tiền (VNĐ)",
      align: "right",
      render: (_, record) => {
        return (
          <>{`${record?.Amount > 0 ? (record?.Type === 1 ? "-" : "+") : ""} ${
            isNumber(record?.Amount) && _format.getVND(record?.Amount, " ")
          }`}</>
        );
      },
    },
    {
      dataIndex: "MoneyLeft",
      title: "Số dư (VNĐ)",
      align: "right",
      render: (money) => _format.getVND(money, " "),
    },
  ];

  // const expandable = {
  //   expandedRowRender: (record) => (
  //     <ul className="px-2 text-xs">
  //       <li className="md:hidden justify-between flex py-2">
  //         <span className="font-medium mr-4">Số tiền:</span>
  //         {(isNumber(record.MoneyLeft) && _format.getVND(record.MoneyLeft)) ||
  //           "0 VND"}
  //       </li>
  //       <li className="md:hidden justify-between flex py-2">
  //         <span className="font-medium mr-4">Loại giao dịch:</span>
  //         <div className="text-right">{record.TradeTypeName}</div>
  //       </li>
  //       <li className="lg:hidden justify-between flex py-2">
  //         <span className="font-medium mr-4">Số dư:</span>
  //         {_format.getVND(record.Amount)}
  //       </li>
  //     </ul>
  //   ),
  // };

  return (
    <>
      <DataTable
        {...{
          columns,
          data,
          loading,
          bordered: true,
          // expandable: expandable,
          scroll: { y: 600 },
        }}
      />
      <div className="mt-4 text-right">
        <Pagination
          total={filter?.TotalItems}
          current={filter?.PageIndex}
          pageSize={filter?.PageSize}
          onChange={(page, pageSize) =>
            handleFilter({ ...filter, PageIndex: page, PageSize: pageSize })
          }
        />
      </div>
    </>
  );
};
