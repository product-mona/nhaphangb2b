import { Collapse } from 'antd'
import React, { FC } from 'react'
import { IOrderShop } from '~/types'
import { OrderIDProductList } from './OrderIDProductList'
type OrderIDShopListProps = {
	orderShopList: IOrderShop[]
}
export const OrderIDShopList: FC<OrderIDShopListProps> = ({ orderShopList }) => {
	return (
		<div className="tableBox mt-4 px-2">
			{orderShopList.map((x, index) => {
				return (
					<div>
						<Collapse defaultActiveKey={index} expandIconPosition="right">
							<Collapse.Panel header={<h2 className="uppercase font-bold !mb-0 text-[#fff]">{x.ShopId}</h2>} key={index}>
								<OrderIDProductList data={x.Orders} />
							</Collapse.Panel>
						</Collapse>
					</div>
				)
			})}
		</div>
	)
}
