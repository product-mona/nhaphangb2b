import { DataTable } from '~/components/globals/table'
import { Modal, Space, Tag, Tooltip } from 'antd'
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
import Link from 'next/link'

export const NestedTableUserItemOrder: FC<any> = ({ handleModal, type, q, GroupMainOrderID, expandItemId }) => {
	const {
		data: itemOrderListQuery,
		isFetching,
		refetch
	} = useQuery(
		['ItemOrderListQuery', GroupMainOrderID],
		() => mainOrder.getSubGroupOrder({ id: GroupMainOrderID, PageSize: 1000 }).then((res) => res.Data),
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
			enabled: !!expandItemId && expandItemId == GroupMainOrderID,
			refetchOnWindowFocus: true
		}
	)
	const [delLoading, setDelLoading] = useState(false)
	const queryClient = useQueryClient()

	const handleDeleteProd = async (id: number) => {
		alert('bạn vừa click xóa đơn cửa hàng này')
		// try {
		// 	await mainOrder.delete(id)
		// 	showToast({
		// 		title: 'Hủy thành công!',
		// 		message: `Hủy đơn hàng #${id} thành công!`,
		// 		type: 'success'
		// 	})
		// 	queryClient.invalidateQueries('orderList')
		// 	setDelLoading(false)
		// } catch (error) {
		// 	showToast({
		// 		title: (error as any)?.response?.data?.ResultCode,
		// 		message: (error as any)?.response?.data?.ResultMessage,
		// 		type: 'error'
		// 	})
		// 	setDelLoading(false)
		// }
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
			title: 'ID đơn',
			width: 80
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
			},
			width: 120
		},
		{
			dataIndex: 'TotalPriceVND',
			title: 'Tổng tiền hàng',
			align: 'right',
			responsive: ['md'],
			render: (price) => _format.getVND(price, ' '),
			width: 150
		},

		{
			dataIndex: 'Status',
			title: 'Trạng thái',
			render: (status, record) => {
				const color = orderStatus.find((x) => x.id === status)
				return <Tag color={color?.color}>{record?.StatusName}</Tag>
			}
			// width: 140,
		},

		{
			dataIndex: 'action',
			title: 'Thao tác',
			align: 'right',
			render: (_, record) => {
				return (
					<Space
						style={{
							pointerEvents: delLoading ? 'none' : 'all',
							opacity: delLoading ? '0.8' : '1'
						}}
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
													autoClose: 1000,
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
								pathname: '/user/order-list/detailShopOrder',
								query: {
									id: record?.Id
								}
							}}
							passHref
						>
							<a rel="noopener noreferrer">
								<ActionButton onClick={() => {}} icon="far fa-info-square" title="Xem chi tiết shop này" />
							</a>
						</Link>
					</Space>
				)
			}
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
