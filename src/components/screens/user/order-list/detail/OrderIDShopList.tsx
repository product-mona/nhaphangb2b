import { Collapse, Tag } from 'antd'
import React, { FC } from 'react'
import { useQueries, UseQueryResult } from 'react-query'
import { mainOrder } from '~/api'
import { orderStatus } from '~/configs'
import { IOrderShop } from '~/types'
import { SecondOrderIDProductList } from './SecondOrderIDProdutList'
import { ShopOrderOverViewShort } from './ShopOrder'

type OrderIDShopListProps = {
	orderShopList: TOrder[]
	dataOrder?: TOrder
}
export const OrderIDShopList: FC<OrderIDShopListProps> = ({ orderShopList, dataOrder }) => {
	const results = useQueries(
		orderShopList.map((vl, idx) => {
			return {
				queryKey: ['OrderDetail', vl.Id],
				queryFn: () => {
					return mainOrder.getByID(vl?.Id)
				},

				enabled: !!vl.Id,
				refetchOnWindowFocus: false
			}
		})
	)
	const renderDetailView = (vl: UseQueryResult<TResponse<TOrder>, unknown>, index) => {
		if (!vl.data) {
			return <>Loading...</>
		} else {
			return (
				<div>
					{/* <Tag color={orderStatus.find((x) => x.id === vl?.data?.Data.Status)?.color}>
										{vl?.data?.Data?.StatusName}
									</Tag> */}
					<ShopOrderOverViewShort data={vl.data.Data} />
					<SecondOrderIDProductList dataOrder={vl.data.Data} data={vl.data.Data.Orders} />
				</div>
			)
		}
	}
	return (
		<div className="tableBox mt-4 px-2">
			<div className="py-2">
				<p className="text-[16px] py-2">Danh sách đơn cửa hàng</p>
			</div>
			<Collapse expandIconPosition="right">
				{results.map((vl, idx) => {
					return (
						<Collapse.Panel
							header={<p className="text-[16px] font-bold !mb-0 text-[#fff]">{vl?.data?.Data?.MainOrderCustomID || ''}</p>}
							key={idx}
						>
							{renderDetailView(vl, idx)}
						</Collapse.Panel>
					)
				})}
			</Collapse>
		</div>
	)
}
