import React from "react";
import { toast } from "react-toastify";
import {
  ActionButton,
  DataTable,
  FormInput,
  FormInputNumber,
  FormUpload,
  showToast,
} from "~/components";
import { TControl } from "~/types/field";
import { TColumnsType, TTable } from "~/types/table";

export const CreateOrderTable: React.FC<
  TControl<TUserCreateOrder> & TTable<TUserCreateOrderProduct>
> = ({ control, data, remove }) => {
  const columns: TColumnsType<TUserCreateOrderProduct> = [
    {
      dataIndex: "Id",
      title: "STT",
      align: "center",
      render: (_, __, index) => ++index,
    },
    {
      dataIndex: "ImageProduct",
      title: (
        <>
          Hình ảnh <br /> sản phẩm
        </>
      ),
      align: "center",
      render: (_, __, index) => (
        <FormUpload
          image
          control={control}
          name={`Products.${index}.ImageProduct` as const}
        />
      ),
    },
    {
      dataIndex: "LinkProduct",
      title: "Link sản phẩm",
      align: "center",
      render: (_, __, index) => (
        <FormInput
          control={control}
          name={`Products.${index}.LinkProduct` as const}
          placeholder=""
          hideError
          rules={{ required: "This field is required" }}
        />
      ),
      responsive: ["sm"],
    },
    {
      dataIndex: "NameProduct",
      title: "Tên sản phẩm",
      render: (_, __, index) => (
        <FormInput
          control={control}
          name={`Products.${index}.NameProduct` as const}
          placeholder=""
          hideError
          rules={{ required: "This field is required" }}
        />
      ),
      responsive: ["sm"],
    },
    {
      dataIndex: "PropertyProduct",
      title: (
        <>
          Màu sắc/ <br /> Kích thước
        </>
      ),
      render: (_, __, index) => (
        <FormInput
          control={control}
          name={`Products.${index}.PropertyProduct` as const}
          placeholder=""
          hideError
          rules={{ required: "This field is required" }}
        />
      ),
      responsive: ["xl"],
    },
    {
      dataIndex: "PriceProduct",
      title: (
        <>
          Giá sản phẩm <br /> (¥){" "}
        </>
      ),
      align: "right",
      render: (_, __, index) => (
        <FormInputNumber
          prefix="¥ "
          control={control}
          name={`Products.${index}.PriceProduct` as const}
          placeholder=""
          hideError
          rules={{ required: "This field is required" }}
        />
      ),
    },
    {
      dataIndex: "QuantityProduct",
      title: "Số lượng",
      align: "right",
      render: (_, __, index) => (
        <FormInputNumber
          control={control}
          name={`Products.${index}.QuantityProduct` as const}
          placeholder=""
          hideError
          rules={{ required: "This field is required" }}
        />
      ),
    },
    {
      dataIndex: "NoteProduct",
      title: "Ghi chú",
      render: (_, __, index) => (
        <FormInput
          control={control}
          name={`Products.${index}.NoteProduct` as const}
          placeholder=""
        />
      ),
      responsive: ["xl"],
    },
    {
      dataIndex: "action",
      title: "Thao tác",
      align: "right",
      render: (_, __, index) => (
        <ActionButton
          title="Xoá"
          icon="fas fa-minus-circle"
          onClick={() => {
            if (data.length > 1) {
              remove(index);
            } else {
              toast.warning("Phải có ít nhất 1 đơn hàng");
            }
          }}
          btnRed
        />
      ),
      responsive: ["xl"],
    },
  ];

  const expandable = {
    expandedRowRender: (_, __, index) => (
      <ul className="px-2 text-xs">
        <li className="xl:hidden justify-between flex py-2">
          <span className="font-medium mr-4 w-16">Màu sắc / kích thước:</span>
          <FormInput
            control={control}
            name={`Products.${index}.PropertyProduct` as const}
            placeholder=""
            hideError
            rules={{ required: "This field is required" }}
          />
        </li>
        <li className="xl:hidden justify-between flex py-2">
          <span className="font-medium mr-4 w-16">Ghi chú:</span>
          <FormInput
            control={control}
            name={`Products.${index}.NoteProduct` as const}
            placeholder=""
          />
        </li>
        <li className="xl:hidden justify-between flex py-2">
          <span className="font-medium mr-4 leading-10">THAO TÁC:</span>
          <ActionButton
            title="Xoá"
            icon="fas fa-minus-circle"
            onClick={() => {
              if (data.length > 1) {
                remove(index);
              } else {
                showToast({
                  type: "warning",
                  title: "Thông báo",
                  message: "Phải có ít nhất 1 đơn hàng",
                });
              }
            }}
          />
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
        expandable: expandable,
      }}
    />
  );
};
