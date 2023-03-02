import { TablePaginationConfig } from "antd";
import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { adminSendUserWallet } from "~/api";
import {
  HistoryRechargeVNDTable,
  ModalDelete,
  RechargeVNDForm,
  showToast,
  toast,
  UserLayout,
} from "~/components";
import { RechargeContent } from "~/components/screens/user/recharge-vnd";
import { defaultPagination } from "~/configs/appConfigs";
import { SEOHomeConfigs } from "~/configs/SEOConfigs";
import { useCatalogue } from "~/hooks/useCatalogue";
import { useAppSelector } from "~/store";
import { TNextPageWithLayout } from "~/types/layout";
import { _format } from "~/utils";

const Index: TNextPageWithLayout = () => {
  const { current: newUser } = useAppSelector((state) => state.user);
  const { bank } = useCatalogue({ bankEnabled: !!newUser });
  const [pagination, setPagination] =
    useState<TablePaginationConfig>(defaultPagination);
  const item = useRef<TUserHistoryRechargeVND>();
  const [modal, setModal] = useState(false);
  const queryClient = useQueryClient();

  const { isFetching, data } = useQuery(
    [
      "rechargeVNDList",
      {
        Current: pagination.current,
        PageSize: pagination.pageSize,
        UID: newUser?.UserId,
      },
    ],
    () =>
      adminSendUserWallet
        .getList({
          PageIndex: pagination.current,
          PageSize: pagination.pageSize,
          OrderBy: "Id desc",
          UID: newUser?.UserId,
        })
        .then((res) => res.Data),
    {
      keepPreviousData: true,
      enabled: !!newUser,
      onSuccess: (data) =>
        setPagination({ ...pagination, total: data?.TotalItem }),
      onError: (error) => {
        showToast({
          title: "Đã xảy ra lỗi!",
          message: (error as any)?.response?.data?.ResultMessage,
          type: "error",
        });
      },
    }
  );

  const handleModal = (itemSelected?: TUserHistoryRechargeVND) => {
    if (itemSelected) {
      item.current = itemSelected;
      setModal(true);
    } else {
      item.current = undefined;
      setModal(false);
    }
  };

  const mutationDelete = useMutation(adminSendUserWallet.updateStatusCancel, {
    onSuccess: () => {
      queryClient.invalidateQueries("rechargeVNDList");
      handleModal(undefined);
      toast.success("Huỷ yêu cầu thành công");
    },
    onError: (error) => {
      showToast({
        title: "Đã xảy ra lỗi!",
        message: (error as any)?.response?.data?.ResultMessage,
        type: "error",
      });
    },
  });

  return (
    <React.Fragment>
      <h1 className="titlePageUser !mb-0">Nạp tiền VNĐ</h1>
      <div className="lg:flex mb-4">
        <div className="tableBox cardTopTable flex mr-4 !py-2 px-4 items-center rounded-[0px]">
          <div className="flex IconBoxFilter IconFilter text-center">
            <i className="far fa-dollar-sign"></i>
          </div>
          <div>
            <p>Tổng tiền đã nạp</p>
            <div className="text-[#f14f04] font-bold text-right">
              {_format.getVND(data?.Items?.[0]?.TotalAmount)}
            </div>
          </div>
        </div>
      </div>
      <div className="leading-relaxed">
        <div className="mb-4 tableBox p-5">
          <RechargeContent newUser={newUser} />
        </div>
        <div className="tableBox px-5 mb-4">
          <RechargeVNDForm bankCatalogue={bank ?? []} newUser={newUser} />
        </div>
        <div className="tableBox">
          <HistoryRechargeVNDTable
            {...{
              data: data?.Items,
              pagination,
              handleModal: (item: TUserHistoryRechargeVND) => handleModal(item),
              handlePagination: (pagination) => setPagination(pagination),
              loading: isFetching,
            }}
          />
        </div>
      </div>
      <ModalDelete
        id={item.current?.Id}
        onCancel={() => handleModal(undefined)}
        onConfirm={
          () => console.log("dataSend: ", { ...item.current, Status: 3 })
          // mutationDelete.mutateAsync({ ...item.current, Status: 3 })
        }
        visible={modal}
        title="Bạn có chắc muốn huỷ yêu cầu"
      />
    </React.Fragment>
  );
};

Index.displayName = SEOHomeConfigs.financialManagement.rechargeVNĐ;
Index.Layout = UserLayout;

export default Index;
