import { Collapse, List, Typography } from 'antd'
import { useRouter } from 'next/dist/client/router'
import React, { FC, useState } from 'react'
import { order } from '~/api'
import { ActionButton } from '~/components/globals/button/ActionButton'
import { IconButton } from '~/components/globals/button/IconButton'
import { OrderShopDetailModal } from '~/components/screens/Modal'
import { toast } from '~/components/toast'
import { useDisclosure } from '~/modules/core/hooks'
import { IOrderShop } from '~/types'
import { _format } from '~/utils'
import { OrderProductItem } from './OrderProductItem'
import { OrderProductList } from './OrderProductList'

type OrderIDShopListProps = {
	data?: TOrder
	RoleID: number
	refetch: () => void
	onViewShopOrderDetail?: (newId: number) => void
}
export const OrderShopList: FC<OrderIDShopListProps> = ({ data, RoleID, refetch, onViewShopOrderDetail }) => {
	const router = useRouter()
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
								<ActionButton
									onClick={() => {
										onViewShopOrderDetail?.(item?.Id)
									}}
									iconContainerClassName="ml-2 border-none"
									icon="fas fa-info-square"
									title="Chi tiết"
									placement="right"
								/>
							]}
						>
							<Typography.Text mark>{item?.Id}</Typography.Text>
							<Typography.Text>{item?.ProductQuantity}</Typography.Text>
							<Typography.Text>{item?.TotalPriceVND}</Typography.Text>
						</List.Item>
					)}
				/>
			)
		} else return <>Loading...</>
	}
	return (
		<React.Fragment>
			{/* <div className="orderProductItem  flex justify-between items-center">
				<div className="flex flex-col">
					<Typography.Text className="">
						Tổng số lượng: <span className="text-lg font-semibold text-[#F5851E]">{dataOrderShop.TotalItem}</span>
					</Typography.Text>
					<Typography.Text className="">
						Tổng tiền sản phẩm:{' '}
						<span className="text-lg font-semibold text-[#2686ED]">{_format.getVND(dataOrderShop?.PriceVND)}</span>{' '}
					</Typography.Text>
				</div>
				<div>
					{(RoleID === 1 || RoleID === 3 || RoleID === 4) && (
						<IconButton
							onClick={() => onExportExcel()}
							title="Xuất"
							icon="fas fa-file-export"
							showLoading
							toolip="Xuất thống kê"
							green
							btnClass="ml-4"
						/>
					)}
				</div>
			</div> */}

			{/*     max-h-[700px] overflow-y-auto */}
			<div>
				<div className="h-full">
					{/* {data?.SubMainOrders.map((x, idx) => {
						return (
							<div>
								<Collapse defaultActiveKey={idx} expandIconPosition="right">
									<Collapse.Panel header={x.CustomID} key={idx}>
										<div>
											<OrderProductList dataOrderShop={x} refetch={refetch} RoleID={RoleID} />
										</div>
									</Collapse.Panel>
								</Collapse>

								
							</div>
						)
					})} */}
					{renderView()}
				</div>
			</div>
		</React.Fragment>
	)
}
