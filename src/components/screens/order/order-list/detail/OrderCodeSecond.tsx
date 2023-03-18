import { List, Popconfirm, Typography } from 'antd'
import React from 'react'

import { useMutation, useQueryClient } from 'react-query'
import { mainOrderCode } from '~/api'
import { ActionButton } from '~/components'
import { toast } from '~/components/toast'
import { toastApiErr } from '~/utils'
import { AddOrderCode } from './AddOrderCode'

type TProps = {
	data?: TOrder
	RoleID: number
}

export const OrderCodeSecond: React.FC<TProps> = ({ data, RoleID }) => {
	const queryClient = useQueryClient()

	const mutationDelete = useMutation(mainOrderCode.delete, {
		onSuccess: (res) => {
			toast.success('Xoá mã vận đơn thành công')
			queryClient.invalidateQueries(['OrderShopDetailModal', data.Id])
		},
		onError: (err) => {
			toastApiErr(err)
		}
	})
	const renderViewList = () => {
		if (!!data) {
			return (
				<List
					size="small"
					bordered
					dataSource={data.MainOrderCodes || []}
					renderItem={(item, index) => (
						<List.Item
							style={{
								paddingTop: 0,
								paddingBottom: 0
							}}
							key={`MainOrderCodes-${index}`}
							actions={[
								<Popconfirm
									placement="topLeft"
									title="Bạn có muốn xoá mã đơn hàng này?"
									onConfirm={() => {
										if (!mutationDelete.isLoading) {
											mutationDelete.mutateAsync(item.Id)
										}
									}}
									disabled={mutationDelete.isLoading}
									okText="Xóa"
									cancelText="Hủy"
								>
									<ActionButton
										iconContainerClassName="ml-2 border-none"
										icon="fas fa-minus-circle"
										title="Xóa"
										placement="right"
									/>
								</Popconfirm>
							]}
						>
							<Typography.Text mark>{item.Code}</Typography.Text>
							<Typography.Text>{item.ShopID}</Typography.Text>
						</List.Item>
					)}
				/>
			)
		} else {
			return <></>
		}
	}
	const renderBtn = () => {
		if (data) {
			if (RoleID == 1 || RoleID == 2 || RoleID == 4) {
				return <AddOrderCode orderId={data.Id} dataList={data.MainOrderCodes || []} />
			} else {
				return <></>
			}
		} else return <></>
	}
	return (
		<div>
			<div>{renderViewList()}</div>
			<div className="mt-4">{renderBtn()}</div>
		</div>
	)
}
