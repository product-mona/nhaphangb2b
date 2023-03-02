import { FormInput } from "~/components";
import { TControl } from "~/types/field";

type TProps = TControl<TUserPayment> & {
  // getValuesAddress: any;
  // addressWatch: any;
  // addressControl: any;
};

export const ReceiveInfoForm: React.FC<TProps> = ({
  control,
  // addressControl,
  // addressWatch,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 pb-4">
      <h2 className="col-span-1 text-[#141046] font-semibold !mb-0">
        Người nhận hàng
      </h2>
      <FormInput
        name="FullName"
        placeholder="Nhập họ và tên"
        control={control}
        label="Họ và tên"
        inputContainerClassName=""
        rules={{ required: "Vui lòng điền thông tin!" }}
      />
      <FormInput
        name="Phone"
        placeholder="Nhập số điện thoại"
        control={control}
        label="Số điện thoại"
        inputContainerClassName=""
        rules={{ required: "Vui lòng điền thông tin!" }}
      />
      <FormInput
        name="Email"
        placeholder="Nhập email"
        control={control}
        label="Email"
        rules={{ required: "Vui lòng điền thông tin!" }}
      />
      <FormInput
        control={control}
        name="Address"
        placeholder=""
        label="Địa chỉ"
        rules={{ required: "Vui lòng điền thông tin!" }}
      />
    </div>
  );
};
