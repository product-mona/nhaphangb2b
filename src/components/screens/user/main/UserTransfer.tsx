import { Modal, Tag } from "antd";
import router from "next/router";
import { ActionButton, DataTable } from "~/components";
import { transportStatus } from "~/configs";
import { TColumnsType } from "~/types/table";
import { _format } from "~/utils";

const DetailInfo = (record) => {
  const divStyle = `flex justify-between items-center py-2 my-2 border-b border-[#e4e4e4]`;
  const detailBox = `md:h-fit w-[60vw] grid grid-cols-2 gap-7 xl:mt-[30px]`;
  const title = `text-[18px] font-bold`;
  const color = transportStatus.find((x) => x.id === record?.record?.Status);

  return (
    <div className={detailBox}>
      <div className="col-span-1">
        <span className={title}>Thông tin</span>
        <div className={divStyle}>
          Mã vận đơn: <span>{record?.record?.OrderTransactionCode}</span>
        </div>
        <div className={divStyle}>
          UserName: <span>{record?.record?.UserName}</span>
        </div>
        <div className={divStyle}>
          Kho Trung Quốc: <span>{record?.record?.WareHouseFrom}</span>
        </div>
        <div className={divStyle}>
          Kho Việt Nam: <span>{record?.record?.WareHouseTo}</span>
        </div>
        <div className={divStyle}>
          Ngày tạo: <span>{_format.getVNDate(record?.record?.Created)}</span>
        </div>
        <div className={divStyle}>
          Trạng thái:{" "}
          <Tag color={color?.color}>{record?.record?.StatusName}</Tag>
        </div>
        <div className={divStyle}>
          Phương thức vận chuyển:{" "}
          <span>{record?.record?.ShippingTypeName}</span>
        </div>
        <div className={`${divStyle} flex-col items-baseline`}>
          Ghi chú nhân viên:{" "}
          <textarea
            className="w-full border border-[#e4e4e4] px-3 py-2"
            readOnly
            disabled
            value={record?.record?.StaffNote ?? "--"}
          />
        </div>
        <div className={`${divStyle} flex-col items-baseline`}>
          Ghi chú khách hàng (hủy nếu có):{" "}
          <textarea
            className="w-full border border-[#e4e4e4] px-3 py-2"
            readOnly
            disabled
            value={
              record?.record?.CancelReason === ""
                ? record?.record?.Note
                : record?.record?.CancelReason
            }
          />
        </div>
      </div>

      <div className="col-span-1">
        <span className={title}>Phí chi tiết</span>
        <div className={divStyle}>
          Cân nặng: <span>{record?.record?.PayableWeight ?? 0} kg</span>
        </div>
        <div className={divStyle}>
          Phí cân nặng:{" "}
          <span>{_format.getVND(record?.record?.FeeWeightPerKg)}</span>
        </div>
        <div className={divStyle}>
          Số khối: <span>{record?.record?.VolumePayment ?? 0} m3</span>
        </div>
        <div className={divStyle}>
          Phí khối: <span>{_format.getVND(record?.record?.FeePerVolume)}</span>
        </div>
        <div className={divStyle}>
          Phí vận chuyển:{" "}
          <span>{_format.getVND(record?.record?.DeliveryPrice)}</span>
        </div>
        <div className={divStyle}>
          Phí COD Trung Quốc:{" "}
          <span>{_format.getVND(record?.record?.CODFee)}</span>
        </div>
        <div className={divStyle}>
          Phí đóng gỗ:{" "}
          <span>{_format.getVND(record?.record?.IsPackedPrice)}</span>
        </div>
        <div className={divStyle}>
          Phí bảo hiểm:{" "}
          <span>{_format.getVND(record?.record?.InsuranceMoney)}</span>
        </div>
        <div className={divStyle}>
          Phí kiểm hàng:{" "}
          <span>{_format.getVND(record?.record?.IsCheckProductPrice)}</span>
        </div>
        <div className={divStyle}>
          Tổng tiền:{" "}
          <span>{_format.getVND(record?.record?.TotalPriceVND)}</span>
        </div>
      </div>
    </div>
  );
};

export const UserTransfer = ({ data, isLoading, isFetching, pagination }) => {
  const columns: TColumnsType<TNewDeliveryOrders> = [
    {
      title: "ID",
      dataIndex: "Id",
    },
    {
      title: "Ngày đặt",
      dataIndex: "Created",
      render: (date) => <span>{_format.getVNDate(date)}</span>,
      responsive: ["lg"],
    },
    {
      title: "Mã vận đơn",
      dataIndex: "OrderTransactionCode",
    },
    {
      dataIndex: "PayableWeight",
      title: "Cân nặng (kg)",
      align: "right",
    },
    {
      dataIndex: "TotalPriceVND",
      title: "Tổng tiền (VNĐ)",
      align: "right",
      render: (_) => _format.getVND(_, ""),
    },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      render: (status, record) => {
        const color = transportStatus.find((x) => x.id === status);
        return <Tag color={color?.color}>{record?.StatusName}</Tag>;
      },
      responsive: ["md"],
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      align: "right",
      render: (_, record) => (
        <ActionButton
          onClick={() =>
            Modal.info({
              title: (
                <div className="text-[20px] font-bold">
                  Thông tin chi tiết đơn #{record?.Id}
                </div>
              ),
              className: "!w-fit",
              content: <DetailInfo record={record} />,
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
  // 			{/* <li className="md:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Tỷ giá:</span>
  // 				{data?.Currency}
  // 			</li> */}
  // 			<li className="md:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Trạng thái:</span>
  // 				<Tag color={orderStatus2Data.find((x) => x.id === data?.Status).color}>{data?.StatusName}</Tag>
  // 			</li>
  // 			<li className="lg:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Ngày đặt:</span>
  // 				{_format.getShortVNDate(data?.Created)}
  // 			</li>
  // 			<li className="xl:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Thao tác:</span>
  // 				<ActionButton
  // 					onClick={() => router.push({pathname: "/user/deposit-list"})}
  // 					icon="fas fa-list"
  // 					title="Xem danh sách đơn hàng"
  // 				/>
  // 			</li>
  // 		</ul>
  // 	),
  // };
  return (
    <div className="tableBox overflow-hidden">
      <DataTable
        {...{
          columns,
          data: data?.Items,
          loading: isFetching,
          bordered: true,
          title: "Đơn hàng ký gửi",
          // expandable: expandable,
          pagination,
        }}
      />
    </div>
  );
};
