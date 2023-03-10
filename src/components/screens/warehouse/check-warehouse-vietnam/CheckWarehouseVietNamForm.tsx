import { Spin, Tooltip } from "antd";
import Modal from "antd/lib/modal/Modal";
import { differenceWith, isEqual } from "lodash";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { smallPackage } from "~/api";
import { FormInput } from "~/components";
import { IconButton } from "~/components/globals/button/IconButton";
import { showToast, toast } from "~/components/toast";
import {
  controllerList,
  EOrderTypeStatusData,
  EPermission,
  ESmallPackageStatusData,
} from "~/configs/appConfigs";
import { usePressKeyboard } from "~/hooks";
import { selectIsAcceptRoles, useAppSelector } from "~/store";
import { CheckWarehouseChinaTable } from "../check-warehouse-china";
import { CheckWarehouseVietNamAssign1 } from "./CheckWarehouseVietNamAssign1";
import { CheckWarehouseVietNamAssign2 } from "./CheckWarehouseVietNamAssign2";

let newKey = new Date().getTime().toString();

type TForm = {
  [key: string]: TWarehouseVN[];
};

export const CheckWarehouseVietNamForm = () => {
  const { handleSubmit, control, reset, resetField } = useForm<TWarehouseVN>({
    mode: "onBlur",
    defaultValues: {
      OrderTransactionCode: "",
    },
  });
  const { confirm }: any = Modal;

  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const item = useRef<TWarehouseVN>();
  const modalType = useRef<"assign1" | "assign2">("assign1");
  const [modalAssign1, setModalAssign1] = useState(false);
  const [modalAssign2, setModalAssign2] = useState(false);

  const {
    control: controlArray,
    watch: watchArray,
    setValue: setValueArray,
    handleSubmit: handleSubmitArray,
    unregister: unregisterArray,
  } = useForm<TForm>({
    mode: "onBlur",
  });

  const mutationAddOrderTransactionCode = useMutation(smallPackage.create, {
    onSuccess: (data) => {
      handleData(data.Data, data.Data[0].UserName + data.Data[0].Phone);
    },
  });

  const handleData = (newData: TWarehouseVN[], key: string) => {
    key = !!key.length ? key : newKey;
    if (!Object.keys(watchArray()).length) {
      setValueArray(key, newData);
    } else {
      if (watchArray().hasOwnProperty(key)) {
        const diffData = differenceWith(
          [...newData.map((item) => item.Id)],
          [...watchArray(key).map((item) => item.Id)],
          isEqual
        );

        if (!diffData.length) {
          if (newData.length > 1) {
            toast.warning("B???n ???? qu??t bao h??ng n??y r???i");
          } else if (newData.length === 1) {
            if (newData[0].OrderType === EOrderTypeStatusData.Transper) {
              toast.warning("B???n ???? qu??t ????n h??ng k?? g???i n??y r???i");
            } else if (newData[0].OrderType === EOrderTypeStatusData.Buy) {
              confirm({
                title: "Th??ng b??o!",
                content: "M?? n??y ???? scan r???i, b???n c?? mu???n t???o th??m ki???n?",
                onOk() {
                  mutationAddOrderTransactionCode.mutateAsync({
                    OrderTransactionCode: newData[0].OrderTransactionCode,
                    IsWarehouseVN: true,
                  });
                },
              });
            }
          }
        } else {
          setValueArray(key, [
            ...newData.filter((item) => !!diffData.find((x) => item.Id === x)),
            ...watchArray(key),
          ]);
        }
      } else {
        setValueArray(key, newData);
      }
    }
  };

  const _onCreate = async (newData: TWarehouseVN) => {
    try {
      setLoading(true);
      const res = await queryClient.fetchQuery(
        ["barCodeVN", newData.OrderTransactionCode],
        () =>
          smallPackage.getByTransactionCode({
            TransactionCode: newData.OrderTransactionCode.trim(),
          })
      );
      // set data scope
      // ===== begin =====

      if (res?.Data[0].Status === 1) {
        showToast({
          title: "Kh??ng th??? qu??t m?? n??y!",
          message: "Ki???n n??y ch??a v??? kho TQ!",
          type: "warning",
        });
        resetField("OrderTransactionCode");
        return;
      }

      if (res.Data[0].Status === 4) {
        showToast({
          title: "Kh??ng th??? qu??t m?? n??y!",
          message: "????n n??y ???? h???y!",
          type: "error",
        });
        resetField("OrderTransactionCode");
        return;
      }

      if (res.Data[0].Status === 5) {
        showToast({
          title: "Kh??ng th??? qu??t m?? n??y!",
          message: "????n n??y ???? giao kh??ch!",
          type: "error",
        });
        resetField("OrderTransactionCode");
        return;
      }

      let key = res.Data[0].UserName + res.Data[0].Phone;
      handleData(
        res.Data.map((item) => ({
          ...item,
          Status:
            item.Status <= ESmallPackageStatusData.ArrivedToVietNamWarehouse
              ? ESmallPackageStatusData.ArrivedToVietNamWarehouse
              : item.Status,
        })),
        key
      );
      // ===== end =====
    } catch (error) {
      toast.error("Kh??ng t??m th???y th??ng tin ki???n n??y");
    } finally {
      setLoading(false);
    }
    resetField("OrderTransactionCode");
  };

  const mutationUpdate = useMutation(smallPackage.update, {
    onSuccess: () =>
      !modalAssign1 &&
      !modalAssign2 &&
      toast.success("C???p nh???t ????n ki???n th??nh c??ng"),
    onError: toast.error,
  });

  const mutationUpdateLost = useMutation(smallPackage.updateIsLost, {
    onSuccess: () => toast.success("C???p nh???t ki???n th???t l???c th??nh c??ng"),
    onError: toast.error,
  });

  const _onPress = async (
    data: (TWarehouseVN & Partial<TAddtionalFieldWarehouse>)[]
  ) => {
    try {
      if (Object.keys(data).length) {
        try {
          data.forEach((d) => {
            d.VolumePayment = (d.Height * d.Width * d.Length) / 1000000;
          });
          await mutationUpdate.mutateAsync(data);
          setModalAssign1(false);
          setModalAssign2(false);
        } catch (error) {}
      } else {
        toast.warning("Hi???n t???i ch??a c?? m?? ki???n, vui l??ng qu??t m?? ki???n tr?????c");
      }
    } catch (error) {}
  };

  const _onHide = (key: string, item?: TWarehouseVN | TWarehouseVN[]) => {
    if (Array.isArray(item)) {
      unregisterArray(key);
    } else {
      let currentListOfKey = watchArray(key);
      currentListOfKey = currentListOfKey.filter((x) => x.Id !== item.Id);
      if (!currentListOfKey.length) {
        unregisterArray(key);
      } else {
        setValueArray(key, currentListOfKey);
      }
    }
  };

  const _onIsLost = (item?: TWarehouseVN[]) => {
    confirm({
      title: "Th??ng b??o!",
      content: "B???n mu???n b??o th???t l???c ki???n n??y?",
      onOk() {
        mutationUpdateLost.mutateAsync(item[0].Id);
      },
    });
  };

  const handleAssign = (
    data?: TWarehouseVN,
    type: "assign1" | "assign2" = "assign1"
  ) => {
    if (data) {
      item.current = data;
    } else {
      item.current = undefined;
    }
    if (type === "assign1") {
      modalType.current = "assign1";
      setModalAssign1(true);
    } else {
      modalType.current = "assign2";
      setModalAssign2(true);
    }
    // _onPress([data]);
    // item.current =
  };

  const canUpdateTatCaCacKien = useAppSelector(
    selectIsAcceptRoles({
      controller: controllerList.SmallPackage,
      permissionsRequired: [EPermission.Update],
    })
  );

  usePressKeyboard(
    [
      {
        keyList: ["Control", "q"],
        cb: handleSubmitArray((data) =>
          _onPress(
            Object.values(data).reduce((prev, cur) => [...prev, ...cur], [])
          )
        ),
      },
    ],
    { enabled: canUpdateTatCaCacKien }
  );

  return (
    <Spin
      spinning={
        loading ||
        mutationAddOrderTransactionCode.isLoading ||
        mutationUpdate.isLoading
      }
    >
      <div className="flex items-end">
        <FormInput
          control={control}
          name="OrderTransactionCode"
          placeholder="Nh???p m?? v???n ????n ho???c m?? bao h??ng"
          inputContainerClassName="max-w-[424px] mr-4"
          inputClassName="barcode"
          label="M?? v???n ????n/M?? bao h??ng"
          prefix={
            <Tooltip placement="topLeft" title={"Open barcode!"}>
              <div className="min-w-[50px] px-2 text-center">
                <i className="fas fa-barcode text-2xl"></i>
              </div>
            </Tooltip>
          }
          rules={{
            required: "This field is required",
          }}
          onEnter={handleSubmit((data) => _onCreate(data))}
        />
        <IconButton
          onClick={handleSubmit((data) => _onCreate(data))}
          btnClass="order-last"
          icon="fas fa-barcode-read"
          title="Qu??t m?? (Enter)"
          toolip=""
        />
      </div>
      <IconButton
        onClick={handleSubmitArray((data) =>
          _onPress(
            Object.values(data).reduce((prev, cur) => [...prev, ...cur], [])
          )
        )}
        btnClass="mt-4"
        icon="fas fa-pencil"
        title="C???p nh???t t???t c??? ki???n (Ctrl + Q)"
        toolip=""
      />
      {!!Object.keys(watchArray()).length &&
        Object.keys(watchArray()).map((key) => (
          <CheckWarehouseChinaTable
            key={key}
            type="vietnam"
            data={watchArray(key)}
            name={key}
            handleSubmit={handleSubmitArray}
            handleAssign={handleAssign}
            onPress={_onPress}
            onHide={_onHide}
            control={controlArray}
            onIsLost={_onIsLost}
            setValue={setValueArray}
          />
        ))}

      {/* modal c???a g??n ????n cho kh??ch mua h??? */}
      <CheckWarehouseVietNamAssign1
        item={item.current}
        visible={modalAssign1 && modalType.current === "assign1"}
        onCancel={() => setModalAssign1(false)}
        onPress={_onPress}
      />

      {/* modal c???a g??n ????n cho kh??ch k?? g???i */}
      <CheckWarehouseVietNamAssign2
        item={item.current}
        visible={modalAssign2 && modalType.current === "assign2"}
        onCancel={() => setModalAssign2(false)}
        onPress={_onPress}
      />
    </Spin>
  );
};
