import { Tag, Tooltip } from 'antd'
import clsx from 'clsx'
import Link from 'next/link'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import { IconButton } from '~/components'
import { orderStatus } from '~/configs'
import { _format } from '~/utils'

type TProps = {
	data: TOrder
}

const templateFee = [
	{
		id: 1,
		label: 'Tiền hàng',
		value: [
			{
				key: 'PriceVND',
				value: null
			},
			{
				key: 'PriceCNY',
				value: null
			}
		],
		icon: 'far fa-box-usd'
	},
	{
		id: 2,
		label: 'Phí mua hàng',
		value: [
			{
				key: 'FeeBuyPro',
				value: null
			}
		],
		icon: 'far fa-badge-dollar'
	},
	{
		id: 3,
		label: 'Phí kiểm đếm',
		value: [
			{
				key: 'IsCheckProductPrice',
				value: null
			}
		],
		icon: 'far fa-badge-dollar'
	},
	{
		id: 4,
		label: 'Phí đóng gỗ',
		value: [
			{
				key: 'IsPackedPrice',
				value: null
			}
		],
		icon: 'far fa-badge-dollar'
	},
	{
		id: 5,
		label: 'Phí bảo hiểm',
		value: [
			{
				key: 'InsuranceMoney',
				value: null
			}
		],
		icon: 'far fa-badge-dollar'
	},
	{
		id: 6,
		label: 'Phí giao hàng tận nhà',
		value: [
			{
				key: 'IsFastDeliveryPrice',
				value: null
			}
		],
		icon: 'far fa-badge-dollar'
	},
	{
		id: 7,
		label: 'Phí ship nội địa trung quốc',
		value: [
			{
				key: 'FeeShipCN',
				value: null
			}
			// {
			//   key: "FeeShipCNCNY",
			//   value: null,
			// },
		],
		icon: 'far fa-badge-dollar'
	},
	{
		id: 8,
		label: 'Phí cân nặng',
		value: [
			{
				key: 'FeeWeight',
				value: null
			},
			{
				key: 'TQVNWeight',
				value: null
			}
		],
		icon: 'far fa-badge-dollar'
	},
	{
		id: 9,
		label: 'Tổng tiền phụ phí',
		value: [
			{
				key: 'FeeSupports',
				value: null
			}
		],
		icon: 'far fa-coins'
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
	}
]

const convertNDT =
	' FeeBuyPro |IsCheckProductPrice |IsPackedPrice |InsuranceMoney |IsFastDeliveryPrice |FeeShipCN |FeeShipCNCNY |FeeWeight |FeeSupports |'

const styleWrapIcon = `text-sm text-[#666565] mr-4`

const styleValue = `text-sm text-textMain font-semibold`

export const ShopOrderOverViewShort: React.FC<TProps> = ({ data }) => {
	const [renderFee, setRenderFee] = useState(templateFee)

	useEffect(() => {
		// const newFee = renderFee.map((item) => {
		const newFee = templateFee.map((item) => {
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
					// f.value = Math.ceil(f.value / data?.CurrentCNYVN)
					f.value = (f.value / data?.CurrentCNYVN).toFixed(2)
				}
			})
		})

		setRenderFee(newFee)
	}, [data])

	return (
		<>
			<div className="px-[10px]">
				<div className=" p-4 flex justify-between">
					<p className="text-[16px] cursor-pointer font-semibold w-auto ">Tổng quan chi phí của đơn shop này</p>
					<Link
						href={{
							pathname: '/user/order-list/detailShopOrder',
							query: {
								id: data?.Id
							}
						}}
						passHref
					>
						<a rel="noopener noreferrer">
							<p className="text-blue italic">Đi tới chi tiết</p>
						</a>
					</Link>
				</div>

				<div className="sm:grid lg:grid-cols-2 md:grid-cols-1  gap-[120px] gap-y-3 px-[32px]">
					{renderFee.map((item) => (
						<div className="col-span-1" key={`${item?.id}-${item?.id}`}>
							<div className="flex justify-start items-center">
								<p className={styleWrapIcon}>{item?.label}:</p>
								<div className={clsx(styleValue, item?.value[0]?.key == 'TotalOrderAmount' && 'text-orange')}>
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
						</div>
					))}
				</div>
			</div>
		</>
	)
}
