import { Modal, Space, Tag } from "antd";
import { TableRowSelection } from "antd/lib/table/interface";
import router from "next/router";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { mainOrder, orderShopTemp } from "~/api";
import { ActionButton, DataTable, showToast } from "~/components";
import {
  createdOrderStatusData,
  ECreatedOrderStatusData,
  orderStatus,
} from "~/configs/appConfigs";
import { TColumnsType, TTable } from "~/types/table";
import { _format } from "~/utils";

export const UserAnotherOrderListTable: React.FC<
  TTable<TOrder> & { type; q }
> = ({ data, selectedRowKeys, loading, handleModal, type, q }) => {
  const [delLoading, setDelLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleDeleteProd = async (id: number) => {
    try {
      await mainOrder.delete(id);
      showToast({
        title: "Hủy thành công!",
        message: `Hủy đơn hàng #${id} thành công!`,
        type: "success",
      });
      queryClient.invalidateQueries("orderList");
      setDelLoading(false);
    } catch (error) {
      showToast({
        title: (error as any)?.response?.data?.ResultCode,
        message: (error as any)?.response?.data?.ResultMessage,
        type: "error",
      });
      setDelLoading(false);
    }
  };

  const columns: TColumnsType<TOrder> = [
    {
      dataIndex: "MainOrderCustomID",
      title: "ID đơn",
      // width: 60,
    },
    {
      dataIndex: "ImageOrigin",
      title: "Ảnh",
      align: "center",
      render: (img) => {
        return (
          <div className="flex justify-center m-auto w-20 h-20">
            <img
              src={img ? img : "/pro-empty.jpg"}
              alt="image"
              width={75}
              height={75}
              style={{ borderRadius: "10px" }}
            />
          </div>
        );
      },
      // width: 120,
    },
    {
      dataIndex: "TotalPriceVND",
      title: "Tổng tiền (VNĐ)",
      align: "right",
      responsive: ["md"],
      render: (price) => _format.getVND(price, " "),
      // width: 150,
    },
    {
      dataIndex: "AmountDeposit",
      title: "Số tiền phải cọc (VNĐ)",
      align: "right",
      // width: 150,
      responsive: ["lg"],
      render: (price) => _format.getVND(price, " "),
    },
    {
      dataIndex: "Deposit",
      title: "Số tiền đã cọc (VNĐ)",
      // width: 150,
      align: "right",
      responsive: ["lg"],
      render: (price) => _format.getVND(price, " "),
    },
    // {
    //   dataIndex: "DepositDate",
    //   title: "TimeLine",
    //   width: 240,
    //   render: (_, record) => (
    //     <React.Fragment>
    //       {record.Created && (
    //         <p className="flex justify-between px-2">
    //           <span>Lên đơn: </span>
    //           <span>
    //             {_format.getVNDate(record.Created, "HH:mm")} -
    //             {_format.getVNDate(record.Created, "DD/MM/YYYY")}
    //           </span>
    //         </p>
    //       )}
    //       {record.DepositDate && (
    //         <p className="flex justify-between px-2">
    //           <span>Đặt cọc:</span>
    //           <span>
    //             {_format.getVNDate(record.DepositDate, "HH:mm")} -
    //             {_format.getVNDate(record.DepositDate, "DD/MM/YYYY")}
    //           </span>
    //         </p>
    //       )}
    //       {record.DateBuy && (
    //         <p className="flex justify-between px-2">
    //           <span>Đặt hàng:</span>
    //           <span>
    //             {_format.getVNDate(record.DateBuy, "HH:mm")} -
    //             {_format.getVNDate(record.DateBuy, "DD/MM/YYYY")}
    //           </span>
    //         </p>
    //       )}
    //       {record.DateTQ && (
    //         <p className="flex justify-between px-2">
    //           <span>Đã về kho TQ:</span>
    //           <span>
    //             {_format.getVNDate(record.DateTQ, "HH:mm")} -
    //             {_format.getVNDate(record.DateTQ, "DD/MM/YYYY")}
    //           </span>
    //         </p>
    //       )}
    //       {record.DateVN && (
    //         <p className="flex justify-between px-2">
    //           <span>Đã về kho VN:</span>
    //           <span>
    //             {_format.getVNDate(record.DateVN, "HH:mm")} -
    //             {_format.getVNDate(record.DateVN, "DD/MM/YYYY")}
    //           </span>
    //         </p>
    //       )}
    //       {record.PayDate && (
    //         <p className="flex justify-between px-2">
    //           <span>Thanh toán:</span>
    //           <span>
    //             {_format.getVNDate(record.PayDate, "HH:mm")} -
    //             {_format.getVNDate(record.PayDate, "DD/MM/YYYY")}
    //           </span>
    //         </p>
    //       )}
    //       {record.CompleteDate && (
    //         <p className="flex justify-between px-2">
    //           <span>Hoàn thành:</span>
    //           <span>
    //             {_format.getVNDate(record.CompleteDate, "HH:mm")} -
    //             {_format.getVNDate(record.CompleteDate, "DD/MM/YYYY")}
    //           </span>
    //         </p>
    //       )}
    //     </React.Fragment>
    //   ),
    //   responsive: ["xl"],
    // },
    {
      dataIndex: "Status",
      title: "Trạng thái",
      render: (status, record) => {
        const color = orderStatus.find((x) => x.id === status);
        return <Tag color={color?.color}>{record?.StatusName}</Tag>;
      },
      // width: 140,
      responsive: ["xl"],
    },
    {
      dataIndex: "action",
      title: "Thao tác",
      align: "right",
      render: (_, record) => {
        if (Number(q) === 3) {
          return (
            <Space
              style={{
                pointerEvents: delLoading ? "none" : "all",
                opacity: delLoading ? "0.8" : "1",
              }}
              className="justify-end flex-wrap"
            >
              {Number(q) !== 3 && (
                <ActionButton
                  onClick={() =>
                    Modal.confirm({
                      title: "Xác nhận muốn mua lại đơn hàng này?",
                      onOk: () => {
                        const id = toast.loading("Đang thêm ...");
                        orderShopTemp
                          .addSame({ Id: record?.Id })
                          .then((res) => {
                            toast.update(id, {
                              render:
                                "Thêm đơn thành công, vui lòng kiểm tra giỏ hàng!",
                              type: "success",
                              autoClose: 1000,
                              closeOnClick: true,
                              isLoading: false,
                            });
                          })
                          .catch((error) => {
                            toast.update(id, {
                              render: "Thêm đơn thất bại!",
                              type: "error",
                              isLoading: false,
                            });
                          });
                      },
                    })
                  }
                  icon="fas fa-cart-arrow-down"
                  title="Mua lại đơn hàng này"
                />
              )}

              <ActionButton
                onClick={() =>
                  router.push({
                    pathname: "/user/order-list/detail",
                    query: {
                      id: record?.Id,
                    },
                  })
                }
                icon="far fa-info-square"
                title="Xem chi tiết đơn"
              />
              {record?.Status === ECreatedOrderStatusData.Finished && (
                <ActionButton
                  onClick={() =>
                    router.push({
                      pathname: "/user/report/detail",
                      query: {
                        id: record?.Id,
                      },
                    })
                  }
                  icon="fas fa-balance-scale-right"
                  title="Khiếu nại"
                  btnRed
                />
              )}
              {record.IsCheckNotiPrice && (
                <>
                  {record?.Status === ECreatedOrderStatusData.Undeposited && (
                    <ActionButton
                      onClick={() => {
                        type.current = "deposit";
                        handleModal([record], undefined, "one");
                      }}
                      icon="far fa-dollar-sign"
                      title="Đặt cọc"
                      btnYellow
                    />
                  )}
                  {record?.Status ===
                    ECreatedOrderStatusData.ArrivedToVietNamWarehouse && (
                    <ActionButton
                      onClick={() => {
                        type.current = "payment";
                        handleModal([record], undefined, "one");
                      }}
                      icon="fas fa-credit-card"
                      title="Thanh toán"
                      btnBlue
                    />
                  )}
                </>
              )}
              {record?.Status === 0 && (
                <ActionButton
                  onClick={() =>
                    Modal.confirm({
                      title: "Xác nhận xóa đơn hàng?",
                      onOk: () => handleDeleteProd(record?.Id),
                    })
                  }
                  icon="fas fa-trash"
                  title="Hủy đơn hàng!"
                  btnYellow
                />
              )}
            </Space>
          );
        } else {
          return (
            <Space
              style={{
                pointerEvents: delLoading ? "none" : "all",
                opacity: delLoading ? "0.8" : "1",
              }}
              className="justify-end flex-wrap"
            >
              <ActionButton
                onClick={() =>
                  Modal.confirm({
                    title: "Xác nhận muốn mua lại đơn hàng này?",
                    onOk: () => {
                      const id = toast.loading("Đang thêm ...");
                      orderShopTemp
                        .addSame({ Id: record?.Id })
                        .then((res) => {
                          toast.update(id, {
                            render:
                              "Thêm đơn thành công, vui lòng kiểm tra giỏ hàng!",
                            type: "success",
                            autoClose: 1000,
                            closeOnClick: true,
                            isLoading: false,
                          });
                        })
                        .catch((error) => {
                          toast.update(id, {
                            render: "Thêm đơn thất bại!",
                            type: "error",
                            isLoading: false,
                          });
                        });
                    },
                  })
                }
                icon="fas fa-cart-arrow-down"
                title="Mua lại đơn hàng này"
              />
              <ActionButton
                onClick={() =>
                  router.push({
                    pathname: "/user/order-list/detail",
                    query: {
                      id: record?.Id,
                    },
                  })
                }
                icon="far fa-info-square"
                title="Xem chi tiết đơn"
              />

              {record?.Status === ECreatedOrderStatusData.Finished && (
                <ActionButton
                  onClick={() =>
                    router.push({
                      pathname: "/user/report/detail",
                      query: {
                        id: record?.Id,
                      },
                    })
                  }
                  icon="fas fa-balance-scale-right"
                  title="Khiếu nại"
                  btnRed
                />
              )}
              {record?.Status === ECreatedOrderStatusData.Undeposited && (
                <ActionButton
                  onClick={() => {
                    type.current = "deposit";
                    handleModal([record], undefined, "one");
                  }}
                  icon="far fa-dollar-sign"
                  title="Đặt cọc"
                  btnYellow
                />
              )}
              {record?.Status ===
                ECreatedOrderStatusData.ArrivedToVietNamWarehouse && (
                <ActionButton
                  onClick={() => {
                    type.current = "payment";
                    handleModal([record], undefined, "one");
                  }}
                  icon="fas fa-credit-card"
                  title="Thanh toán"
                  btnBlue
                />
              )}
              {record?.Status === ECreatedOrderStatusData.Undeposited && (
                <ActionButton
                  onClick={() =>
                    Modal.confirm({
                      title: "Xác nhận xóa đơn hàng?",
                      onOk: () => handleDeleteProd(record?.Id),
                    })
                  }
                  icon="fas fa-trash"
                  title="Hủy đơn hàng!"
                  btnYellow
                />
              )}
            </Space>
          );
        }
      },
      responsive: ["xl"],
      width: 120,
      fixed: "right",
    },
  ];

  const rowSelection: TableRowSelection<TOrder> = {
    selectedRowKeys,
    getCheckboxProps: (record) => {
      return record.Status ===
        ECreatedOrderStatusData.ArrivedToVietNamWarehouse ||
        record.Status === ECreatedOrderStatusData.Undeposited
        ? { name: record.Id.toString(), disabled: false }
        : { name: record.Id.toString(), disabled: true, className: "!hidden" };
    },
    onChange: (selectedRowKeys: React.Key[], selectedRows: TOrder[]) =>
      handleModal(selectedRows, undefined, "some"),
    hideSelectAll: true,
  };

  const expandable = {
    expandedRowRender: (record) => (
      <ul className="px-2 text-xs">
        <li className="sm:hidden justify-between flex py-2">
          <span className="font-medium mr-4">Tổng link:</span>
          {record?.TotalLink}
        </li>
        <li className="md:hidden justify-between flex py-2">
          <span className="font-medium mr-4">Website:</span>
          {record.Site}
        </li>
        <li className="md:hidden justify-between flex py-2">
          <span className="font-medium mr-4">Tổng tiền:</span>
          {_format.getVND(record.TotalPriceVND)}
        </li>
        <li className="lg:hidden justify-between flex py-2">
          <span className="font-medium mr-4">Tổng tiền phải cọc:</span>
          {_format.getVND(record.AmountDeposit)}
        </li>
        <li className="lg:hidden justify-between flex py-2">
          <span className="font-medium mr-4">Số tiền đã cọc:</span>
          {_format.getVND(record.Deposit)}
        </li>
        <li className="xl:hidden flex  justify-between py-2">
          <span className="font-medium  mr-4">Ngày đặt:</span>
          <div className="min-w-[30%]">
            {record.Created && (
              <p className="flex justify-between">
                <span>Lên đơn: </span>
                <span>{_format.getVNDate(record.Created)}</span>
              </p>
            )}
            {record.DepositDate && (
              <p className="flex justify-between">
                <span>Đặt cọc:</span>
                <span>{_format.getVNDate(record.DepositDate)}</span>
              </p>
            )}
            {record.DateBuy && (
              <p className="flex justify-between">
                <span>Đặt hàng: </span>
                <span>{_format.getVNDate(record.DateBuy)}</span>
              </p>
            )}
            {record.DateTQ && (
              <p className="flex justify-between">
                <span>Đã về kho TQ: </span>
                <span>{_format.getVNDate(record.DateTQ)} </span>
              </p>
            )}
            {record.DateVN && (
              <p className="flex justify-between">
                <span>Đã về kho VN: </span>
                <span>{_format.getVNDate(record.DateVN)}</span>
              </p>
            )}
            {record.PayDate && (
              <p className="flex justify-between">
                <span>Thanh toán: </span>
                <span>{_format.getVNDate(record.PayDate)}</span>
              </p>
            )}
            {record.CompleteDate && (
              <p className="flex justify-between">
                <span>Hoàn thành: </span>
                <span>{_format.getVNDate(record.CompleteDate)}</span>
              </p>
            )}
          </div>
        </li>
        <li className="xl:hidden justify-between flex py-2">
          <span className="font-medium mr-4">Trạng thái:</span>
          <Tag
            color={
              createdOrderStatusData.find((x) => x.id === record?.Status)?.color
            }
          >
            {record?.StatusName}
          </Tag>
        </li>
        <li className="xl:hidden justify-between flex py-2">
          <span className="font-medium mr-4">Thao tác:</span>
          {Number(q) === 3 ? (
            <Space
              style={{
                pointerEvents: delLoading ? "none" : "all",
                opacity: delLoading ? "0.8" : "1",
              }}
              className="justify-end flex-wrap"
            >
              <ActionButton
                onClick={() =>
                  Modal.confirm({
                    title: "Xác nhận muốn mua lại đơn hàng này?",
                    onOk: () => {
                      const id = toast.loading("Đang thêm ...");
                      orderShopTemp
                        .addSame({ Id: record?.Id })
                        .then((res) => {
                          toast.update(id, {
                            render:
                              "Thêm đơn thành công, vui lòng kiểm tra giỏ hàng!",
                            type: "success",
                            autoClose: 1000,
                            closeOnClick: true,
                            isLoading: false,
                          });
                        })
                        .catch((error) => {
                          toast.update(id, {
                            render: "Thêm đơn thất bại!",
                            type: "error",
                            isLoading: false,
                          });
                        });
                    },
                  })
                }
                icon="fas fa-cart-arrow-down"
                title="Mua lại đơn hàng này"
              />

              <ActionButton
                onClick={() =>
                  router.push({
                    pathname: "/user/order-list/detail",
                    query: {
                      id: record?.Id,
                    },
                  })
                }
                icon="far fa-info-square"
                title="Xem chi tiết đơn"
              />
              {record?.Status === ECreatedOrderStatusData.Finished && (
                <ActionButton
                  onClick={() =>
                    router.push({
                      pathname: "/user/report/detail",
                      query: {
                        id: record?.Id,
                      },
                    })
                  }
                  icon="fas fa-balance-scale-right"
                  title="Khiếu nại"
                  btnRed
                />
              )}
              {record.IsCheckNotiPrice && (
                <>
                  {record?.Status === ECreatedOrderStatusData.Undeposited && (
                    <ActionButton
                      onClick={() => {
                        type.current = "deposit";
                        handleModal([record], undefined, "one");
                      }}
                      icon="far fa-dollar-sign"
                      title="Đặt cọc"
                      btnYellow
                    />
                  )}
                  {record?.Status ===
                    ECreatedOrderStatusData.ArrivedToVietNamWarehouse && (
                    <ActionButton
                      onClick={() => {
                        type.current = "payment";
                        handleModal([record], undefined, "one");
                      }}
                      icon="fas fa-credit-card"
                      title="Thanh toán"
                      btnBlue
                    />
                  )}
                </>
              )}
              {record?.Status === 0 && (
                <ActionButton
                  onClick={() =>
                    Modal.confirm({
                      title: "Xác nhận xóa đơn hàng?",
                      onOk: () => handleDeleteProd(record?.Id),
                    })
                  }
                  icon="fas fa-trash"
                  title="Hủy đơn hàng!"
                  btnYellow
                />
              )}
            </Space>
          ) : (
            <Space
              style={{
                pointerEvents: delLoading ? "none" : "all",
                opacity: delLoading ? "0.8" : "1",
              }}
              className="justify-end flex-wrap"
            >
              <ActionButton
                onClick={() =>
                  Modal.confirm({
                    title: "Xác nhận muốn mua lại đơn hàng này?",
                    onOk: () => {
                      const id = toast.loading("Đang thêm ...");
                      orderShopTemp
                        .addSame({ Id: record?.Id })
                        .then((res) => {
                          toast.update(id, {
                            render:
                              "Thêm đơn thành công, vui lòng kiểm tra giỏ hàng!",
                            type: "success",
                            autoClose: 1000,
                            closeOnClick: true,
                            isLoading: false,
                          });
                        })
                        .catch((error) => {
                          toast.update(id, {
                            render: "Thêm đơn thất bại!",
                            type: "error",
                            isLoading: false,
                          });
                        });
                    },
                  })
                }
                icon="fas fa-cart-arrow-down"
                title="Mua lại đơn hàng này"
              />
              <ActionButton
                onClick={() =>
                  router.push({
                    pathname: "/user/order-list/detail",
                    query: {
                      id: record?.Id,
                    },
                  })
                }
                icon="far fa-info-square"
                title="Xem chi tiết đơn"
              />

              {record?.Status === ECreatedOrderStatusData.Finished && (
                <ActionButton
                  onClick={() =>
                    router.push({
                      pathname: "/user/report/detail",
                      query: {
                        id: record?.Id,
                      },
                    })
                  }
                  icon="fas fa-balance-scale-right"
                  title="Khiếu nại"
                  btnRed
                />
              )}
              {record?.Status === ECreatedOrderStatusData.Undeposited && (
                <ActionButton
                  onClick={() => {
                    type.current = "deposit";
                    handleModal([record], undefined, "one");
                  }}
                  icon="far fa-dollar-sign"
                  title="Đặt cọc"
                  btnYellow
                />
              )}
              {record?.Status ===
                ECreatedOrderStatusData.ArrivedToVietNamWarehouse && (
                <ActionButton
                  onClick={() => {
                    type.current = "payment";
                    handleModal([record], undefined, "one");
                  }}
                  icon="fas fa-credit-card"
                  title="Thanh toán"
                  btnBlue
                />
              )}
              {record?.Status === ECreatedOrderStatusData.Undeposited && (
                <ActionButton
                  onClick={() =>
                    Modal.confirm({
                      title: "Xác nhận xóa đơn hàng?",
                      onOk: () => handleDeleteProd(record?.Id),
                    })
                  }
                  icon="fas fa-trash"
                  title="Hủy đơn hàng!"
                  btnYellow
                />
              )}
            </Space>
          )}
        </li>
      </ul>
    ),
  };

  return (
    <DataTable
      {...{
        columns,
        data,
        bordered: true,
        rowSelection,
        loading,
        // pagination,
        // onChange: handlePagination,
        expandable: expandable,
        scroll: { y: 700 },
      }}
    />
  );
};
