import { Collapse } from 'antd'
import router, { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'
import { FilterCheckbox, FilterInput, FilterSelect } from '~/components'
import { IconButton } from '~/components/globals/button/IconButton'
import { FilterInputNumber, FilterRangeDate } from '~/components/globals/filterBase'
import { createdOrderStatusData, ECreatedOrderStatusData, ESearchData, searchData } from '~/configs/appConfigs'

const filterBox =
	'py-2 font-bold uppercase text-[14px] flex items-center justify-center border shadow-lg cursor-pointer hover:shadow-sm transition-all duration-500 hover:bg-[#a8d7dd]'

const codeProps = {
	id: 'code',
	name: 'code',
	label: 'Nhập ID đơn / website / username',
	placeholder: 'Nhập ...'
}

const fromPriceProps = {
	id: 'fromPrice',
	name: 'fromPrice',
	label: 'Giá từ',
	placeholder: 'Nhập giá từ'
}

const toPriceProps = {
	id: 'toPrice',
	name: 'toPrice',
	label: 'Giá đến',
	placeholder: 'Nhập giá đến'
}

type TProps = {
	handleFilter: (newFilter) => void
	handleExportExcel: () => void
	numberOfOrder: any
}

const { Panel } = Collapse

const CollapsePanelHeader = ({ handleExportExcel, setActiveKey, activeKey }) => {
	return (
		<div className="flex w-full justify-between">
			<IconButton
				onClick={() => setActiveKey(activeKey === 1 ? null : 1)}
				icon="fas fa-filter"
				title="Bộ lọc nâng cao"
				showLoading
				toolip="Bộ lọc nâng cao"
				btnClass="bg-red hover:!bg-redDark"
			/>
			<IconButton
				onClick={() => handleExportExcel()}
				icon="fas fa-file-export"
				title="Xuất"
				showLoading
				toolip="Xuất thống kê"
				green
			/>
		</div>
	)
}

export const OrderListFilter: FC<TProps> = ({ handleFilter, handleExportExcel, numberOfOrder }) => {
	const { query } = useRouter()
	const TypeSearch = useRef<number>(null)
	const SearchContent = useRef<string>(null)
	const FromDate = useRef<string>(null)
	const ToDate = useRef<string>(null)
	const FromPrice = useRef<number>(null)
	const ToPrice = useRef<number>(null)
	const Status = useRef(null)
	const IsNotMainOrderCode = useRef(false)
	const [activeKey, setActiveKey] = useState('1')

	return (
		<Collapse
			className="collapse-order"
			accordion={true}
			expandIcon={() => (
				<CollapsePanelHeader handleExportExcel={handleExportExcel} setActiveKey={setActiveKey} activeKey={activeKey} />
			)}
			activeKey={activeKey}
		>
			<Panel header={''} key="1">
				<div className="lg:grid lg:grid-cols-3 gap-4 mb-4] px-4 py-6">
					<div className="col-span-1 lg:mb-0 ">
						<FilterSelect
							placeholder="Chọn ... "
							data={searchData}
							label="Tìm kiếm theo"
							isClearable
							handleSearch={(val: ECreatedOrderStatusData) => (TypeSearch.current = val)}
						/>
					</div>
					<div className="col-span-1 lg:mb-0 ">
						<FilterInput {...codeProps} handleSearch={(val: string) => (SearchContent.current = val.trim())} />
					</div>
					<div className="col-span-1 lg:mb-0 ">
						<FilterRangeDate
							format="DD/MM/YYYY"
							placeholder="Từ ngày / đến ngày"
							handleDate={(val: string[]) => {
								FromDate.current = val[0]
								ToDate.current = val[1]
							}}
						/>
					</div>
					<div className="col-span-1 lg:mb-0 ">
						<FilterInputNumber {...fromPriceProps} suffix=" VNĐ" handleSearch={(val: number) => (FromPrice.current = val)} />
					</div>
					<div className="col-span-1 lg:mb-0 ">
						<FilterInputNumber {...toPriceProps} suffix=" VNĐ" handleSearch={(val: number) => (ToPrice.current = val)} />
					</div>
					<div className="col-span-1 lg:mb-0 ">
						<FilterSelect
							placeholder="Chọn trạng thái"
							label="Trạng thái"
							isClearable
							handleSearch={(val: ECreatedOrderStatusData) => (Status.current = val)}
							data={createdOrderStatusData}
						/>
					</div>
					<div className="col-span-3 lg:flex items-center justify-end lg:mb-0 ">
						<FilterCheckbox
							label="Đơn không có mã vận đơn"
							onChange={() => (IsNotMainOrderCode.current = !IsNotMainOrderCode.current)}
						/>
						<IconButton
							onClick={() =>
								handleFilter({
									TypeSearch: TypeSearch.current,
									SearchContent: SearchContent.current,
									Status: Status.current,
									FromPrice: FromPrice.current,
									ToPrice: ToPrice.current,
									FromDate: FromDate.current,
									ToDate: ToDate.current,
									IsNotMainOrderCode: IsNotMainOrderCode.current,
									PageIndex: 1
								})
							}
							icon="fas fa-filter"
							title="Lọc"
							btnClass=""
							showLoading
							toolip="Lọc"
						/>
					</div>
				</div>
				<div className="lg:grid lg:grid-cols-3 gap-4 mb-4] px-4 py-6">
					{(query?.q !== '3' ? numberOfOrder.filter((x) => x.id !== 100) : numberOfOrder.filter((x) => x.id !== 101))?.map(
						(item) => (
							<div
								key={item?.name}
								className={`col-span-${item.col} ${filterBox}`}
								onClick={() => {
									Status.current = item.id
									handleFilter({
										TypeSearch: null,
										SearchContent: null,
										Status: Status.current,
										FromPrice: null,
										ToPrice: null,
										FromDate: null,
										ToDate: null,
										IsNotMainOrderCode: null,
										PageIndex: 1
									})
								}}
							>
								<div className={`mx-1`}>{item.name}</div>
								<div className={`mx-1`}>({item.value})</div>
							</div>
						)
					)}
				</div>
			</Panel>
		</Collapse>
	)
}
