import { Typography } from 'antd'
import router from 'next/router'
import React, { useState, useMemo } from 'react'
import { useMutation } from 'react-query'
import { order } from '~/api'
import { IconButton, showToast, toast } from '~/components'
import { _format, onCalTotalNumber } from '~/utils'
import { OrderProductItem } from './OrderProductItem'

type TProps = {
	dataOrderShop: TOrder
	// dataOrderShop: IOrderShop
	RoleID: number
	refetch?: () => void
}

export const OrderProductList: React.FC<TProps> = ({ RoleID, dataOrderShop, refetch }) => {
	const mutationUpdate = useMutation(order.update, {
		onSuccess: () => {
			toast.success('Cập nhật sản phẩm thành công')
			refetch?.()
		},
		onError: (error) => {
			showToast({
				message: (error as any)?.response?.data?.ResultMessage,
				type: 'error',
				title: 'Lỗi'
			})
		}
	})

	const handleUpdateProduct = (dataProduct: TOrder, Id?: number) => {
		if (dataProduct?.Quantity === null || dataProduct?.Quantity === undefined) {
			toast.error('Vui lòng nhập số lượng sản phẩm ')
			return
		}
		mutationUpdate.mutateAsync(dataProduct)
	}
	const totalItem = useMemo(() => {
		const rs = onCalTotalNumber(dataOrderShop?.Orders || [], 'Quantity')
		return rs
	}, [dataOrderShop?.Orders])
	return (
		<React.Fragment>
			<div className="orderProductItem  flex justify-between items-center">
				<div className="flex flex-col">
					<Typography.Text className="">
						Tổng số lượng sản phẩm: <span className="text-lg font-semibold text-[#F5851E]">{totalItem}</span>
					</Typography.Text>
					<Typography.Text className="">
						Tổng tiền sản phẩm:{' '}
						<span className="text-lg font-semibold text-[#2686ED]">{_format.getVND(dataOrderShop?.PriceVND)}</span>{' '}
					</Typography.Text>
				</div>
			</div>
			<div className="max-h-[700px] overflow-y-auto">
				<div className="h-full">
					{dataOrderShop?.Orders?.map((order, index) => (
						<OrderProductItem
							key={`${order.Id}`}
							order={order}
							index={index}
							handleUpdateProduct={handleUpdateProduct}
							loading={mutationUpdate.isLoading}
							RoleID={RoleID}
							dataOrderStop={dataOrderShop}
							// setCheckUpdate={() => setCheckUpdate(true)}
						/>
					))}
				</div>
			</div>
		</React.Fragment>
	)
}
