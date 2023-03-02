import { Tag } from "antd";
import router from "next/router";
import { ActionButton, DataTable } from "~/components";
import { paymentData, paymentStatus } from "~/configs";
import { TColumnsType } from "~/types/table";
import { _format } from "~/utils";

const columns: TColumnsType<TNewPaymentOrders> = [
  {
    title: "ID",
    dataIndex: "Id",
  },
  {
    dataIndex: "Created",
    title: "Ngày đặt",
    render: (_, record) => _format.getVNDate(record.Created),
  },
  {
    title: "Tổng tiền (¥)",
    dataIndex: "TotalPrice",
    align: "right",
    render: (record) => _format.getVND(record, ""),
  },
  {
    title: "Tổng tiền (VNĐ)",
    dataIndex: "TotalPriceVND",
    align: "right",
    render: (record) => _format.getVND(record, ""),
  },
  {
    title: "Tỉ giá (VNĐ)",
    dataIndex: "Currency",
    align: "right",
    render: (record) => _format.getVND(record, ""),
    responsive: ["md"],
  },
  {
    title: "Trạng thái",
    dataIndex: "Status",
    render: (status) => {
      const color = paymentStatus.find((x) => x.id === status);
      return <Tag color={color?.color}>{color?.name}</Tag>;
    },
    responsive: ["lg"],
  },
  {
    title: "Thao tác",
    dataIndex: "action",
    align: "right",
    render: (_, record) => (
      <ActionButton
        onClick={() =>
          router.push({
            pathname: "/user/request-list/detail",
            query: { id: record?.Id },
          })
        }
        icon="fas fa-info-square"
        title="Chi tiết đơn"
      />
    ),
    responsive: ["xl"],
  },
];

// const expandable = {
// 	expandedRowRender: (data) => (
// 		<ul className="px-2 text-xs">
// 			<li className="md:hidden justify-between flex py-2">
// 				<span className="font-medium mr-4">Tỷ giá:</span>
// 				{data?.Currency}
// 			</li>
// 			<li className="lg:hidden justify-between flex py-2">
// 				<span className="font-medium mr-4">Trạng thái:</span>
// 				<Tag color={paymentData[data?.status]?.color}>{paymentData[data?.status]?.name}</Tag>
// 			</li>
// 			<li className="xl:hidden justify-between flex py-2">
// 				<span className="font-medium mr-4">Thao tác:</span>

// 				<ActionButton
// 					onClick={() =>
// 						router.push({
// 							pathname: "/user/request-list/detail",
// 							query: {id: data?.Id},
// 						})
// 					}
// 					icon="fas fa-edit"
// 					title="Chi Tiết"
// 				/>
// 			</li>
// 		</ul>
// 	),
// };

export const UserPayment = ({ data, isLoading, isFetching, pagination }) => {
  return (
    <div className="tableBox">
      <DataTable
        {...{
          columns,
          data: data?.Items,
          loading: isFetching,
          bordered: true,
          title: "Đơn hàng thanh toán hộ",
          // expandable: expandable,
          pagination,
        }}
      />
    </div>
  );
};
