import { Switch } from "antd";
import React, { useState } from "react";
import { ActionButton, FormDate, FormInput, FormSelect } from "~/components";
import { IconButton } from "~/components/globals/button/IconButton";
import { dataGender } from "~/configs";
import { useCatalogue } from "~/hooks/useCatalogue";
import { _format } from "~/utils";
import { checkUnique, createComplain, EUnique } from "../../auth/method";

export const InfoUserForm: React.FC<any> = ({
  data,
  control,
  onPress,
  handleSubmit,
  loading,
  getValues,
  reset,
  oriEmail,
  oriPhone,
}) => {
  const { warehouseVN, shippingTypeToWarehouse, warehouseTQ } = useCatalogue({
    warehouseVNEnabled: true,
    shippingTypeToWarehouseEnabled: true,
    warehouseTQEnabled: true,
  });

  const [changePass, setChangePass] = useState(false);
  const [showPass, setShowPass] = useState(false);

  return (
    <div
      className=""
      style={{
        opacity: loading ? "0.7" : "1",
        pointerEvents: loading ? "none" : "all",
      }}
    >
      <div className="flex justify-between md:mt-4">
        <div className="m-2 font-bold">
          <p>THÔNG TIN TÀI KHOẢN</p>
        </div>
        <div className="">
          <IconButton
            onClick={handleSubmit(onPress)}
            btnClass={"mr-4"}
            icon={loading ? "fas fa-sync fa-spin" : "far fa-check-circle"}
            btnIconClass="!mr-2"
            title="Cập nhật thông tin"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 xl:p-4 gap-4">
        <div className="col-span-1 xl:mr-4">
          <div className="my-4">
            <FormInput
              control={control}
              name="UserName"
              label="Username"
              placeholder=""
              disabled
              required={false}
            />
          </div>
          <div className="my-4">
            <FormInput
              control={control}
              name="FullName"
              label="Họ & tên của bạn"
              placeholder=""
              required={false}
            />
          </div>
          <div className="my-4">
            <FormInput
              control={control}
              name="Address"
              label="Địa chỉ"
              placeholder=""
              required={false}
            />
          </div>
          <div className="my-4 relative">
            <FormInput
              control={control}
              name="PasswordNew"
              label="Mật khẩu mới"
              type={showPass ? "text" : "password"}
              placeholder=""
              required={changePass}
              disabled={!changePass}
              rules={
                changePass
                  ? {
                      minLength: {
                        value: 8,
                        message: "Mật khẩu ít nhất 8 kí tự",
                      },
                      validate: {
                        check: (value) => {
                          const check = _format.checkUserNameVNese(
                            value.trim()
                          );

                          if (value.trim() === "") {
                            return "Vui lòng điền mật khẩu";
                          }

                          if (value.trim().includes(" ")) {
                            return "Mật khẩu không chứa khoảng trắng giữa 2 chữ!";
                          }
                          if (check) {
                            return "Mật khẩu không được chứa Tiếng Việt";
                          }
                        },
                      },
                    }
                  : {}
              }
            />
            <div className="show-pass" onClick={() => setShowPass(!showPass)}>
              <i className={!showPass ? "fas fa-eye" : "fas fa-eye-slash"}></i>
            </div>
          </div>
          <div className="my-4">
            <FormInput
              control={control}
              name="PasswordAgain"
              label="Nhập lại mật khẩu mới"
              placeholder=""
              type={showPass ? "text" : "password"}
              required={changePass}
              disabled={!changePass}
              rules={
                changePass
                  ? {
                      required: "Vui lòng xác nhận mật khẩu..",
                      validate: {
                        checkEqualPassword: (value) => {
                          const check = _format.checkUserNameVNese(value);

                          if (value.trim() === "") {
                            return "Vui lòng điền mật khẩu";
                          }

                          if (value.trim().includes(" ")) {
                            return "Mật khẩu không chứa khoảng trắng giữa 2 chữ!";
                          }
                          if (check) {
                            return "Mật khẩu không được chứa Tiếng Việt";
                          }
                          return (
                            getValues("PasswordNew") === value.trim() ||
                            createComplain()
                          );
                        },
                      },
                    }
                  : {}
              }
            />
          </div>
          <div className="flex items-center justify-end">
            <label className="mr-3">Đổi mật khẩu?</label>
            <Switch
              onChange={() => {
                setChangePass(!changePass);
                reset();
              }}
            />
          </div>
        </div>
        <div className="col-span-1 xl:mr-4">
          <div className="my-4 grid grid-cols-2">
            <div className="mr-2 col-span-1">
              <FormSelect
                control={control}
                label="Giới Tính"
                placeholder=""
                name="Gender"
                data={dataGender}
                select={{ label: "Name", value: "Id" }}
                defaultValue={dataGender?.[data?.Gender]}
                required={false}
              />
            </div>
            <div className="ml-2 col-span-1">
              <FormDate
                control={control}
                label="Ngày sinh"
                placeholder=""
                name="Birthday"
                required={false}
              />
            </div>
          </div>
          <div className="my-4">
            <FormInput
              control={control}
              name="Email"
              label="Địa chỉ Email"
              placeholder=""
              rules={{
                required: "Vui lòng điền email..",
                pattern: {
                  value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                  message: "email không đúng định dạng",
                },
                validate: {
                  check: (value) => {
                    if (value !== oriEmail.current) {
                      return checkUnique(value, EUnique.email);
                    } else return;
                  },
                },
              }}
            />
          </div>
          <div className="my-4">
            <FormInput
              control={control}
              name="Phone"
              label="Số điện thoại"
              placeholder=""
              rules={{
                required: "Vui lòng điền số điện thoại..",
                pattern: {
                  value:
                    /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
                  message: "Sđt không đúng định dạng",
                },
                validate: {
                  check: (value) => {
                    if (value !== oriPhone.current) {
                      return checkUnique(value.trim(), EUnique.phone);
                    } else return;
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="col-span-1">
          <div className="my-4">
            <FormSelect
              control={control}
              name="WarehouseFrom"
              label="Kho TQ"
              placeholder=""
              required={false}
              isClearable
              data={warehouseTQ}
              select={{ label: "Name", value: "Id" }}
              defaultValue={warehouseTQ?.find(
                (x) => x.Id === data?.WarehouseFrom
              )}
            />
          </div>
          <div className="my-4">
            <FormSelect
              control={control}
              label="Kho VN"
              placeholder=""
              isClearable
              select={{ label: "Name", value: "Id" }}
              name="WarehouseTo"
              required={false}
              data={warehouseVN}
              defaultValue={warehouseVN?.find(
                (x) => x.Id === data?.WarehouseTo
              )}
            />
          </div>
          <div className="my-4">
            <FormSelect
              control={control}
              name="ShippingType"
              label="Hình Thức VC"
              placeholder=""
              isClearable
              required={false}
              data={shippingTypeToWarehouse}
              select={{ label: "Name", value: "Id" }}
              defaultValue={shippingTypeToWarehouse?.find(
                (x) => x.Id === data?.ShippingType
              )}
            />
          </div>
        </div>
        {/* <div className="col-span-1">
          <div className="my-4 relative">
            <FormInput
              control={control}
              name="PasswordNew"
              label="Mật khẩu mới"
              type={showPass ? "text" : "password"}
              placeholder=""
              required={changePass}
              disabled={!changePass}
              rules={{
                minLength: {
                  value: 8,
                  message: "Mật khẩu ít nhất 8 kí tự",
                },
                validate: {
                  check: (value) => {
                    const check = _format.checkUserNameVNese(value.trim());

                    if (value.trim() === "") {
                      return "Vui lòng điền mật khẩu";
                    }

                    if (value.trim().includes(" ")) {
                      return "Mật khẩu không chứa khoảng trắng giữa 2 chữ!";
                    }
                    if (check) {
                      return "Mật khẩu không được chứa Tiếng Việt";
                    }
                  },
                },
              }}
            />
            <div className="show-pass" onClick={() => setShowPass(!showPass)}>
              <i className={!showPass ? "fas fa-eye" : "fas fa-eye-slash"}></i>
            </div>
          </div>
          <div className="my-4">
            <FormInput
              control={control}
              name="PasswordAgain"
              label="Nhập lại mật khẩu mới"
              placeholder=""
              type={showPass ? "text" : "password"}
              required={changePass}
              disabled={!changePass}
              rules={{
                required: "Vui lòng xác nhận mật khẩu..",
                validate: {
                  checkEqualPassword: (value) => {
                    const check = _format.checkUserNameVNese(value);

                    if (value.trim() === "") {
                      return "Vui lòng điền mật khẩu";
                    }

                    if (value.trim().includes(" ")) {
                      return "Mật khẩu không chứa khoảng trắng giữa 2 chữ!";
                    }
                    if (check) {
                      return "Mật khẩu không được chứa Tiếng Việt";
                    }
                    return (
                      getValues("PasswordNew") === value.trim() ||
                      createComplain()
                    );
                  },
                },
              }}
            />
          </div>
          <div className="flex items-center justify-end">
            <label className="mr-3">Đổi mật khẩu?</label>
            <Switch
              onChange={() => {
                setChangePass(!changePass);
                reset();
              }}
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};
