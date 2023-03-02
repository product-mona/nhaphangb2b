import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient, useMutation } from "react-query";
import { toast } from "react-toastify";
import { user } from "~/api";
import {
  Button,
  FormAsyncSelect,
  FormCard,
  FormDate,
  FormInput,
  FormRadio,
  FormSelect,
  Modal,
  showToast,
} from "~/components";
import {
  activeData,
  EActiveData,
  EGenderData,
  genderData,
} from "~/configs/appConfigs";
import { TForm } from "~/types/table";
import { checkUnique, createComplain, EUnique } from "../../auth/method";

type TProps = TForm<TClient> & {
  userLevelCatalogue: TUserLevelCatalogue[];
  userGroupCatalogue: TUserGroupCatalogue[];
  userSaleCatalogue: TUserCatalogue[];
  userOrderCatalogue: TUserCatalogue[];
  refetch: () => void;
  RoleID: number;
};

export const ClientListForm: FC<TProps> = ({
  onCancel,
  visible,
  userLevelCatalogue,
  userGroupCatalogue,
  userOrderCatalogue,
  userSaleCatalogue,
  refetch,
  RoleID,
}) => {
  const { handleSubmit, setValue, watch, reset, control } = useForm<
    TClient & { UserGroupId: number }
  >({
    mode: "onBlur",
    defaultValues: {
      Gender: 0,
    },
  });
  const password = watch("Password");

  React.useEffect(() => {
    if (visible) {
      reset({
        Gender: EGenderData.FEMALE,
        LevelId: userLevelCatalogue?.[0]?.Id,
        UserGroup: userGroupCatalogue?.[1],
        UserGroupId: userGroupCatalogue?.[1].Id,
        Status: EActiveData.Actived,
        IsAdmin: false,
        DatHangId: 0,
        SaleId: 0,
        Deposit: 0,
        FeeTQVNPerWeight: 0,
        FeeBuyPro: 0,
        Currency: 0,
        IsLocked: false,
      });
    }
  }, [visible]);

  const mutationAdd = useMutation((data: TClient) => user.create(data), {
    onSuccess: () => {
      refetch();
      mutationAdd.reset();
      toast.success("Thêm khách hàng thành công");
      onCancel();
    },
    onError: (error) =>
      showToast({
        title: (error as any)?.response?.data?.ResultCode,
        message: (error as any)?.response?.data?.ResultMessage,
        type: "error",
      }),
  });

  const _onPress = (data: TEmployee) => {
    mutationAdd.mutate(data);
  };

  return (
    <Modal
      visible={visible}
      width={900}
      style={{ top: 50 }}
      onCancel={onCancel}
    >
      <FormCard>
        <FormCard.Header onCancel={onCancel}>
          <div className="w-full">
            <p>Thêm khách hàng</p>
          </div>
        </FormCard.Header>
        <FormCard.Body>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <FormInput
                control={control}
                name="FullName"
                label="Họ và tên"
                placeholder=""
                rules={{ required: "Không bỏ trống tên đăng nhập" }}
              />
            </div>
            <div className="col-span-1">
              <FormInput
                control={control}
                name="Phone"
                label="Số điện thoại"
                placeholder=""
                rules={{
                  required: "Vui lòng điền số điện thoại..",
                  minLength: {
                    value: 10,
                    message: "Số điện thoại tối thiểu 10 số!",
                  },
                  pattern: {
                    value:
                      /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
                    message: "Sđt không đúng định dạng",
                  },
                  validate: {
                    check: (value) => {
                      return checkUnique(value.trim(), EUnique.phone);
                    },
                  },
                }}
              />
            </div>
            <div className="col-span-1">
              <FormDate
                control={control}
                name="Birthday"
                label="Ngày sinh"
                placeholder=""
                rules={{ required: "Không bỏ trống ngày sinh" }}
              />
            </div>
            <div className="col-span-1">
              <FormRadio
                control={control}
                name="Gender"
                data={genderData}
                label="Giới tính"
              />
            </div>
            <div className="col-span-1">
              <FormInput
                control={control}
                name="UserName"
                label="Tên đăng nhập"
                placeholder=""
                rules={{
                  required: "Vui lòng điền thông tin đăng nhập",
                  minLength: {
                    value: 6,
                    message: "username phải ít nhất 6 kí tự",
                  },
                  maxLength: {
                    value: 30,
                    message: "username phải ít hơn 30 kí tự",
                  },
                  validate: {
                    check: (value) => {
                      return checkUnique(value.trim(), EUnique.username);
                    },
                  },
                }}
              />
            </div>
            <div className="col-span-1">
              <FormInput
                control={control}
                name="Email"
                label="Email"
                placeholder=""
                rules={{
                  required: "Vui lòng điền email..",
                  pattern: {
                    value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    message: "email không đúng định dạng",
                  },
                  validate: {
                    check: (value) => {
                      return checkUnique(value.trim(), EUnique.email);
                    },
                  },
                }}
              />
            </div>
            <div className="col-span-1">
              <FormInput
                control={control}
                name="Password"
                label="Mật khẩu"
                placeholder=""
                type="password"
                rules={{
                  minLength: {
                    value: 8,
                    message: "Mật khẩu ít nhất 8 kí tự",
                  },
                  required: "Vui lòng điền mật khẩu",
                }}
              />
            </div>
            <div className="col-span-1">
              <FormInput
                control={control}
                name="ConfirmPassWord"
                label="Nhập lại mật khẩu"
                type="password"
                placeholder=""
                rules={{
                  required: "Vui lòng xác nhận mật khẩu..",
                  validate: {
                    checkEqualPassword: (value) => {
                      return password === value.trim() || createComplain();
                    },
                  },
                }}
              />
            </div>
            <div className="col-span-1">
              <FormAsyncSelect
                control={control}
                name="SaleId"
                label="Nhân viên kinh doanh"
                data={{ options: userSaleCatalogue }}
                select={{ label: "FullName", value: "Id" }}
                placeholder=""
                required={false}
              />
            </div>
            <div className="col-span-1">
              <FormAsyncSelect
                control={control}
                name="DatHangId"
                data={{ options: userOrderCatalogue }}
                select={{ label: "FullName", value: "Id" }}
                label="Nhân viên đặt hàng"
                placeholder=""
                required={false}
              />
            </div>
            <div className="col-span-1">
              <FormAsyncSelect
                control={control}
                name="UserGroupId"
                data={{
                  options: userGroupCatalogue?.filter((x) => x.Id === 2),
                }}
                defaultValue={userGroupCatalogue?.[1]}
                select={{ label: "Description", value: "Id" }}
                label="Quyền hạn"
                placeholder=""
                rules={{ required: "Cấp quyền cho tài khoản mới!" }}
                // disabled={RoleID === 1 || RoleID === 3 ? false : true}
                disabled
              />
            </div>
            <div className="col-span-1">
              <FormAsyncSelect
                control={control}
                name="LevelId"
                data={{
                  options: userLevelCatalogue,
                }}
                defaultValue={userLevelCatalogue?.[0]}
                select={{ label: "Name", value: "Id" }}
                label="Level"
                placeholder=""
                menuPlacement="top"
                rules={{ required: "Chọn cấp cho tài khoản" }}
              />
            </div>
            <div className="col-span-2">
              <FormSelect
                control={control}
                name="Status"
                data={activeData.slice(1)}
                label="Trạng thái tài khoản"
                placeholder=""
                menuPlacement="top"
                defaultValue={activeData[1]}
                required={false}
                callback={async () =>
                  setValue(
                    "IsLocked",
                    watch("Status") === EActiveData.Blocked ? true : false
                  )
                }
              />
            </div>
          </div>
        </FormCard.Body>
        <FormCard.Footer>
          <Button
            title="Thêm mới"
            btnClass="!bg-active"
            onClick={handleSubmit(_onPress)}
          />
          <Button title="Hủy" btnClass="!bg-pending" onClick={onCancel} />
        </FormCard.Footer>
      </FormCard>
    </Modal>
  );
};
