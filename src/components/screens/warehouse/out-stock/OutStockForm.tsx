import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { smallPackage, user } from "~/api";
import { FormSelect, IconButton } from "~/components";
import { showToast } from "~/components/toast";
import { OutStockTable } from "./OutStockTable";

export const OutStockForm = () => {
  const [loading, setLoading] = useState(false);
  const [getForUserName, setGetForUserName] = useState(null);

  const { control, handleSubmit, getValues, reset } = useForm<TWarehouseCN>({
    mode: "onBlur",
  });

  const [filter, setFilter] = useState({
    UID: null,
    StatusType: 3,
    OrderType: null,
  });

  useEffect(() => {
    setGetForUserName(null);

    if (getValues("UID")) {
      smallPackage
        .getExportForUsername(filter)
        .then((res) => setGetForUserName(res?.Data))
        .catch((error) => {
          showToast({
            title: (error as any)?.response?.data?.ResultCode === 401 && "Lỗi!",
            message: (error as any)?.response?.data?.ResultMessage,
            type: "error",
          });
        });
    }
  }, [filter.UID, filter.OrderType]);

  const { isFetching, data } = useQuery(["users"], () =>
    user
      .getList({
        PageIndex: 1,
        PageSize: 1000000,
        OrderBy: "Id desc",
      })
      .then((res) => res.Data)
  );

  return (
    <Spin spinning={loading}>
      <div className="grid grid-cols-3 gap-4">
        <div className="md:col-span-2 xl:col-span-1">
          <FormSelect
            control={control}
            name="UID"
            placeholder="Chọn UserName"
            data={data?.Items}
            isLoading={isFetching}
            isClearable
            select={{ label: "UserName", value: "Id" }}
            defaultValue={{ UserName: "Chọn UserName", Id: 0 }}
            // callback={(value) => alert(value)}
          />
        </div>

        <div className="col-span-3 flex">
          <IconButton
            onClick={() =>
              setFilter({
                ...filter,
                UID: getValues("UID"),
                OrderType: 0,
              })
            }
            btnClass="!mr-4"
            icon="fas fa-hand-holding-box"
            btnIconClass="!mr-2"
            title="Lấy tất cả!"
            toolip=""
          />
          <IconButton
            onClick={() =>
              setFilter({
                ...filter,
                UID: getValues("UID"),
                OrderType: 1,
              })
            }
            icon="fas fa-hand-holding-box"
            btnIconClass="!mr-2"
            btnClass="!mr-4"
            title="Lấy đơn mua hộ!"
            toolip=""
          />
          <IconButton
            onClick={() =>
              setFilter({
                ...filter,
                UID: getValues("UID"),
                OrderType: 2,
              })
            }
            icon="fas fa-hand-holding-box"
            btnIconClass="!mr-2"
            title="Lấy đơn ký gửi!"
            toolip=""
          />
        </div>
      </div>
      {getForUserName && (
        <OutStockTable data={getForUserName} UID={getValues("UID")} />
      )}
    </Spin>
  );
};
