import React, { FC } from "react";
import { FormSelect } from "~/components";
import { IconButton } from "~/components/globals/button/IconButton";
import { TControl } from "~/types/field";

type TProps = TControl<TUserCreateDeposit> & {
  user: any;
  warehouseTQCatalogue: TWarehouseTQCatalogue[];
  warehouseVNCatalogue: TWarehouseVNCatalogue[];
  shippingTypeToWarehouseCatalogue: TShippingTypeToWarehouse[];
};

export const CreateDepositSelect: FC<TProps> = ({
  user,
  control,
  warehouseTQCatalogue,
  shippingTypeToWarehouseCatalogue,
  warehouseVNCatalogue,
  append,
}) => {
  return (
    <React.Fragment>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1 flex items-center xl:mb-0 mb-2">
          <p className="mr-5 text-white IconFilter bg-[#2A8BD5]">
            <i className="fas fa-user"></i>
          </p>
          <div className="w-full">
            <div className="mt-2 xl:mt-0 w-full">
              <FormSelect
                data={user}
                label="UserName"
                control={control}
                name="UID"
                placeholder={
                  Array.isArray(user) ? "Chọn khách hàng" : `${user?.UserName}`
                }
                select={{ label: "UserName", value: "Id" }}
                rules={
                  Array.isArray(user)
                    ? { required: "This field is required" }
                    : {}
                }
                disabled={Array.isArray(user) ? false : true}
              />
            </div>
            {/* {!Array.isArray(user) ? (
							<p className="font-bold text-sm">{user?.UserName || "Username"}</p>
						) : (
							<div className="mt-2 xl:mt-0 w-full">
								<FormSelect
									data={user}
									control={control}
									name="UID"
									placeholder="Chọn khách hàng"
									select={{label: "UserName", value: "Id"}}
									rules={{required: "This field is required"}}
								/>
							</div>
						)} */}
          </div>
        </div>
        <div className="col-span-1 flex items-center xl:mb-0 mb-2">
          <p className="mr-5 text-white IconFilter  bg-[#27A689]">
            <i className="fas fa-shipping-fast"></i>
          </p>
          <div className="w-full">
            <div className="mt-2 xl:mt-0 w-full">
              <FormSelect
                label="Phương thức vận chuyển"
                data={shippingTypeToWarehouseCatalogue}
                control={control}
                name="ShippingTypeId"
                placeholder="Chọn phương thức vận chuyển"
                rules={{ required: "This field is required" }}
                select={{ label: "Name", value: "Id" }}
              />
            </div>
          </div>
        </div>
        <div className="col-span-1 flex items-center xl:mb-0 mb-2">
          <p className="mr-5 text-white IconFilter  bg-[#F1A934]">
            <i className="fas fa-warehouse"></i>
          </p>
          <div className="w-full">
            <div className="mt-2 xl:mt-0 w-full">
              <FormSelect
                label="Kho Trung Quốc"
                data={warehouseTQCatalogue}
                control={control}
                name="WareHouseFromId"
                placeholder="Chọn kho Trung Quốc"
                rules={{ required: "This field is required" }}
                select={{ label: "Name", value: "Id" }}
              />
            </div>
          </div>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="mr-5 text-white IconFilter  bg-[#E54C36]">
            <i className="fas fa-warehouse"></i>
          </p>
          <div className="w-full">
            <div className="mt-2 xl:mt-0 w-full">
              <FormSelect
                label="Kho đích"
                data={warehouseVNCatalogue}
                control={control}
                name="WareHouseId"
                placeholder="Chọn kho đích"
                rules={{ required: "This field is required" }}
                select={{ label: "Name", value: "Id" }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="xl:flex items-center justify-end my-4 px-4">
        <IconButton
          onClick={() =>
            append({
              Amount: null,
              OrderTransactionCode: null,
              Category: null,
              IsCheckProduct: false,
              IsPacked: false,
              IsInsurance: false,
              Kg: 0,
              UserNote: null,
              FeeShip: null,
            })
          }
          title="Thêm kiện"
          icon="far fa-plus"
          btnClass=""
          showLoading
          toolip=""
          green
        />
      </div>
    </React.Fragment>
  );
};
