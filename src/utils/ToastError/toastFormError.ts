import { toast } from "~/components/toast";

import { checkIsArray } from "../CheckIsArray";

export const toastFormError = (err: any) => {
  const errorList: any = Object.values(err);

  try {
    if (checkIsArray(errorList)) {
      for (let i = 0; i < errorList.length; i++) {
        if (!!errorList[i]) {
          const arrError: any = Object.values(errorList[i])[0];
          // console.log(arrError)
          toast.error(arrError);
          break;
        }
      }

      return;
    } else {
      toast.error(errorList?.message);
    }
  } catch (error) {
    toast.error("Lỗi không nhận định");
  }
};

export const toastApiErr = (err: any) => {
  return toast.error(err.response.data.ResultMessage);
};
