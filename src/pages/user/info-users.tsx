import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { user, userAvatar } from "~/api";
import {
  InfoUserContact,
  InfoUserForm,
  InfoUserUpdateAvatar,
  showToast,
  toast,
  UserLayout,
} from "~/components";
import { SEOHomeConfigs } from "~/configs/SEOConfigs";
import { useAppSelector } from "~/store";
import { TNextPageWithLayout } from "~/types/layout";

const Index: TNextPageWithLayout = () => {
  const ids = useAppSelector((state) => state?.user?.current)?.UserId;
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateAva, setIsUpdateAva] = useState(false);
  const oriEmail = useRef(null);
  const oriPhone = useRef(null);
  const [modal, setModal] = useState(false);

  const { control, reset, handleSubmit, getValues, setValue } = useForm<
    TUser & { PasswordAgain: string; PasswordNew: string }
  >({
    mode: "onBlur",
    defaultValues: {
      PasswordNew: "",
      PasswordAgain: "",
    },
  });

  const { data, isError, refetch } = useQuery(
    ["clientData", ids],
    () => user.getByID(ids),
    {
      onSuccess: (data) => {
        reset(data.Data);
        oriEmail.current = data.Data.Email;
        oriPhone.current = data.Data.Phone;
      },
      onError: (error) => {
        showToast({
          title: "Đã xảy ra lỗi!",
          message: (error as any)?.response?.data?.ResultMessage,
          type: "error",
        });
      },
      enabled: !!ids,
      refetchOnWindowFocus: true,
    }
  );

  const mutationUpdate = useMutation(user.update, {
    onSuccess: () => {
      toast.success("Cập nhật khách hàng thành công");
      setIsLoading(false);

      refetch();
    },
    onError: (error) => {
      showToast({
        title: "Đã xảy ra lỗi!",
        message: (error as any)?.response?.data?.ResultMessage,
        type: "error",
      });
    },
  });

  const _onPress = (data) => {
    setIsLoading(true);
    if (data?.PasswordAgain) {
      if (data?.PasswordAgain !== data?.PasswordNew) {
        toast.error("Mật khẩu nhập lại sai rồi nè!");
        setIsLoading(false);
        return;
      } else {
        const newData = {
          ...data,
          IsResetPassword: true,
        };
        mutationUpdate.mutateAsync(newData);
      }
    } else {
      mutationUpdate.mutateAsync(data);
    }
  };

  async function handleUpdateAvatar(url: object) {
    setIsUpdateAva(true);
    const newData = {
      ...url,
      userId: data.Data.Id,
    };

    userAvatar
      .update(newData)
      .then((res) => {
        setModal(false);
        toast.success("Cập nhật avatar thành công!");
        setIsUpdateAva(false);
        refetch();
      })
      .catch((error) => {
        showToast({
          title: "Đã xảy ra lỗi!",
          message: (error as any)?.response?.data?.ResultMessage,
          type: "error",
        });
      });
  }

  return (
    <div className="pt-16">
      <div className="tableBox p-4">
        <InfoUserContact data={data?.Data} onOpenModal={() => setModal(true)} />
        <InfoUserForm
          data={data?.Data}
          control={control}
          onPress={_onPress}
          handleSubmit={handleSubmit}
          loading={isLoading}
          getValues={getValues}
          reset={reset}
          oriEmail={oriEmail}
          oriPhone={oriPhone}
        />
        <InfoUserUpdateAvatar
          visible={modal}
          handleUpdateAvatar={handleUpdateAvatar}
          data={data?.Data}
          onCancel={() => setModal(false)}
          isUpdateAva={isUpdateAva}
        />
      </div>
    </div>
  );
};

Index.displayName = SEOHomeConfigs.infoUser;
Index.Layout = UserLayout;

export default Index;
