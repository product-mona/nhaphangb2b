import { DataTable } from '~/components/globals/table'
import { Modal, Space, Tag } from 'antd'
import { TableRowSelection } from 'antd/lib/table/interface'
import router from 'next/router'
import React, { FC, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { mainOrder, orderShopTemp } from '~/api'
import { ActionButton, showToast } from '~/components'
import { createdOrderStatusData, ECreatedOrderStatusData, orderStatus } from '~/configs/appConfigs'
import { TColumnsType, TTable } from '~/types/table'

import { toastApiErr, _format } from '~/utils'

export const NestedTableUserItemOrder: FC<any> = ({ handleModal, type, q, GroupMainOrderID, expandItemId }) => {
	const {
		data: itemOrderListQuery,
		isFetching,
		refetch
	} = useQuery(
		['ItemOrderListQuery', GroupMainOrderID],
		() => mainOrder.getSubGroupOrder({ id: GroupMainOrderID }).then((res) => res.Data),
		{
			onSuccess: (data) => {
				console.log('ItemOrderListQuery', data)
			},
			onError: (error) => {
				showToast({
					title: 'Đã xảy ra lôi!',
					message: (error as any)?.response?.data?.ResultMessage,
					type: 'error'
				})
			},
			retry: true,
			enabled: !!expandItemId && expandItemId == GroupMainOrderID
		}
	)
	const [delLoading, setDelLoading] = useState(false)
	const queryClient = useQueryClient()

	const handleDeleteProd = async (id: number) => {
		try {
			await mainOrder.delete(id)
			showToast({
				title: 'Hủy thành công!',
				message: `Hủy đơn hàng #${id} thành công!`,
				type: 'success'
			})
			queryClient.invalidateQueries('orderList')
			setDelLoading(false)
		} catch (error) {
			showToast({
				title: (error as any)?.response?.data?.ResultCode,
				message: (error as any)?.response?.data?.ResultMessage,
				type: 'error'
			})
			setDelLoading(false)
		}
	}
	const mutationRequestDeposit = useMutation(mainOrder.updateDepositStatus, {
		onSuccess: (res) => {
			queryClient.invalidateQueries('orderList')
		},
		onError: (err) => {
			toastApiErr(err)
		}
	})

	const columns: TColumnsType<TOrder> = [
		{
			dataIndex: 'MainOrderCustomID',
			title: 'ID đơn'
			// width: 60,
		},
		{
			dataIndex: 'ImageOrigin',
			title: 'Ảnh',
			align: 'center',
			render: (img) => {
				return (
					<div className="flex justify-center m-auto w-20 h-20">
						<img src={img ? img : '/pro-empty.jpg'} alt="image" width={75} height={75} style={{ borderRadius: '10px' }} />
					</div>
				)
			}
			// width: 120,
		},
		{
			dataIndex: 'TotalPriceVND',
			title: 'Tổng tiền (VNĐ)',
			align: 'right',
			responsive: ['md'],
			render: (price) => _format.getVND(price, ' ')
			// width: 150,
		},
		{
			dataIndex: 'AmountDeposit',
			title: 'Số tiền phải cọc (VNĐ)',
			align: 'right',
			// width: 150,
			responsive: ['lg'],
			render: (price) => _format.getVND(price, ' ')
		},
		{
			dataIndex: 'Deposit',
			title: 'Số tiền đã cọc (VNĐ)',
			// width: 150,
			align: 'right',
			responsive: ['lg'],
			render: (price) => _format.getVND(price, ' ')
		},

		{
			dataIndex: 'Status',
			title: 'Trạng thái',
			render: (status, record) => {
				const color = orderStatus.find((x) => x.id === status)
				return <Tag color={color?.color}>{record?.StatusName}</Tag>
			},
			// width: 140,
			responsive: ['xl']
		},
		{
			dataIndex: 'action',
			title: 'Thao tác',
			align: 'right',
			render: (_, record) => {
				if (Number(q) === 3) {
					return (
						<Space
							style={{
								pointerEvents: delLoading ? 'none' : 'all',
								opacity: delLoading ? '0.8' : '1'
							}}
							className="justify-end flex-wrap"
						>
							{Number(q) !== 3 && (
								<ActionButton
									onClick={() =>
										Modal.confirm({
											title: 'Xác nhận muốn mua lại đơn hàng này?',
											onOk: () => {
												const id = toast.loading('Đang thêm ...')
												orderShopTemp
													.addSame({ Id: record?.Id })
													.then((res) => {
														toast.update(id, {
															render: 'Thêm đơn thành công, vui lòng kiểm tra giỏ hàng!',
															type: 'success',
															autoClose: 1000,
															closeOnClick: true,
															isLoading: false
														})
													})
													.catch((error) => {
														toast.update(id, {
															render: 'Thêm đơn thất bại!',
															type: 'error',
															isLoading: false
														})
													})
											}
										})
									}
									icon="fas fa-cart-arrow-down"
									title="Mua lại đơn hàng này"
								/>
							)}

							<ActionButton
								onClick={() => {
									router.push({
										pathname: '/user/order-list/detail',
										query: {
											id: record?.Id
										}
									})
								}}
								icon="far fa-info-square"
								title="Xem chi tiết đơn"
							/>
							{record?.Status === ECreatedOrderStatusData.Finished && (
								<ActionButton
									onClick={() =>
										router.push({
											pathname: '/user/report/detail',
											query: {
												id: record?.Id
											}
										})
									}
									icon="fas fa-balance-scale-right"
									title="Khiếu nại"
									btnRed
								/>
							)}
							{record.IsCheckNotiPrice && (
								<>
									{record?.Status === ECreatedOrderStatusData.Undeposited && (
										<ActionButton
											onClick={() => {
												type.current = 'deposit'
												handleModal([record], undefined, 'one')
											}}
											icon="far fa-dollar-sign"
											title="Đặt cọc"
											btnYellow
										/>
									)}
									{record?.Status === ECreatedOrderStatusData.ArrivedToVietNamWarehouse && (
										<ActionButton
											onClick={() => {
												type.current = 'payment'
												handleModal([record], undefined, 'one')
											}}
											icon="fas fa-credit-card"
											title="Thanh toán"
											btnBlue
										/>
									)}
								</>
							)}
							{record?.Status === 0 && (
								<ActionButton
									onClick={() =>
										Modal.confirm({
											title: 'Xác nhận xóa đơn hàng?',
											onOk: () => handleDeleteProd(record?.Id)
										})
									}
									icon="fas fa-trash"
									title="Hủy đơn hàng!"
									btnYellow
								/>
							)}
						</Space>
					)
				} else {
					return (
						<Space
							style={{
								pointerEvents: delLoading ? 'none' : 'all',
								opacity: delLoading ? '0.8' : '1'
							}}
							className="justify-end flex-wrap"
						>
							<ActionButton
								onClick={() =>
									Modal.confirm({
										title: 'Xác nhận muốn mua lại đơn hàng này?',
										onOk: () => {
											const id = toast.loading('Đang thêm ...')
											orderShopTemp
												.addSame({ Id: record?.Id })
												.then((res) => {
													toast.update(id, {
														render: 'Thêm đơn thành công, vui lòng kiểm tra giỏ hàng!',
														type: 'success',
														autoClose: 1000,
														closeOnClick: true,
														isLoading: false
													})
												})
												.catch((error) => {
													toast.update(id, {
														render: 'Thêm đơn thất bại!',
														type: 'error',
														isLoading: false
													})
												})
										}
									})
								}
								icon="fas fa-cart-arrow-down"
								title="Mua lại đơn hàng này"
							/>
							<ActionButton
								onClick={() => {
									router.push({
										pathname: '/user/order-list/detail',
										query: {
											id: record?.Id
										}
									})
								}}
								icon="far fa-info-square"
								title="Xem chi tiết đơn"
							/>
							{record?.Status === 102 && (
								<ActionButton
									onClick={() => {
										Modal.confirm({
											title: 'Gửi yêu cầu báo cọc',
											onOk: () => {
												const id = toast.loading('"Đang xử lý ...')
												mutationRequestDeposit.mutateAsync(
													{
														Id: record.Id
													},
													{
														onSuccess: (res) => {
															toast.update(id, {
																render: 'Báo giá | báo cọc thành công!',
																autoClose: 0,
																isLoading: false,
																type: 'success'
															})
														}
													}
												)
											}
										})
									}}
									icon="fas fa-comment-alt-dollar"
									title="Yêu cầu báo cọc"
									btnRed
								/>
							)}
							{record?.Status === ECreatedOrderStatusData.Finished && (
								<ActionButton
									onClick={() =>
										router.push({
											pathname: '/user/report/detail',
											query: {
												id: record?.Id
											}
										})
									}
									icon="fas fa-balance-scale-right"
									title="Khiếu nại"
									btnRed
								/>
							)}
							{record?.Status === ECreatedOrderStatusData.Undeposited && (
								<ActionButton
									onClick={() => {
										type.current = 'deposit'
										handleModal([record], undefined, 'one')
									}}
									icon="far fa-dollar-sign"
									title="Đặt cọc"
									btnYellow
								/>
							)}
							{record?.Status === ECreatedOrderStatusData.ArrivedToVietNamWarehouse && (
								<ActionButton
									onClick={() => {
										type.current = 'payment'
										handleModal([record], undefined, 'one')
									}}
									icon="fas fa-credit-card"
									title="Thanh toán"
									btnBlue
								/>
							)}
							{record?.Status === ECreatedOrderStatusData.Undeposited && (
								<ActionButton
									onClick={() =>
										Modal.confirm({
											title: 'Xác nhận xóa đơn hàng?',
											onOk: () => handleDeleteProd(record?.Id)
										})
									}
									icon="fas fa-trash"
									title="Hủy đơn hàng!"
									btnYellow
								/>
							)}
						</Space>
					)
				}
			},
			responsive: ['xl'],
			width: 120,
			fixed: 'right'
		}
	]

	return (
		<DataTable
			{...{
				columns,
				data: itemOrderListQuery || [],
				bordered: true,
				// rowSelection,
				loading: isFetching,

				scroll: { y: 700 }
			}}
		/>
	)
}
