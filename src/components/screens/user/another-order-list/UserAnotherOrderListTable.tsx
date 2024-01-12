import { Modal, Space, Tag } from 'antd'
import Link from 'next/link'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { mainOrder } from '~/api'
import { ActionButton, DataTable, FilterInput, showToast } from '~/components'
import { ECreatedOrderStatusData, orderStatus } from '~/configs/appConfigs'
import { TColumnsType, TTable } from '~/types/table'
import { _format, toastApiErr } from '~/utils'
import { NestedTableUserItemOrder } from './NestedTable'

export const UserAnotherOrderListTable: React.FC<TTable<TOrder> & { type; q }> = ({ data, loading, handleModal, type, q }) => {
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

	const [expandedRowKeys, setExpandedRowKeys] = useState(data?.map((item) => item.Id) || [])

	useEffect(() => {
		setExpandedRowKeys(data?.map((item) => item.Id))
	}, [data])

	const handleExpand = (expanded, record) => {
		const newExpandedRowKeys = expanded ? [...expandedRowKeys, record.Id] : expandedRowKeys.filter((key) => key !== record.Id)
		setExpandedRowKeys(newExpandedRowKeys)
	}

	const mutationUpdateNote = useMutation({
		mutationKey: ['update-note-order'],
		mutationFn: async (data: { Id: number; Note: string }) => await mainOrder.updateNote(data),
		onSuccess: () => {
			toast.success('Cập nhật ghi chú thành công!')
		},
		onError: () => {
			toast.error('Cập nhật ghi chú thất bại')
		}
	})

	const handleUpdateNote = async (data: { Id: number; Note: string }) => {
		await mutationUpdateNote.mutateAsync(data)
	}

	const columns: TColumnsType<TOrder> = [
		{
			key: 'MainOrderCustomID',
			dataIndex: 'MainOrderCustomID',
			title: 'ID đơn',
			width: 200
		},
		{
			key: 'Note',
			dataIndex: 'Note',
			title: 'Ghi chú',
			width: 200,
			render: (value, record) => {
				const [val, setVal] = useState(value)
				return (
					<FilterInput
						name={'Note'}
						id={'Note'}
						placeholder={'Ghi chú đơn'}
						value={val}
						iconSearch='fas fa-check text-blue'
						handleSubmit={() =>
							handleUpdateNote({
								Id: record?.Id,
								Note: val
							})
						}
						handleSearch={(val) => setVal(val)}
					/>
				)
			}
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
			title: 'Tổng tiền đã thanh toán',
			align: 'right',
			width: 200,
			responsive: ['lg'],
			render: (price) => _format.getVND(price, ' ')
		},
		{
			dataIndex: 'Id',
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
			width: 140,
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
				className="p-1"
			>
				<div className="p-2">
					<p
						style={{
							fontSize: '14px',
							fontWeight: 600
						}}
						className="text-white uppercase"
					>
						** Chi tiết danh sách cửa hàng
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
		),
		expandedRowKeys: expandedRowKeys,
		onExpand: handleExpand
	}

	return (
		<DataTable
			{...{
				columns,
				data,
				bordered: true,
				loading,
				// expandOnlyOne: Number(q) === 3 ? false : true,
				expandable: expandable,
				isExpand: Number(q) === 3 ? false : true
				// scroll: { y: 700 }
			}}
			tableId={'secondTable'}
		/>
	)
}
