import React, { useEffect, useState } from 'react'
import { DataTable } from '~/components'
import { TColumnsType, TTable } from '~/types/table'
import { _format } from '~/utils'
type TFeeSupports = {
	Id?: number
	MainOrderId?: number
	SupportName?: string
	Updated?: Date
	UpdatedBy?: string
	SupportInfoVND?: number
}

import { Collapse } from 'antd'
const { Panel } = Collapse

const templageMethods = [
	{
		id: 1,
		value: null,
		label: 'Kho TQ',
		key: 'FromPlaceName',
		icon: 'far fa-warehouse'
	},
	{
		id: 2,
		value: null,
		label: 'Kho nhận',
		key: 'ReceivePlaceName',
		icon: 'far fa-warehouse'
	},
	{
		id: 3,
		value: null,
		label: 'Phương thức vận chuyển',
		key: 'ShippingTypeName',
		icon: 'far fa-shipping-fast'
	},
	{
		id: 4,
		value: null,
		label: 'Kiểm đếm',
		key: 'IsCheckProduct',
		icon: 'far fa-box-check'
	},
	{
		id: 5,
		value: null,
		label: 'Đóng gỗ',
		key: 'IsPacked',
		icon: 'far fa-archive'
	},
	{
		id: 6,
		value: null,
		label: 'Bảo hiểm',
		key: 'IsInsurance',
		icon: 'far fa-id-card'
	},
	{
		id: 7,
		value: null,
		label: 'Giao hàng tận nhà',
		key: 'IsFastDelivery',
		icon: 'far fa-hand-holding-box'
	}
]

const styleLi = `flex items-center justify-between pb-3 border-b border-[#56545454] pt-[10px] last:border-none`
const styleWrapIcon = `text-sm text-[#000] flex-1`
const styleIcon = `mr-2 pt-[2px] text-[#ffa500] text-[18px]`
const styleValue = `text-sm text-[#666565] font-semibold`

export const ShopOrderGeneralInfo: React.FC<TTable<TFeeSupports> & { dataAll; data2 }> = ({ data, dataAll, data2 }) => {
	const [renderMethods, setRenderMethods] = useState(templageMethods)

	useEffect(() => {
		const newMethod = renderMethods.map((item) => {
			item.value = dataAll?.[item.key]
			return item
		})

		setRenderMethods(newMethod)
	}, [dataAll])

	const columns: TColumnsType<TFeeSupports> = [
		{
			dataIndex: 'Id',
			render: (value, record, index) => <>{index + 1}</>,
			title: 'STT'
		},
		{
			dataIndex: 'SupportName',
			title: 'Tên phụ phí'
		},
		{
			title: 'Số tiền (VNĐ)',
			dataIndex: 'SupportInfoVND',
			render: (_, record) => {
				return <>{_format.getVND(record?.SupportInfoVND)}</>
			}
		}
	]

	return (
		<Collapse defaultActiveKey={[]} expandIconPosition="right">
			<Panel header="THÔNG TIN" key="1">
				<div className="p-2">
					<div className="mb-4 pb-4 border-b">
						<div className="titleTable p-2">Dịch vụ đơn hàng</div>

						<div className="px-[10px]">
							{renderMethods.map((item) => (
								<div className={styleLi} key={`${item?.id}-${item?.id}`}>
									<div className={styleWrapIcon}>
										<i className={`${item.icon} ${styleIcon}`}></i>
										<span>{item?.label}</span>
									</div>
									{item.key.includes('Is') && (
										<i
											className={`far text-[16px] !font-bold ${
												item.value ? 'fa-check text-[#388E3C]' : 'fa-times text-[#be2c2c]'
											}`}
										></i>
									)}
									{!item.key.includes('Is') && <p className={styleValue}>{item?.value}</p>}
								</div>
							))}
						</div>
					</div>
				</div>
			</Panel>
		</Collapse>
	)
}
