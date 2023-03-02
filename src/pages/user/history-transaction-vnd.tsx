import React, {useState} from "react";
import {useQuery} from "react-query";
import {historyPayWallet} from "~/api";
import {HistoryTransactionVNDFilter, HistoryTransactionVNDTable, showToast, UserLayout} from "~/components";
import {SEOHomeConfigs} from "~/configs/SEOConfigs";
import {useAppSelector} from "~/store";
import {TNextPageWithLayout} from "~/types/layout";
import {_format} from "~/utils";

const Index: TNextPageWithLayout = () => {
	const {current: newUser} = useAppSelector((state) => state.user);

	const [filter, setFilter] = useState({
		PageIndex: 1,
		PageSize: 20,
		TotalItems: null,
		OrderBy: "Id desc",
		FromDate: null,
		Status: null,
		ToDate: null,
		UID: newUser?.UserId,
	});

	const handleFilter = (newFilter) => {
		setFilter({...filter, ...newFilter});
	};

	const {data, isFetching} = useQuery(
		["historyPayWallet", {...filter}],
		() => historyPayWallet.getList(filter).then((res) => res.Data),
		{
			keepPreviousData: true,
			onSuccess: (data) =>
				setFilter({...filter, TotalItems: data?.TotalItem, PageIndex: data?.PageIndex, PageSize: data?.PageSize}),
			onError: (error) => {
				showToast({
					title: "Đã xảy ra lỗi!",
					message: (error as any)?.response?.data?.ResultMessage,
					type: "error",
				});
			},
			enabled: !!newUser,
		}
	);

	return (
		<React.Fragment>
			<div className="titlePageUser">LỊCH SỬ GIAO DỊCH</div>
			<div className="flex space-x-4 mb-4">
				<div className="cardTopTable rounded-none items-center !py-2 tableBox">
					<div className="text-[#f14f04] items-center IconFilter">
						<i className="far fa-dollar-sign "></i>
					</div>
					<div className="text-right sm:ml-4">
						<p>Tổng tiền đã nạp</p>
						<span className="text-[#f14f04] font-bold text-base">{_format.getVND(data?.Items?.[0]?.TotalAmount4)}</span>
					</div>
				</div>

				<div className="cardTopTable rounded-none items-center !py-2 tableBox">
					<div className="text-blue bg-[#e5f2ff] items-center IconFilter">
						<i className="far fa-dollar-sign"></i>
					</div>
					<div className="text-right sm:ml-4">
						<p>Số dư hiện tại</p>
						<span className="text-blue font-bold text-base">{_format.getVND(data?.Items?.[0]?.Wallet)}</span>
					</div>
				</div>
			</div>
			<div className="tableBox">
				<HistoryTransactionVNDFilter handleFilter={handleFilter} />
				<div className="mt-4">
					<HistoryTransactionVNDTable
						data={data?.Items}
						filter={filter}
						handleFilter={handleFilter}
						loading={isFetching}
					/>
				</div>
			</div>
		</React.Fragment>
	);
};

Index.displayName = SEOHomeConfigs.financialManagement.listTransactionVND;
Index.Layout = UserLayout;

export default Index;
