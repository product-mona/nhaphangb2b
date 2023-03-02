import { Modal } from "antd";
import Cookie from "js-cookie";
import router from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { authenticate } from "~/api";
import { Button, FormCard, FormInput } from "~/components";
import { showToast } from "~/components/toast";

export const SignInForm = ({ visible, setOpenModal }) => {
  const { handleSubmit, control, reset, resetField } = useForm<TLogin>({
    mode: "onBlur",
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  useEffect(() => {
    reset({
      userName: "",
      password: "",
    });
  }, [visible]);

  const [loading, setLoading] = useState(false);
  const [showP, setShowP] = useState(false);

  const _onPress = (data: TLogin) => {
    setLoading(true);
    authenticate
      .login(data)
      .then((res) => {
        const token = res.Data.token;
        Cookie.set("tokenNHTQ-nhaphangb2b", token);
        setOpenModal("");
        router.push("/");
      })
      .catch((error) => {
        resetField("password");
        showToast({
          title: "Lỗi đăng nhập!",
          message: "Tên đăng nhập hoặc mật khẩu không chính xác",
          type: "error",
        });
        setLoading(false);
      });
  };

  return (
    <Modal visible={visible} footer={false} closeIcon={true}>
      <div className="authContainer">
        <FormCard>
          <FormCard.Header onCancel={() => setOpenModal("")}>
            <p className="heading !pb-0">Đăng nhập</p>
          </FormCard.Header>
          <FormCard.Body>
            <form onSubmit={handleSubmit(_onPress)}>
              <div className="gridContainer">
                <div className="col-span-2">
                  <FormInput
                    disabled={loading}
                    control={control}
                    name="userName"
                    homeType="login"
                    label="Tài khoản"
                    placeholder="Nhập tài khoản"
                    rules={{
                      required: "Bạn chưa điền thông tin!",
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <div className="relative">
                    <FormInput
                      disabled={loading}
                      control={control}
                      name="password"
                      label="Mật khẩu"
                      allowClear={false}
                      homeType="login"
                      type={!showP ? "password" : "text"}
                      placeholder="Nhập mật khẩu"
                      rules={{
                        required: "Bạn chưa điền thông tin!",
                      }}
                    />
                    <div className="show-pass" onClick={() => setShowP(!showP)}>
                      <i
                        className={!showP ? "fas fa-eye" : "fas fa-eye-slash"}
                      ></i>
                    </div>
                  </div>
                </div>
                <div
                  className="group col-span-2 !mt-2 text-center uppercase font-bold"
                  style={{ pointerEvents: loading ? "none" : "all" }}
                >
                  <button type="submit" className="w-full">
                    <Button
                      showLoading
                      title="Đăng nhập"
                      btnClass="!bg-[#4A8916] !mx-0 w-full !rounded-none shadow-xl hover:shadow-none"
                      disabled={loading}
                    />
                  </button>
                </div>
                <div
                  className="forgotpasswordLinkTo group col-span-2 !pt-4 border-t border-[#c4c4c4]"
                  style={{ pointerEvents: loading ? "none" : "all" }}
                >
                  <div
                    className="link"
                    onClick={() => setOpenModal("register")}
                  >
                    <a className="!mt-0 !inline-block">Đăng ký</a>
                  </div>
                  <div
                    className="link"
                    onClick={() => setOpenModal("forgetPassword")}
                  >
                    <a className="!mt-0 !inline-block">Quên mật khẩu?</a>
                  </div>
                </div>
              </div>
            </form>
          </FormCard.Body>
        </FormCard>
      </div>
    </Modal>
  );
};
