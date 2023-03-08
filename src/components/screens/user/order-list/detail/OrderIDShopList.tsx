import { Collapse } from 'antd'
import React, { FC } from 'react'
import { IOrderShop } from '~/types'
import { SecondOrderIDProductList } from './SecondOrderIDProdutList'

type OrderIDShopListProps = {
	orderShopList: IOrderShop[]
	dataOrder?: TOrder
}
export const OrderIDShopList: FC<OrderIDShopListProps> = ({ orderShopList, dataOrder }) => {
	return (
		<div className="tableBox mt-4 px-2">
			{orderShopList.map((x, index) => {
				return (
					<div>
						<Collapse defaultActiveKey={index} expandIconPosition="right">
							<Collapse.Panel header={<h2 className="uppercase font-bold !mb-0 text-[#fff]">{x.ShopId}</h2>} key={index}>
								<SecondOrderIDProductList dataOrder={dataOrder} data={x.Orders} />
							</Collapse.Panel>
						</Collapse>
					</div>
				)
			})}
		</div>
	)
}
