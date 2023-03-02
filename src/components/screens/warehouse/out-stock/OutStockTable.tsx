import { Tag } from "antd";
import Link from "next/link";
import router from "next/router";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { outStockSession } from "~/api";
import { DataTable, IconButton, showToast } from "~/components";
import { smallPackageStatusData } from "~/configs/appConfigs";
import { TColumnsType, TTable } from "~/types/table";

export const OutStockTable: React.FC<
  TTable<TWarehouseVN> & { UID: number }
> = ({ data, UID }) => {
  const [idsExport, setIdsExport] = useState([]);

  const columns: TColumnsType<TWarehouseCN> = [
    {
      dataIndex: "MainOrderId",
      title: "Order ID",
      render: (_, record) => {
        return (
          <a
            target={"_blank"}
            onClick={() =>
              router.push({
                pathname: "/manager/order/order-list/detail",
                query: {
                  id: record?.MainOrderId
                    ? record?.MainOrderId
                    : record?.TransportationOrderId,
                },
              })
            }
          >
            {record?.MainOrderId
              ? record?.MainOrderId
              : record?.TransportationOrderId}
          </a>
        );
      },
    },
    {
      dataIndex: "OrderTypeName",
      title: "Loại ĐH",
      render: (_) => {
        return <Tag color={_ === "Đơn ký gửi" ? "blue" : "green"}>{_}</Tag>;
      },
    },
    {
      dataIndex: "IsPackged",
      title: "Đơn hàng",
      render: (_, record) => (
        <div className="flex">
          <div className="mx-1">
            <p className="font-medium">KĐ</p>
            {record.IsCheckProduct ? (
              <i className="fas fa-check-circle text-xl text-success"></i>
            ) : (
              <i className="fas fa-times-circle text-xl text-warning"></i>
            )}
          </div>
          <div className="mx-1">
            <p className="font-medium">ĐG</p>
            {record.IsPackged ? (
              <i className="fas fa-check-circle text-xl text-success"></i>
            ) : (
              <i className="fas fa-times-circle text-xl text-warning"></i>
            )}
          </div>
          <div className="mx-1">
            <p className="font-medium">BH</p>
            {record.IsInsurance ? (
              <i className="fas fa-check-circle text-xl text-success"></i>
            ) : (
              <i className="fas fa-times-circle text-xl text-warning"></i>
            )}
          </div>
        </div>
      ),
    },
    {
      dataIndex: "OrderTransactionCode",
      title: "Mã vận đơn",
    },
    {
      dataIndex: "Weight",
      title: "Cân nặng (kg)",
      align: "right",
    },
    {
      dataIndex: "VolumePayment",
      title: "Khối (m3)",
      align: "right",
    },
    {
      dataIndex: "LWH",
      title: "Kích thước",
      align: "right",
    },
    {
      dataIndex: "Status",
      title: "Trạng thái",
      render: (status, record) => (
        <Tag color={smallPackageStatusData.find((x) => x.id === status)?.color}>
          {smallPackageStatusData.find((x) => x.id === status)?.name}
        </Tag>
      ),
    },
  ];

  // const expandable = {
  //   expandedRowRender: (record, index) => (
  //     <ul className="px-2 text-xs">
  //       <li className="sm:hidden justify-between flex py-2">
  //         <span className="font-medium mr-4">Loại ĐH:</span>
  //         <div>{record.OrderTypeName}</div>
  //       </li>
  //       <li className="sm:hidden justify-between flex py-2">
  //         <span className="font-medium mr-4">Đơn hàng:</span>
  //         <div className="flex justify-center">
  //           <div className="mx-1">
  //             <p className="font-medium">KĐ</p>
  //             {record.IsCheckProduct ? (
  //               <i className="fas fa-check-circle text-xl text-success"></i>
  //             ) : (
  //               <i className="fas fa-times-circle text-xl text-warning"></i>
  //             )}
  //           </div>
  //           <div className="mx-1">
  //             <p className="font-medium">ĐG</p>
  //             {record.IsPackged ? (
  //               <i className="fas fa-check-circle text-xl text-success"></i>
  //             ) : (
  //               <i className="fas fa-times-circle text-xl text-warning"></i>
  //             )}
  //           </div>
  //           <div className="mx-1">
  //             <p className="font-medium">BH</p>
  //             {record.IsInsurance ? (
  //               <i className="fas fa-check-circle text-xl text-success"></i>
  //             ) : (
  //               <i className="fas fa-times-circle text-xl text-warning"></i>
  //             )}
  //           </div>
  //         </div>
  //       </li>
  //       <li className="md:hidden justify-between flex py-2">
  //         <span className="font-medium mr-4">Cân nặng (KG):</span>
  //         <div>{record.Weight}</div>
  //       </li>
  //       <li className="md:hidden justify-between flex py-2">
  //         <span className="font-medium mr-4">Kích thước:</span>
  //         <div>{record.LWH}</div>
  //       </li>
  //       <li className="lg:hidden justify-between flex py-2">
  //         <span className="font-medium mr-4">Tổng ngày lưu kho:</span>
  //         <div>{record.TotalDateInLasteWareHouse}</div>
  //       </li>
  //       <li className="xl:hidden justify-between flex py-2">
  //         <span className="font-medium mr-4">Trạng thái:</span>
  //         <div>
  //           <Tag
  //             color={
  //               smallPackageStatusData.find((x) => x.id === record.Status)
  //                 ?.color
  //             }
  //           >
  //             {smallPackageStatusData.find((x) => x.id === record.Status)?.name}
  //           </Tag>
  //         </div>
  //       </li>
  //     </ul>
  //   ),
  // };

  const queryClient = useQueryClient();
  const mutationAdd = useMutation((data: any) => outStockSession.create(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("outStockSession");
      mutationAdd.reset();
      toast.success("Xuất kho thành công");
    },
    onError: (error) =>
      showToast({
        title: (error as any)?.response?.data?.ResultCode,
        message: (error as any)?.response?.data?.ResultMessage,
        type: "error",
      }),
  });

  const handleOutStock = () => {
    outStockSession
      .create({
        UID: UID,
        Note: "",
        SmallPackageIds: idsExport,
      })
      .then((res) => {
        router.push({
          pathname: "/manager/warehouse/out-stock/detail",
          query: { id: res?.Data?.Id },
        });
      });
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-green font-semibold">
          Đã quét được <span className="text-orange">{data?.length}</span> kiện
        </div>
        <div>
          {idsExport.length > 0 && (
            <IconButton
              onClick={() => handleOutStock()}
              btnClass="!mr-4"
              icon="fas fa-hand-holding-box"
              btnIconClass="!mr-2"
              title="Xuất kho các kiện đã chọn!"
              toolip=""
            />
          )}
        </div>
      </div>
      <DataTable
        {...{
          data: data,
          columns: columns,
          // expandable: expandable,
          rowSelection: {
            type: "checkbox",
            onChange: (val) => setIdsExport(val),
          },
        }}
      />
    </div>
  );
};
