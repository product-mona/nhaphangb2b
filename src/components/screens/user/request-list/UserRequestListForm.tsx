import { Tag } from "antd";
import Link from "next/link";
import Router from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { payHelp } from "~/api";
import {
  DataTable,
  FormInput,
  FormInputNumber,
  FormTextarea,
} from "~/components";
import { IconButton } from "~/components/globals/button/IconButton";
import { paymentData } from "~/configs/appConfigs";
import { TColumnsType } from "~/types/table";
import { _format } from "~/utils";

type TProps = {
  data: TRequestPaymentOrder;
};

export const UserRequestListForm: React.FC<TProps> = ({ data }) => {
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { control, handleSubmit, getValues } = useForm<TRequestPaymentOrder>({
    mode: "onBlur",
    defaultValues: data,
  });

  const mutationUpdatePayment = useMutation(payHelp.update, {
    onSuccess: () => {
      toast.success("Cập nhật thành công");
      Router.push("/user/request-list");
    },
  });

  const _onUpdate = (data: TRequestPaymentOrder) => {
    try {
      setUpdateLoading(true);
      mutationUpdatePayment.mutateAsync(data);
    } catch (error) {
      setUpdateLoading(false);
      toast.error(error);
    }
  };

  const _onDeletePayment = (data: TRequestPaymentOrder) => {
    try {
      setDeleteLoading(true);

      mutationUpdatePayment.mutateAsync({
        ...data,
        Status: 3,
      });
    } catch (error) {
      setDeleteLoading(false);
      toast.error(error);
    }
  };

  const columns: TColumnsType<
    TCreateRequestPaymentOrder & { Desc2: string; Desc1: number }
  > = [
    {
      dataIndex: "Id",
      title: "Id",
    },
    {
      dataIndex: "action",
      title: "Tỉ giá (VNĐ)",
      align: "right",
      render: () => _format.getVND(data?.Currency, " "),
    },
    {
      dataIndex: "action",
      title: "Giá tiền (¥)",
      align: "right",
      render: (value, record, index) => _format.getVND(record?.Desc1, " "),
    },
    {
      dataIndex: "action",
      title: "Giá tiền (VNĐ)",
      align: "right",
      render: (value, record, index) =>
        _format.getVND(record?.Desc1 * data?.Currency, " "),
    },
    {
      dataIndex: "action",
      title: "Ghi Chú",
      render: (value, record, index) => {
        return <div>{record?.Desc2}</div>;
      },
    },
    {
      dataIndex: "Created",
      title: "Ngày tạo",
      render: (value) => _format.getVNDate(value),
    },
  ];

  return (
    <div
      style={{
        opacity: updateLoading === true || deleteLoading === true ? "0.8" : "1",
        pointerEvents:
          updateLoading === true || deleteLoading === true ? "none" : "all",
      }}
      className="flex w-full justify-between"
    >
      <div className="tableBox w-[25%] py-2">
        <div className="col-span-1 text-base font-bold py-2 uppercase border-b border-main">
          Thông tin
        </div>
        <div className="col-span-1 my-3 flex items-center justify-between">
          <div className="mb-2 font-bold">Trạng thái</div>
          <Tag color={paymentData[data?.Status]?.color}>{data?.StatusName}</Tag>
        </div>
        <div className="col-span-1 my-3">
          <FormInput
            control={control}
            name="UserName"
            label="UserName"
            placeholder={data?.UserName}
            disabled
            required={false}
          />
        </div>
        <div className="col-span-1 my-3">
          <FormInputNumber
            control={control}
            name="Currency"
            label="Tỉ giá"
            placeholder={`${_format.getVND(data?.Currency)}`}
            required={false}
            disabled
          />
        </div>
        <div className="col-span-1 my-3">
          <FormInputNumber
            control={control}
            name="TotalPrice"
            label="Tổng tiền Tệ (¥)"
            placeholder={`${_format.getVND(data?.TotalPrice)}`}
            prefix="¥ "
            required={false}
            disabled
          />
        </div>
        <div className="col-span-1 my-3">
          <FormInputNumber
            control={control}
            name="TotalPriceVND"
            label="Tổng tiền (VNĐ)"
            placeholder={`${_format.getVND(data?.TotalPriceVND)}`}
            suffix=" VNĐ"
            required={false}
            disabled
          />
        </div>
        <div className="col-span-2 mt-2">
          <FormTextarea
            control={control}
            name="Note"
            label="Ghi chú"
            placeholder=""
            required={false}
          />
        </div>
      </div>
      <div className="tableBox w-[73%] h-fit py-2">
        <div className="text-base font-bold py-2 uppercase border-b border-main mb-4">
          Danh sách chi tiết
        </div>
        <div className="border-b mb-4 pb-4 border-[#c7c7c7]">
          <DataTable
            {...{
              data: data?.PayHelpDetails,
              columns,
            }}
          />
        </div>
        <div className="flex col-span-1 items-start my-2 mt-4">
          <Link href="/user/request-list">
            <a>
              <IconButton
                onClick={undefined}
                title="Trở về"
                icon="fas fa-undo-alt"
                toolip=""
                btnClass="!mx-2"
              />
            </a>
          </Link>
          {data?.Status !== 3 && data?.Status !== 4 && (
            <>
              <IconButton
                onClick={handleSubmit(_onUpdate)}
                title="Cập nhật"
                icon={updateLoading ? "fas fa-sync fa-spin" : "fas fa-edit"}
                toolip="Cập nhật ghi chú!"
              />
              <IconButton
                onClick={handleSubmit(_onDeletePayment)}
                title="Hủy yêu cầu"
                icon={
                  deleteLoading ? "fas fa-sync fa-spin" : "fas fa-trash-alt"
                }
                toolip="Hủy yêu cầu thanh toán này!"
                btnClass="!ml-auto"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
