import { useRouter } from "next/router";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
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
  toast,
} from "~/components";
import {
  activeData,
  EActiveData,
  EGenderData,
  genderData,
} from "~/configs/appConfigs";
import { TForm } from "~/types/table";

type TProps = TForm<TEmployee> & {
  userLevelCatalogue: TUserLevelCatalogue[];
  userGroupCatalogue: TUserGroupCatalogue[];
  userSaleCatalogue: TUserCatalogue[];
  userOrderCatalogue: TUserCatalogue[];
};

export const EmployeeManagementForm: FC<TProps> = ({
  onCancel,
  visible,
  userLevelCatalogue,
  userGroupCatalogue,
  userOrderCatalogue,
  userSaleCatalogue,
}) => {
  const router = useRouter();
  const { handleSubmit, setValue, watch, reset, control } = useForm<
    TEmployee & { UserGroupId: number }
  >({
    mode: "onBlur",
    defaultValues: { Gender: 0 },
  });

  React.useEffect(() => {
    if (visible) {
      reset({
        Gender: EGenderData.FEMALE,
        LevelId: userLevelCatalogue?.[0]?.Id,
        UserGroupId: userGroupCatalogue?.[1]?.Id,
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

  const queryClient = useQueryClient();
  const mutationAdd = useMutation((data: TEmployee) => user.create(data), {
    // refresh item + table data after adding successfully
    onSuccess: () => {
      onCancel();
      queryClient.invalidateQueries("employeeData");
      mutationAdd.reset();
      toast.success("Thêm nhân viên thành công");
    },
    onError: toast.error,
  });

  const _onPress = (data: TEmployee) => mutationAdd.mutate(data);

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
            <p>Thêm nhân viên</p>
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
                rules={{ required: "This field is required" }}
              />
            </div>
            <div className="col-span-1">
              <FormInput
                control={control}
                name="Phone"
                label="Số điện thoại"
                placeholder=""
                rules={{ required: "This field is required" }}
              />
            </div>
            <div className="col-span-1">
              <FormDate
                control={control}
                name="Birthday"
                label="Ngày sinh"
                placeholder=""
                rules={{ required: "This field is required" }}
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
                label="Tên đăng nhập / Nick name"
                placeholder=""
                rules={{ required: "This field is required" }}
              />
            </div>
            <div className="col-span-1">
              <FormInput
                control={control}
                name="Email"
                label="Email"
                placeholder=""
                rules={{ required: "This field is required" }}
              />
            </div>
            <div className="col-span-1">
              <FormInput
                control={control}
                name="Password"
                label="Mật khẩu"
                placeholder=""
                type="password"
                rules={{ required: "This field is required" }}
              />
            </div>
            <div className="col-span-1">
              <FormInput
                control={control}
                name="ConfirmPassWord"
                label="Nhập lại mật khẩu"
                type="password"
                placeholder=""
                rules={{ required: "This field is required" }}
              />
            </div>
            <div className="col-span-1">
              <FormAsyncSelect
                control={control}
                name="SaleId"
                label="Nhân viên kinh doanh"
                data={{ options: userSaleCatalogue }}
                select={{ label: "FullName", value: "Id" }}
                defaultValue={{ FullName: "Chọn nhân viên kinh doanh", Id: 0 }}
                placeholder=""
                required={false}
                menuPlacement="bottom"
              />
            </div>
            <div className="col-span-1">
              <FormAsyncSelect
                control={control}
                name="DatHangId"
                data={{ options: userOrderCatalogue }}
                select={{ label: "FullName", value: "Id" }}
                label="Nhân viên đặt hàng"
                defaultValue={{ FullName: "Chọn nhân viên đặt hàng", Id: 0 }}
                placeholder=""
                required={false}
                menuPlacement="bottom"
              />
            </div>
            <div className="col-span-1">
              <FormAsyncSelect
                control={control}
                name="UserGroupId"
                data={{
                  options: router.asPath.includes("admin-management")
                    ? userGroupCatalogue?.filter((x) => x.Id === 1)
                    : userGroupCatalogue?.filter((x) => x.Id !== 1),
                }}
                select={{ label: "Description", value: "Id" }}
                defaultValue={
                  router.asPath.includes("admin-management")
                    ? userGroupCatalogue?.filter((x) => x.Id === 1)?.[0]
                    : userGroupCatalogue?.filter((x) => x.Id !== 1)?.[0]
                }
                label="Quyền hạn"
                placeholder=""
                required={false}
                menuPlacement="bottom"
                disabled={router.asPath.includes("admin-management")}
              />
            </div>
            <div className="col-span-1">
              <FormAsyncSelect
                control={control}
                name="LevelId"
                data={{ options: userLevelCatalogue }}
                defaultValue={userLevelCatalogue?.[0]}
                select={{ label: "Name", value: "Id" }}
                label="Level"
                placeholder=""
                menuPlacement="bottom"
                required={false}
              />
            </div>
            <div className="col-span-2">
              <FormSelect
                control={control}
                name="Status"
                data={activeData.slice(1)}
                label="Trạng thái tài khoản"
                placeholder=""
                menuPlacement="bottom"
                defaultValue={activeData[1]}
                rules={{ required: "Vui lòng chọn thông tin!" }}
                required={false}
                callback={() =>
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
