import { List, Typography } from 'antd'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import React, { FC } from 'react'
import { order } from '~/api'
import { ActionButton } from '~/components/globals/button/ActionButton'
import { toast } from '~/components/toast'
import { numberWithCommas } from '~/utils'

type OrderIDShopListProps = {
	data?: TOrder
	RoleID: number
	refetch: () => void
}
export const OrderShopList: FC<OrderIDShopListProps> = ({ data, RoleID, refetch }) => {
	const router = useRouter()
	const orderId = Number(router.query.id)
	const onExportExcel = async () => {
		try {
			const res = await order.exportExcel({
				MainOrderID: data?.Id
			})
			router.push(`${res.Data}`)
		} catch (error) {
			toast.error(error)
		}
	}

	const renderView = () => {
		if (!!data) {
			return (
				<List
					size="small"
					bordered
					dataSource={data.SubMainOrders || []}
					renderItem={(item, index) => (
						<List.Item
							style={{
								paddingTop: 0,
								paddingBottom: 0
							}}
							key={`MainOrderCodes-${index}`}
							actions={[
								<Link
									href={{
										pathname: '/manager/order/order-list/shopOrderDetail',
										query: {
											id: orderId,
											shopOrderId: item?.Id
										}
									}}
									passHref
								>
									<a rel="noopener noreferrer">
										<ActionButton
											iconContainerClassName="ml-2 border-none"
											icon="fas fa-info-square"
											title="Chi tiết"
											placement="right"
										/>
									</a>
								</Link>
							]}
						>
							<Typography.Text mark>{item?.MainOrderCustomID}</Typography.Text>
							<Typography.Text>{item?.ProductQuantity}</Typography.Text>
							<Typography.Text>{numberWithCommas(item?.TotalPriceVND)}</Typography.Text>
						</List.Item>
					)}
				/>
			)
		} else return <>Loading...</>
	}
	return (
		<React.Fragment>
			<div>
				<div className="h-full">{renderView()}</div>
			</div>
		</React.Fragment>
	)
}
