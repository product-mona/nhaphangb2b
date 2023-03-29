import { Popconfirm, List, Typography } from 'antd'
import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { mainOrderCode } from '~/api'
import { ActionButton, FormInput } from '~/components'
import { toast } from '~/components/toast'
import { useDeepEffect } from '~/hooks'
import { AddOrderCode } from './AddOrderCode'

type TProps = {
	data?: TOrder
	loading: boolean
	refetch?: any
	isAdmin?: boolean
	RoleID: number
}
const divStyles = {}

export const OrderCode: React.FC<TProps> = ({ data, loading, refetch, RoleID }) => {
	const { control, getValues, watch } = useFormContext<TOrder>()

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'MainOrderCodes'
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
										toast.info('Đang thực hiện việc xoá, vui lòng đợi trong giây lát...')
										mainOrderCode
											.delete(item.Id)
											.then(() => {
												remove(index)
												toast.success('Xoá mã vận đơn thành công')
												refetch()
											})
											.catch(toast.error)
									}}
									okText="Yes"
									cancelText="No"
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
			return null
		}
	}
	return (
		<React.Fragment>
			<div>{renderViewList()}</div>
			<div className="mt-4">
				{(RoleID === 1 || RoleID === 3 || RoleID === 4) && (
					<AddOrderCode realPriceCNY={data.TotalPriceRealCNY} dataList={data.MainOrderCodes} orderId={data?.Id} />
				)}
			</div>
		</React.Fragment>
	)
}
