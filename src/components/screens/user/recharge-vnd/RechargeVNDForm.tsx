import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { adminSendUserWallet } from "~/api";
import {
  BankCard,
  FormInput,
  FormInputNumber,
  FormTextarea,
} from "~/components";
import { IconButton } from "~/components/globals/button/IconButton";

type TProps = {
  bankCatalogue: TBankCatalogue[];
  newUser: any;
};

export const RechargeVNDForm: React.FC<TProps> = ({
  bankCatalogue,
  newUser,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState(bankCatalogue[0]);

  const { control, handleSubmit, reset, resetField } =
    useForm<TUserHistoryRechargeVND>({
      mode: "onBlur",
      defaultValues: {
        TradeContent: `NAP ${newUser?.UserName} <sodienthoai>`,
        Amount: 1,
      },
    });

  const queryClient = useQueryClient();
  const mutationAdd = useMutation(adminSendUserWallet.create, {
    onSuccess: () => {
      queryClient.invalidateQueries("rechargeVNDList");
      toast.success("Gửi yêu cầu xác nhận chuyển khoản thành công");
      reset({
        Amount: 1,
        TradeContent: `NAP ${newUser?.UserName} <sodienthoai>`,
        BankId: bankCatalogue?.[0]?.Id,
      });
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const _onPress = (data: TUserHistoryRechargeVND) => {
    if (data.Amount <= 0) {
      toast.warning("Số tiền yêu cầu nạp không được nhỏ hơn bằng 0 đồng!");
      return;
    }
    if (!selectedBank?.Id) {
      toast.warn("Vui lòng chọn ngân hàng!");
      return;
    }
    setLoading(true);
    mutationAdd.mutateAsync({
      ...data,
      UID: newUser?.UserId,
      BankId: selectedBank?.Id,
    });
  };

  useEffect(() => {}, [selectedBank]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="my-4 col-span-1 bg-white rounded-sm fillterBox">
        <h3 className="text-xl font-bold uppercase text-[#595857] py-2 border-b border-[#f8dfd5]">
          THÔNG TIN NGÂN HÀNG
        </h3>
        <div
          className={`grid grid-cols-2 gap-4 max-h-[500px] pt-4 ${
            bankCatalogue.length > 4 && "overflow-y-auto px-[5px] "
          } `}
        >
          {bankCatalogue.map((item) => {
            return (
              <BankCard
                item={item}
                key={item?.Id}
                setSelectedBank={setSelectedBank}
                selectedBank={selectedBank}
              />
            );
          })}
        </div>
      </div>

      <div
        className="bg-white rounded-sm mt-4 pt-4 col-span-1 fillterBox"
        style={{
          pointerEvents: loading ? "none" : "all",
          opacity: loading ? "0.8" : "1",
        }}
      >
        <div className="grid grid-cols-1 gap-3">
          <h3 className="col-span-2 text-xl font-bold uppercase text-[#595857] py-2 border-b border-[#f8dfd5]">
            XÁC NHẬN CHUYỂN KHOẢN
          </h3>
          <div className="col-span-2">
            <div className="flex mb-4 items-center">
              <div className="w-full">
                <FormInput
                  control={control}
                  name="BankInfo"
                  placeholder={
                    selectedBank
                      ? `${selectedBank?.BankInfo} - ${selectedBank?.Id}`
                      : "Vui lòng chọn ngân hàng!"
                  }
                  required={false}
                  label={"Thông tin ngân hàng đã chọn!"}
                  disabled
                />
              </div>
            </div>
            <div className="flex mb-4 items-center">
              <FormInputNumber
                control={control}
                name="Amount"
                placeholder=""
                suffix=" VNĐ"
                label="Nhập số tiền (VNĐ)"
                rules={{ required: "Nhập số tiền cần nạp!" }}
              />
            </div>
            <FormTextarea
              control={control}
              name="TradeContent"
              placeholder="Nội dung nạp tiền"
              rows={5}
              label="Nội dung"
              hideError={true}
              rules={{ required: "Nhập nội dung nạp tiền!" }}
            />
          </div>
          <div className="text-right col-span-2">
            <IconButton
              showLoading
              onClick={handleSubmit(_onPress)}
              icon="fas fa-check-circle"
              title="Gửi xác nhận"
              toolip=""
              btnClass="!bg-orange !text-white"
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
