import { Tag } from 'antd'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import { IconButton } from '~/components'
import { orderStatus } from '~/configs'
import { _format } from '~/utils'

type TProps = {
	data: TOrder
	updatePaid: (type: 'payment' | 'deposit') => void
}

const templateFee = [
	{
		id: 20,
		label: 'Tỷ giá đơn hàng',
		value: [
			{
				key: 'CurrentCNYVN',
				value: null
			}
		],
		icon: 'far fa-yen-sign'
	},
	{
		id: 10,
		label: 'Tổng tiền đơn hàng',
		value: [
			{
				key: 'TotalOrderAmount',
				value: null
			}
		],
		icon: 'far fa-coins'
	},
	{
		id: 11,
		label: 'Số tiền phải cọc',
		value: [
			{
				key: 'AmountDeposit',
				value: null
			}
		],
		icon: 'far fa-file-invoice-dollar'
	},
	{
		id: 12,
		label: 'Đã thanh toán',
		value: [
			{
				key: 'Deposit',
				value: null
			}
		],
		icon: 'far fa-money-check-alt'
	},
	{
		id: 13,
		label: 'Còn lại',
		value: [
			{
				key: 'RemainingAmount',
				value: null
			}
		],
		icon: 'far fa-poll-h'
	}
]

const convertNDT =
	' FeeBuyPro |IsCheckProductPrice |IsPackedPrice |InsuranceMoney |IsFastDeliveryPrice |FeeShipCN |FeeShipCNCNY |FeeWeight |FeeSupports |'

const styleLi = `flex items-center justify-between pb-3 border-b border-[#56545454] pt-[10px] last:border-none`
const styleWrapIcon = `text-sm text-[#000]`
const styleIcon = `mr-2 pt-[2px] text-[#ffa500] text-[18px]`
const styleValue = `text-sm text-[#666565] font-semibold`

export const OrderOverView: React.FC<TProps> = ({ data, updatePaid }) => {
	const [renderFee, setRenderFee] = useState(templateFee)

	useEffect(() => {
		const newFee = renderFee.map((item) => {
			item?.value.forEach((v) => {
				if (v?.key === 'FeeSupports') {
					v.value = data?.[v.key].reduce((acc, cur) => (acc += cur?.SupportInfoVND), 0)
				} else {
					v.value = data?.[v.key]
				}
			})
			return item
		})

		newFee.forEach((fee) => {
			fee.value.forEach((f) => {
				if (convertNDT.match(f.key)) {
					f.value = Math.ceil(f.value / data?.CurrentCNYVN)
				}
			})
		})

		setRenderFee(newFee)
	}, [data])

	return (
		<>
			<div className="tableBox px-4">
				<div className="titleTable">Tổng quan đơn hàng</div>
				<div className="px-[10px]">
					<div className={styleLi}>
						<div className={styleWrapIcon}>
							<i className={`far fa-calendar-minus ${styleIcon}`}></i>
							<span>Trạng thái đơn hàng: </span>
						</div>
						<Tag color={orderStatus.find((x) => x.id === data?.Status)?.color}>{data?.StatusName}</Tag>
					</div>
					{renderFee.map((item) => (
						<div className={styleLi} key={`${item?.id}-${item?.id}`}>
							<div className={styleWrapIcon}>
								<i className={`${item?.icon} ${styleIcon}`}></i>
								<span>{item?.label}</span>
							</div>
							<div className={styleValue}>
								{item?.value.length > 1 &&
									item.value.map((x) => {
										if (x.key.includes('TQ') || x.key.includes('CNY') || x.key.includes('TQ')) {
											if (x.key.includes('Price') || x.key.includes('FeeShip')) {
												return ` - (${_format.getVND(x?.value, ' ¥')})`
											} else {
												return ` - (${x?.value} kg)`
											}
										} else {
											return _format.getVND(x?.value, convertNDT.match(item?.value[0]?.key) ? ' ¥' : ' VNĐ')
										}
									})}
								{item?.value.length === 1 &&
									_format.getVND(item?.value[0].value, convertNDT.match(item?.value[0]?.key) ? ' ¥' : ' VNĐ')}
							</div>
						</div>
					))}
				</div>
				<div className="flex justify-between mt-4">
					<IconButton onClick={() => router.back()} title="Trở về" icon="fas fa-undo-alt" showLoading />
					{data?.Status === 0 && (
						<IconButton
							onClick={() => updatePaid('deposit')}
							title="Đặt cọc"
							icon="fas fa-hand-holding-usd"
							showLoading
							toolip="Đặt cọc đơn này"
						/>
					)}
					{data?.Status === 7 && (
						<IconButton
							onClick={() => updatePaid('payment')}
							title="Thanh toán"
							icon="fas fa-money-check-edit-alt"
							showLoading
							toolip="Thanh toán đơn này"
						/>
					)}
				</div>
			</div>
		</>
	)
}
