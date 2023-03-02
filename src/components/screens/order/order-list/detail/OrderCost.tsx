import React, { useCallback, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { FormInputNumber } from "~/components";
import { FormCheckbox } from "~/components/globals/formBase";
type TProps = {
  loading: boolean;
  data:
    | TOrder
    | (TOrder[] & {
        FeeBuyProCK: number;
        FeeWeightCK: number;
        HH: number;
        HHCNY;
      });
  RoleID: number;
};

const costTitle = "w-1/4 text-sm font-semibold";
const costBox = "w-3/4 grid grid-cols-2 gap-4";

export const OrderCost: React.FC<TProps> = ({ loading, data, RoleID }) => {
  const { control, watch, setValue, reset, getValues } =
    useFormContext<TOrder>();

  const formValue = useMemo(() => watch(), [watch() as TOrder]);
  const handleSetValue = useCallback(
    (key: keyof TOrder, value: any) => setValue(key, value),
    []
  );

  return (
    <React.Fragment>
      <div className="mb-4 text-base font-bold py-2 uppercase border-b border-main">
        Phí cố định
      </div>
      <div className="flex items-center mb-4">
        <div className={costTitle}>Tỷ giá</div>
        <div className={costBox}>
          <div className="col-span-2">
            <FormInputNumber
              suffix=" VNĐ"
              control={control}
              name="CurrentCNYVN"
              placeholder=""
              allowNegative={false}
              disabled
            />
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className={costTitle}>Tiền hàng trên web</div>
        <div className={costBox}>
          <div className="col-span-1">
            <FormInputNumber
              prefix="¥ "
              control={control}
              name="PriceCNY"
              disabled
              placeholder=""
              allowNegative={false}
            />
          </div>
          <div className="col-span-1">
            <FormInputNumber
              suffix=" VNĐ"
              control={control}
              name="PriceVND"
              disabled
              placeholder=""
              allowNegative={false}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center mt-4">
        <div className={costTitle}>Tổng số tiền mua thật</div>
        <div className={costBox}>
          <div className="col-span-1">
            <FormInputNumber
              prefix="¥ "
              control={control}
              disabled={!(RoleID === 1 || RoleID === 3 || RoleID === 4)}
              name="TotalPriceRealCNY"
              placeholder="Tổng số tiền mua thật (¥)"
              allowNegative={false}
              callback={(val) => {
                if (val !== formValue.TotalPriceRealCNY) {
                  handleSetValue(
                    "TotalPriceReal",
                    Math.ceil(val * formValue.CurrentCNYVN)
                  );
                }
              }}
            />
          </div>
          <div className="col-span-1">
            <FormInputNumber
              suffix=" VNĐ"
              control={control}
              name="TotalPriceReal"
              placeholder=""
              disabled={true}
              allowNegative={false}
              callback={(val) => {
                if (val !== formValue.TotalPriceReal) {
                  handleSetValue(
                    "TotalPriceRealCNY",
                    val / formValue.CurrentCNYVN
                  );
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center mt-4">
        <div className={costTitle}>Phí ship Trung Quốc</div>
        <div className={costBox}>
          <div className="col-span-1">
            <FormInputNumber
              prefix="¥ "
              control={control}
              name="FeeShipCNCNY"
              disabled={!(RoleID === 1 || RoleID === 3 || RoleID === 4)}
              placeholder="Phí ship TQ (¥)"
              allowNegative={false}
              callback={(val) => {
                if (val !== formValue.FeeShipCNCNY) {
                  handleSetValue(
                    "FeeShipCN",
                    Math.ceil(val * formValue.CurrentCNYVN)
                  );
                }
              }}
            />
          </div>
          <div className="col-span-1">
            <FormInputNumber
              suffix=" VNĐ"
              control={control}
              name="FeeShipCN"
              placeholder=""
              disabled={true}
              allowNegative={false}
              callback={(val) => {
                if (val !== formValue.FeeShipCN) {
                  handleSetValue("FeeShipCNCNY", val / formValue.CurrentCNYVN);
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center mt-4">
        <div className={costTitle}>Phí ship Trung Quốc thật</div>
        <div className={costBox}>
          <div className="col-span-1">
            <FormInputNumber
              prefix="¥ "
              control={control}
              name="FeeShipCNRealCNY"
              disabled={!(RoleID === 1 || RoleID === 3 || RoleID === 4)}
              placeholder="Phí ship TQ thật (¥)"
              allowNegative={false}
              callback={(val) => {
                if (val !== formValue.FeeShipCNRealCNY) {
                  handleSetValue(
                    "FeeShipCNReal",
                    Math.ceil(val * formValue.CurrentCNYVN)
                  );
                }
              }}
            />
          </div>
          <div className="col-span-1">
            <FormInputNumber
              suffix=" VNĐ"
              control={control}
              name="FeeShipCNReal"
              placeholder=""
              disabled={true}
              allowNegative={false}
              callback={(val) => {
                if (val !== formValue.FeeShipCNReal) {
                  handleSetValue(
                    "FeeShipCNRealCNY",
                    val / formValue.CurrentCNYVN
                  );
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center mt-4">
        <div className={costTitle}>Tiền hoa hồng</div>
        <div className={costBox}>
          <div className="col-span-1">
            <FormInputNumber
              prefix={`¥ ${data?.HHCNY < 0 ? "-" : ""}`}
              allowNegative={false}
              control={control}
              name="HHCNY"
              placeholder=""
              disabled
            />
          </div>
          <div className="col-span-1">
            <FormInputNumber
              prefix={`${data?.HH < 0 ? "- " : ""}`}
              suffix=" VNĐ"
              control={control}
              allowNegative={false}
              name="HH"
              placeholder=""
              disabled
            />
          </div>
        </div>
      </div>
      <div className="flex items-center mt-4">
        <div className={costTitle}>
          Phí mua hàng (CK: {data?.FeeBuyProCK ?? 0}%)
        </div>
        <div className={costBox}>
          <div className="col-span-1">
            <FormInputNumber
              prefix="¥ "
              control={control}
              name="CKFeeBuyPro"
              placeholder=""
              disabled
              allowNegative={false}
            />
          </div>
          <div className="col-span-1">
            <FormInputNumber
              suffix=" VNĐ"
              control={control}
              name="FeeBuyPro"
              placeholder=""
              disabled
              allowNegative={false}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center mt-4">
        <div className={costTitle}>Cân nặng - thể tích</div>
        <div className={costBox}>
          <div className="col-span-1">
            <FormInputNumber
              suffix=" KG"
              control={control}
              name="TQVNWeight"
              placeholder=""
              disabled
              allowNegative={false}
            />
          </div>
          <div className="col-span-1">
            <FormInputNumber
              suffix=" &#x33A5;"
              control={control}
              name="TQVNVolume"
              placeholder=""
              disabled
              allowNegative={false}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center mt-4">
        <div className={costTitle}>
          Phí vận chuyển TQ-VN (CK: {data?.FeeWeightCK ?? 0}%)
        </div>
        <div className={costBox}>
          <div className="col-span-2">
            <FormInputNumber
              suffix=" VNĐ"
              control={control}
              name="FeeWeight"
              placeholder=""
              disabled
              allowNegative={false}
            />
          </div>
        </div>
      </div>
      {/* <div className="flex items-center mt-4">
				<div className={costTitle}>Phí lưu kho</div>
				<div className={costBox}>
					<div className="col-span-2">
						<FormInputNumber
							suffix=" VNĐ"
							control={control}
							name="FeeInWareHouse"
							placeholder=""
							disabled
							allowNegative={false}
						/>
					</div>
				</div>
			</div> */}
      {/* <div className="my-8 text-base font-bold py-2 uppercase border-b border-main">
				Điều chỉnh phí
			</div>
			<div className="flex items-center mt-4">
				<div className={(costTitle)}>Tỷ giá</div>
				<div className={(costBox)}>
					<div className="col-span-2">
						<FormInputNumber
							suffix=" VNĐ"
							control={control}
							name="CurrentCNYVN"
							placeholder=""
							allowNegative={false}
						/>
					</div>
				</div>
			</div>
			<div className="flex items-center mt-4">
				<div className={(costTitle)}>Đặt cọc (%)</div>
				<div className={(costBox)}>
					<div className="col-span-2">
						<FormInputNumber
							suffix="%"
							control={control}
							name="LessDeposit"
							placeholder=""
							allowNegative={false}
						/>
					</div>
				</div>
			</div>
			<div className="flex items-center mt-4">
				<div className={(costTitle)}>Phí dịch vụ (%)</div>
				<div className={(costBox)}>
					<div className="col-span-2">
						<FormInputNumber
							suffix="%"
							control={control}
							name="FeeBuyProPT"
							placeholder=""
							allowNegative={false}
						/>
					</div>
				</div>
			</div> */}
      <div className="my-4 text-base font-bold py-2 uppercase border-b border-main">
        Phí tùy chọn
      </div>
      <div className="flex items-center mt-4">
        <div className="w-1/4 text-sm font-semibold flex items-center justify-between">
          Kiểm đếm
          <FormCheckbox
            control={control}
            name="IsCheckProduct"
            label=""
            disabled={!(RoleID === 1 || RoleID === 3 || RoleID === 4)}
            checkBoxClassName="large"
          />
        </div>
        <div className={costBox}>
          <div className="col-span-1">
            <FormInputNumber
              prefix="¥ "
              control={control}
              name="IsCheckProductPriceCNY"
              placeholder=""
              allowNegative={false}
              callback={(val) => {
                if (val !== formValue.IsCheckProductPriceCNY) {
                  handleSetValue(
                    "IsCheckProductPrice",
                    Math.ceil(val * formValue.CurrentCNYVN)
                  );
                }
              }}
              disabled
            />
          </div>
          <div className="col-span-1">
            <FormInputNumber
              suffix=" VNĐ"
              control={control}
              name="IsCheckProductPrice"
              placeholder=""
              allowNegative={false}
              callback={(val) => {
                if (val !== formValue.IsCheckProductPrice) {
                  handleSetValue(
                    "IsCheckProductPriceCNY",
                    val / formValue.CurrentCNYVN
                  );
                }
              }}
              disabled
            />
          </div>
        </div>
      </div>
      <div className="flex items-center mt-4">
        <div className="w-1/4 text-sm font-semibold flex items-center justify-between">
          Đóng gỗ
          <FormCheckbox
            control={control}
            name="IsPacked"
            label=""
            checkBoxClassName="large"
            disabled={!(RoleID === 1 || RoleID === 3 || RoleID === 4)}
          />
        </div>
        <div className={costBox}>
          <div className="col-span-1">
            <FormInputNumber
              prefix="¥ "
              control={control}
              name="IsPackedPriceCNY"
              rules={{ required: "Vui lòng nhập!" }}
              placeholder="Nhập phí đóng gỗ (¥)"
              allowNegative={false}
              callback={(val) => {
                handleSetValue("IsPacked", val > 0 ? true : false);
                if (val !== formValue.IsPackedPriceCNY) {
                  handleSetValue(
                    "IsPackedPrice",
                    Math.ceil(val * formValue.CurrentCNYVN)
                  );
                }
              }}
              disabled={!(RoleID === 1 || RoleID === 3 || RoleID === 4)}
            />
          </div>
          <div className="col-span-1">
            <FormInputNumber
              suffix=" VNĐ"
              control={control}
              name="IsPackedPrice"
              placeholder=""
              allowNegative={false}
              callback={(val) => {
                if (val !== formValue.IsPackedPrice) {
                  handleSetValue(
                    "IsPackedPriceCNY",
                    val / formValue.CurrentCNYVN
                  );
                }
              }}
              disabled={!(RoleID === 1 || RoleID === 3 || RoleID === 4)}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center mt-4">
        <div className="w-1/4 text-sm font-semibold flex items-center justify-between">
          Bảo hiểm
          <FormCheckbox
            control={control}
            name="IsInsurance"
            label=""
            checkBoxClassName="large"
            disabled={!(RoleID === 1 || RoleID === 3 || RoleID === 4)}
          />
        </div>
        <div className={costBox}>
          <div className="col-span-2">
            <FormInputNumber
              suffix=" VNĐ"
              control={control}
              name="InsuranceMoney"
              placeholder=""
              allowNegative={false}
              disabled
            />
          </div>
        </div>
      </div>
      <div className="flex items-center mt-4">
        <div className="w-1/4 text-sm font-semibold flex items-center justify-between">
          Giao hàng tại nhà
          <FormCheckbox
            control={control}
            name="IsFastDelivery"
            label=""
            checkBoxClassName="large"
            disabled={!(RoleID === 1 || RoleID === 3 || RoleID === 4)}
          />
        </div>
        <div className={costBox}>
          <div className="col-span-2">
            <FormInputNumber
              suffix=" VNĐ"
              control={control}
              name="IsFastDeliveryPrice"
              placeholder="Nhập phí giao hàng (VNĐ)"
              allowNegative={false}
              disabled={!(RoleID === 1 || RoleID === 3 || RoleID === 4)}
              callback={(val) => {
                handleSetValue("IsFastDelivery", val > 0 ? true : false);
              }}
            />
          </div>
        </div>
      </div>
      <div className="my-4 text-base font-bold py-2 uppercase border-b border-main">
        Thanh toán
      </div>
      <div className="flex items-center mt-4">
        <div className="w-1/4 text-sm font-semibold flex items-center justify-between">
          Số tiền phải cọc
        </div>
        <div className={costBox}>
          <div className="col-span-2">
            <FormInputNumber
              suffix=" VNĐ"
              control={control}
              name="AmountDeposit"
              placeholder=""
              allowNegative={false}
              disabled={!(RoleID === 1 || RoleID === 3 || RoleID === 4)}
              callback={(val) => {
                localStorage.setItem("AmountDeposit", JSON.stringify(val));
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center mt-4">
        <div className="w-1/4 text-sm font-semibold flex items-center justify-between">
          Số tiền đã trả
        </div>
        <div className={costBox}>
          <div className="col-span-2">
            <FormInputNumber
              suffix=" VNĐ"
              control={control}
              name="Deposit"
              placeholder=""
              allowNegative={false}
              disabled={!(RoleID === 1 || RoleID === 3 || RoleID === 4)}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
