import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { user, withdraw } from "~/api";
import { FormInput, FormInputNumber, FormTextarea } from "~/components";
import { IconButton } from "~/components/globals/button/IconButton";
import { useAppSelector } from "~/store";
import { _format } from "~/utils";

export const WithDrawalVNDForm: FC = () => {
  const [loading, setLoading] = useState(false);
  const { handleSubmit, control, reset } = useForm<TWithDraw>({
    mode: "onBlur",
  });
  const queryClient = useQueryClient();
  const { current: newUser } = useAppSelector((state) => state.user);

  const { data, isError, refetch } = useQuery(
    ["articleList", newUser?.UserId],
    () => user.getByID(newUser?.UserId),
    {
      onSuccess: (data) => data,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      enabled: !!newUser,
    }
  );

  const mutationAdd = useMutation(withdraw.create, {
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries("articleList");
      queryClient.invalidateQueries("clientData");
      queryClient.invalidateQueries("withdrawList");
      mutationAdd.reset();
      toast.success("Gửi yêu cầu rút tiền thành công");
      reset({
        Amount: 0,
        BankNumber: null,
        Beneficiary: "",
        BankAddress: "",
        Note: "",
      });
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error);
      setLoading(false);
    },
  });

  const _onPress = (data: TWithDraw) => {
    setLoading(true);
    mutationAdd.mutateAsync({
      ...data,
      Type: 2,
      UID: newUser?.UserId,
      Status: 1,
    });
  };

  return (
    <div
      className="tableBox"
      style={{
        pointerEvents: loading ? "none" : "all",
        opacity: loading ? "0.8" : "1",
      }}
    >
      <div className="">
        <p className="titleTable !p-0">Thông tin yêu cầu rút tiền</p>
        <div className="flex items-end m-2 flex-col ">
          <p className="text-sm text-right w-full">Số dư hiện tại:</p>
          <p className="text-sm font-bold text-blue">
            {_format.getVND(data?.Data?.Wallet)}
          </p>
        </div>
        <div className="p-4">
          <div className="flex items-center">
            <FormInputNumber
              required={true}
              control={control}
              name="Amount"
              label="Số tiền rút"
              placeholder=""
              rules={{
                required: "Vui lòng điền thông tin!",
                validate: {
                  check: (value) => {
                    if (value === 0) {
                      toast.warning("Vui lòng rút trên 0đ");
                      return;
                    }
                    if (data?.Data?.Wallet === undefined) return true;
                    if (value > data?.Data?.Wallet) {
                      return "Số dư không đủ";
                    } else {
                      return true;
                    }
                  },
                },
              }}
            />
          </div>
          <div className="flex items-center mt-4">
            <FormInput
              label="Số tài khoản"
              required={true}
              control={control}
              name="BankNumber"
              placeholder=""
              rules={{
                required: "Vui lòng điền thông tin!",
                pattern: {
                  value: /^[0-9]*$/,
                  message: "Số tài khoản không đúng định dạng",
                },
              }}
            />
          </div>
          <div className="flex items-center mt-4">
            <FormInput
              label="Người hưởng"
              required={true}
              control={control}
              name="Beneficiary"
              placeholder=""
              rules={{ required: "Vui lòng điền thông tin!" }}
            />
          </div>
          <div className="flex items-center mt-4">
            <FormInput
              label="Ngân hàng"
              control={control}
              name="BankAddress"
              placeholder=""
              required={true}
              rules={{ required: "Vui lòng điền thông tin!" }}
            />
          </div>
          <div className="flex items-center mt-4">
            <FormTextarea
              control={control}
              name="Note"
              label="Nội dung"
              placeholder=""
            />
          </div>
        </div>
      </div>
      <div className="mt-4 text-right px-4">
        <IconButton
          icon="fas fa-check-circle"
          title="Gửi yêu cầu"
          onClick={handleSubmit(_onPress)}
          showLoading
          toolip=""
          btnClass="bg-orange text-white"
        />
      </div>
    </div>
  );
};
