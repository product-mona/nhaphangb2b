import { Modal, Space, Tag, Typography } from 'antd'
import { TableRowSelection } from 'antd/lib/table/interface'
import router from 'next/router'
import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { mainOrder, orderShopTemp } from '~/api'
import { ActionButton, DataTable, showToast } from '~/components'
import { createdOrderStatusData, ECreatedOrderStatusData, orderStatus } from '~/configs/appConfigs'
import { TColumnsType, TTable } from '~/types/table'
import { NestedTableUserItemOrder } from './NestedTable'
import { toastApiErr, _format } from '~/utils'
import Link from 'next/link'

export const UserAnotherOrderListTable: React.FC<TTable<TOrder> & { type; q }> = ({
	data,

	loading,
	handleModal,
	type,
	q
}) => {
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
			title: 'Công nợ đơn hàng',
			// width: 150,
			align: 'right',
			responsive: ['lg'],
			render: (deposit, record) => _format.getVND(record.TotalPriceVND - record.Deposit, ' ')
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
							<Link
								href={{
									pathname: '/user/order-list/detail',
									query: {
										id: record?.Id
									}
								}}
								passHref
							>
								<a rel="noopener noreferrer">
									<ActionButton onClick={() => {}} icon="far fa-info-square" title="Xem chi tiết đơn" />
								</a>
							</Link>

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
							<Link
								href={{
									pathname: '/user/order-list/detail',
									query: {
										id: record?.Id
									}
								}}
								passHref
							>
								<a rel="noopener noreferrer">
									<ActionButton icon="far fa-info-square" title="Xem chi tiết đơn" />
								</a>
							</Link>
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

	const expandable = {
		expandedRowRender: (record) => (
			<div
				style={{
					background: 'linear-gradient(90deg, #b53aa5 15%, #d06cc3 60%)'
				}}
				className=" p-4"
			>
				<div className="mb-4 text-white">
					<p
						style={{
							fontSize: '16px',
							fontWeight: 600
						}}
					>
						Chi tiết danh sách cửa hàng
					</p>
				</div>
				<NestedTableUserItemOrder
					handleModal={handleModal}
					type={type}
					q={q}
					GroupMainOrderID={record.Id}
					expandItemId={record.Id}
				/>
			</div>
		)
	}

	return (
		<DataTable
			{...{
				columns,
				data,
				bordered: true,
				loading,
				expandOnlyOne: true,
				expandable: expandable,
				isExpand: true,
				scroll: { y: 700 }
			}}
			tableId={'secondTable'}
		/>
	)
}
