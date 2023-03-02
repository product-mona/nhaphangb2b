import { Tag } from "antd";
import router from "next/router";
import { ActionButton, DataTable } from "~/components";
import { orderStatus } from "~/configs";
import { TColumnsType } from "~/types/table";
import { _format } from "~/utils";

export const UserAnotherOrder = ({
  data,
  isLoading,
  isFetching,
  pagination,
}) => {
  const columns: TColumnsType<TNewOrders> = [
    {
      title: "ID",
      dataIndex: "Id",
      align: "left",
    },
    {
      title: "Ngày đặt",
      dataIndex: "Created",
      align: "left",
      responsive: ["lg"],
      render: (record) => _format.getVNDate(record),
    },
    {
      title: "Tổng tiền",
      dataIndex: "TotalOrderAmount",
      align: "right",
      render: (record) => _format.getVND(record, ""),
    },
    {
      title: "Số tiền phải cọc",
      dataIndex: "AmountDeposit",
      align: "right",
      responsive: ["lg"],
      render: (record) => _format.getVND(record, ""),
    },
    {
      title: "Số tiền đã cọc",
      dataIndex: "Deposit",
      align: "right",
      render: (record) => _format.getVND(record, ""),
    },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      render: (status, record) => {
        const color = orderStatus.find((x) => x.id === status);
        return <Tag color={color?.color}>{record?.StatusName}</Tag>;
      },
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      align: "right",
      render: (_, record) => (
        <ActionButton
          icon={"fas fa-info-square"}
          title={"Chi tiết đơn"}
          onClick={() => {
            router.push({
              pathname: "/user/order-list/detail",
              query: { id: record?.Id },
            });
          }}
        />
      ),
      responsive: ["xl"],
    },
  ];

  // const expandable = {
  // 	expandedRowRender: (record) => (
  // 		<ul className="px-2 text-xs">
  // 			<li className="md:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Số tiền phải cọc:</span>
  // 				{_format.getVNDate(record?.AmountDeposit, "")}
  // 			</li>
  // 			<li className="lg:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Số tiền đã cọc:</span>
  // 				{_format.getVNDate(record?.Deposit, "")}
  // 			</li>
  // 			<li className="lg:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Ngày đặt:</span>
  // 				{_format.getVNDate(record?.Created)}
  // 			</li>
  // 			<li className="xl:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Thao tác:</span>
  // 				<ActionButton
  // 					icon={"far fa-info-square"}
  // 					title={"Chi tiết đơn"}
  // 					onClick={() => {
  // 						router.push({
  // 							pathname: "/user/order-list/detail",
  // 							query: {id: record?.Id},
  // 						});
  // 					}}
  // 				/>
  // 			</li>
  // 		</ul>
  // 	),
  // };

  return (
    <div className="tableBox">
      <DataTable
        {...{
          columns,
          data: data?.Items,
          bordered: true,
          title: "Đơn hàng mua hàng hộ khác",
          // expandable: expandable,
          pagination,
        }}
      />
    </div>
  );
};
