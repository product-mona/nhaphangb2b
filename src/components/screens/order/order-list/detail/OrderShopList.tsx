import { Typography } from 'antd'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import React, { FC, useMemo } from 'react'
import { order } from '~/api'
import { ActionButton } from '~/components/globals/button/ActionButton'
import { DataTable } from '~/components/globals/table'
import { toast } from '~/components/toast'
import { TColumnsType } from '~/types/table'
import { _format } from '~/utils'

type OrderShopListProps = {
	data?: TOrder
	RoleID: number
	refetch: () => void
}
export const OrderShopList: FC<OrderShopListProps> = ({ data, RoleID, refetch }) => {
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
	const columns: TColumnsType<any> = useMemo(() => {
		return [
			{
				dataIndex: 'MainOrderCustomID',
				title: 'Mã đơn nhỏ'
				// render: (id) => <Typography.Text mark>{id}</Typography.Text>
			},
			{
				dataIndex: 'ProductQuantity',
				title: 'Số lượng sản phẩm',
				align: 'right',
				width: 150
			},
			{
				dataIndex: 'TotalPriceVND',
				title: 'Tổng tiền (VNĐ)',
				align: 'right',
				width: 250,
				render: (money) => _format.getVND(money, '')
			},
			{
				dataIndex: 'Id',
				title: 'Thao tác',
				align: 'right',
				render: (id, record) => (
					<div>
						<Link
							href={{
								pathname: '/manager/order/order-list/shopOrderDetail',
								query: {
									id: orderId,
									shopOrderId: record?.Id
								}
							}}
							passHref
						>
							<a rel="noopener noreferrer">
								<ActionButton
									iconContainerClassName="ml-2 border-none"
									icon="fas fa-info-square"
									title="Đi tới chi tiết"
									placement="right"
								/>
							</a>
						</Link>
					</div>
				)
			}
		]
	}, [])
	const renderTalbes = () => {
		return (
			<DataTable
				{...{
					style: 'secondary',
					className: 'no-bgcolor-tablerow',
					columns: columns,
					data: data.SubMainOrders

					// expandable: expandable
				}}
			/>
		)
	}

	return (
		<React.Fragment>
			<div>
				{/* <div className="h-full">{renderView()}</div> */}
				<div className="p-4">{renderTalbes()}</div>
			</div>
		</React.Fragment>
	)
}
