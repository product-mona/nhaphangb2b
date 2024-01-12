import { Collapse } from 'antd'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import { FilterInput, FilterRangeDate, FilterSelect } from '~/components'
import { IconButton } from '~/components/globals/button/IconButton'
import { createdOrderStatusData, ECreatedOrderStatusData, ESearchData, search2Data } from '~/configs/appConfigs'
import { TTable } from '~/types/table'

const inputProps = {
	id: 'id',
	name: 'id',
	placeholder: 'Nhập nội dung tìm kiếm',
	label: 'Nhập mã đơn / tên shop / tên website'
}

const filterBox =
	'py-2 font-bold uppercase text-[12px] flex items-center justify-center border shadow-lg cursor-pointer hover:shadow-sm transition-all duration-500 hover:bg-[#EDF1F7]'

type TProps = {
	handleFilter: (newFilter) => void
	// handleDepositAll: TTable<TOrder>["handleModal"];
	// handlePaymentAll: TTable<TOrder>["handleModal"];
	numberOfOrder: any
	stateFilterStatus?: number
}

const CollapsePanelHeader = ({ setActiveKey, activeKey }) => {
	return (
		<div className="flex w-full justify-between">
			<IconButton
				onClick={() => setActiveKey(activeKey === 1 ? null : 1)}
				icon="fas fa-filter"
				title="Bộ lọc nâng cao"
				showLoading
				toolip="Bộ lọc nâng cao"
				btnClass="bg-red hover:bg-redDark"
			/>
		</div>
		// <div className="w-[100px] h-auto bg-red">1</div>
	)
}

export const UserAnotherOrderListFilter: React.FC<TProps> = ({ handleFilter, numberOfOrder, stateFilterStatus }) => {
	const { query } = useRouter()
	const TypeSearch = useRef<ESearchData>(null)
	const SearchContent = useRef<string>(null)
	const Status = useRef<ECreatedOrderStatusData>(null)
	const FromDate = useRef<string>(null)
	const ToDate = useRef<string>(null)
	const [activeKey, setActiveKey] = useState('1')

	return (
		<Collapse
			className="collapse-order"
			accordion={true}
			expandIcon={() => <CollapsePanelHeader setActiveKey={setActiveKey} activeKey={activeKey} />}
			activeKey={activeKey}
		>
			<Collapse.Panel header={''} key="1">
				<div className="sm:grid sm:grid-cols-5 sm:gap-4 w-full p-4">
					<div className="col-span-1 sm:mb-0 mb-4">
						<FilterSelect
							isClearable={true}
							label="Tìm kiếm theo"
							data={search2Data}
							placeholder="Nội dung tìm kiếm"
							handleSearch={(val: number) => (TypeSearch.current = val)}
						/>
					</div>
					<div className="col-span-1 sm:mb-0 mb-4">
						<FilterInput
							{...{
								...inputProps,
								handleSearch: (val: string) => (SearchContent.current = val)
							}}
						/>
					</div>
					<div className="col-span-1 sm:mb-0 mb-4">
						<FilterSelect
							isClearable={true}
							data={createdOrderStatusData}
							placeholder="Chọn trạng thái"
							label="Trạng thái"
							handleSearch={(val: ECreatedOrderStatusData) => (Status.current = val)}
						/>
					</div>
					<div className="col-span-1 sm:mb-0 mb-4">
						<FilterRangeDate
							format="DD/MM/YYYY"
							placeholder="Từ ngày / đến ngày"
							handleDate={(val: string[]) => {
								FromDate.current = val[0]
								ToDate.current = val[1]
							}}
						/>
					</div>
					<div className="col-span-1 sm:mb-0 flex justify-end items-end">
						<IconButton
							onClick={() =>
								handleFilter({
									TypeSearch: TypeSearch.current,
									SearchContent: SearchContent.current,
									Status: Status.current,
									FromDate: FromDate.current,
									ToDate: ToDate.current,
									PageIndex: 1
								})
							}
							title="Tìm kiếm"
							icon="far fa-search"
							btnClass=""
							showLoading
							toolip=""
						/>
					</div>
				</div>
				<div className="lg:grid lg:grid-cols-6 gap-2 mb-2 px-2 py-2">
					{(query?.q !== '3' ? numberOfOrder.filter((x) => x.id !== 100) : numberOfOrder.filter((x) => x.id !== 101))?.map(
						(item) => (
							<div
								key={item?.name}
								className={clsx(
									`col-span-${item.col}`,
									filterBox,
									stateFilterStatus == item.id && 'bg-[#b53aa5] text-[#FFF] hover:bg-[#b53aa5]'
								)}
								onClick={() => {
									Status.current = item.id
									handleFilter({
										TypeSearch: TypeSearch.current,
										SearchContent: SearchContent.current,
										Status: Status.current,
										FromDate: FromDate.current,
										ToDate: ToDate.current,
										PageIndex: 1
									})
								}}
							>
								<div className="mx-1">{item.name}</div>
								<div className="mx-1">({item.value})</div>
							</div>
						)
					)}
				</div>
			</Collapse.Panel>
		</Collapse>
	)
}
