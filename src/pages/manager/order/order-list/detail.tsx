import { CaretRightOutlined } from '@ant-design/icons'
import { Collapse, Modal, Spin } from 'antd'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { mainOrder } from '~/api'
import {
	Empty,
	Layout,
	MessageControlManager,
	OrderCode,
	OrderCost,
	OrderDetail,
	OrderHandlingStaff,
	OrderHistory,
	OrderInfo,
	OrderProductList,
	OrderShopList,
	OrderSurChargeList,
	OrderTransferCodeList,
	showToast,
	toast
} from '~/components'
import { OrderShopDetailModal } from '~/components/screens/Modal'
import { breadcrumb } from '~/configs'
import { SEOConfigs } from '~/configs/SEOConfigs'
import { useCatalogue } from '~/hooks'
import { useDisclosure } from '~/modules/core/hooks'
import { selectConnection, useAppSelector } from '~/store'
import { TNextPageWithLayout } from '~/types/layout'

const className = 'TabPanel py-4'
const { Panel } = Collapse

const Index: TNextPageWithLayout = () => {
	const router = useRouter()
	const { current: newUser } = useAppSelector((state) => state.user)
	if (!newUser) return null

	const { query } = useRouter()
	const orderId = Number(router.query.id)

	const [active, setActive] = React.useState(0)

	const connection = useAppSelector(selectConnection)
	const connectionId = connection?.connectionId

	const { userSale, userOrder } = useCatalogue({
		userSaleEnabled: !!newUser,
		userOrderEnabled: !!newUser
	})

	const form = useForm<TOrder>({
		mode: 'onBlur'
	})

	// useEffect(() => {
	// 	if (!connectionId) return
	// 	console.log('connection', connection)
	// 	// let timeout = null
	// 	connection.on('change', (mainOrders: TOrder[]) => {
	// 		if (!!mainOrders?.length) {
	// 			const item = mainOrders.some((order) => {
	// 				return order.Id === +query?.id
	// 			})
	// 			if (item) {
	// 				form.reset(mainOrder[0])
	// 			}
	// 		}
	// 	})
	// 	// return () => clearTimeout(timeout)
	// }, [connectionId])

	const { data, isError, isLoading, isFetching, refetch } = useQuery(
		['order-list', orderId],
		() => {
			if (orderId) {
				return mainOrder.getByID(orderId)
			} else return undefined
		},
		{
			onSuccess: (data) => {
				if (!data?.Data?.IsCheckNotiPrice && data?.Data?.OrderType === 3) toast.warning('Đơn hàng chưa cập nhật báo giá cho khách!')
				form.reset(data?.Data)
			},
			retry: false,
			enabled: !!orderId,
			keepPreviousData: true
			// enabled: false,
			// refetchOnMount: "always",
		}
	)

	const mutationUpdate = useMutation(mainOrder.update, {
		onSuccess: () => {
			toast.success('Cập nhật đơn hàng thành công')
			refetch()
		},
		onError: (error) => {
			showToast({
				title: 'Đã xảy ra lỗi',
				message: (error as any)?.response?.data?.ResultMessage,
				type: 'error'
			})
		}
	})
	// ham update chi tiết đơn hàng
	const _onUpdate = async (data: TOrder) => {
		const { HistoryOrderChanges, PayOrderHistories, Complains, ...newData } = data
		localStorage.removeItem('AmountDeposit')
		await mutationUpdate.mutateAsync(newData)
	}

	const onViewDetailShopOrder = (newId: number) => {
		//click to see detail
		router.push({
			pathname: '/manager/order/order-list/shopOrderDetail',
			query: {
				id: orderId,
				shopOrderId: newId
			}
		})
	}

	// if (isError) {
	// 	return <Empty description={`Không tìm thấy đơn hàng #${query?.id}`} />
	// }
	const renderShippingCode = () => {
		if (data?.Data) {
			if (data?.Data.OrderType == 3) {
				return (
					<React.Fragment>
						<Panel header={`Mã đơn hàng (${data?.Data?.MainOrderCodes?.length || 0})`} key="1">
							<div id="order-code" className={clsx(className, active === 0 && '', 'px-4')}>
								<OrderCode data={data?.Data} loading={isFetching} refetch={refetch} RoleID={newUser?.UserGroupId} />
							</div>
						</Panel>
						<Panel header={`Mã vận đơn (${data?.Data?.SmallPackages.length || 0})`} key="2">
							<div id="transfer-code-list" className={clsx(className, '!p-2 !py-0', active === 1 && '')}>
								<OrderTransferCodeList
									data={data?.Data}
									loading={isFetching}
									handleUpdate={_onUpdate}
									RoleID={newUser?.UserGroupId}
								/>
							</div>
						</Panel>
					</React.Fragment>
				)
			} else {
				return null
			}
		}
	}
	const renderShopOrProductList = () => {
		if (!!data?.Data) {
			if (data?.Data.OrderType == 3) {
				return (
					<Panel header={`Danh sách sản phẩm (${data?.Data?.Orders?.length || 0})`} key="3">
						<div id="product-list" className={clsx(className, active === 2 && '', '!px-2 !py-0')}>
							<OrderProductList
								dataOrderShop={data?.Data}
								// loading={isFetching}
								// refetch={refetch}
								RoleID={newUser?.UserGroupId}
							/>
						</div>
					</Panel>
				)
			} else {
				return (
					<Panel header={`Danh sách cửa hàng (${data?.Data?.SubMainOrders?.length || 0})`} key="3">
						<div id="product-list" className={clsx(className, active === 2 && '', '!px-2 !py-0')}>
							<OrderShopList
								onViewShopOrderDetail={onViewDetailShopOrder} //  view Detail
								data={data?.Data}
								refetch={refetch}
								RoleID={newUser?.UserGroupId}
							/>
						</div>
					</Panel>
				)
			}
		}
	}
	const renderFee = () => {
		if (!!data?.Data) {
			return (
				<Panel header="Chi phí đơn hàng" key="4">
					<div id="surcharge-list" className={clsx(className, 'p-2 !pt-0', active === 3 && '')}>
						{data?.Data.OrderType !== 4 ? (
							<OrderSurChargeList
								data={data?.Data}
								loading={isFetching}
								handleUpdate={_onUpdate}
								RoleID={newUser?.UserGroupId}
							/>
						) : null}
						<OrderCost data={data?.Data} RoleID={newUser?.UserGroupId} />
					</div>
				</Panel>
			)
		} else return null
	}
	return (
		<div>
			<Spin spinning={isFetching}>
				<FormProvider {...form}>
					<div className="xl:grid xl:grid-cols-10 gap-4 h-full w-full">
						<div className="xl:col-span-2">
							<div
								style={{
									position: 'sticky',
									top: '80px'
								}}
							>
								<OrderDetail
									active={active}
									handleActive={(val) => setActive(val)}
									handleUpdate={_onUpdate}
									data={data?.Data}
									loading={isFetching}
									refetch={refetch}
									RoleID={newUser?.UserGroupId}
								/>
							</div>
						</div>
						<div className="col-span-8 tableBoxPag !h-fit !pb-0 xl:ml-6">
							<Collapse
								expandIconPosition="right"
								expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
								defaultActiveKey={['1', '2', '3', '4', '5', '6', '7']}
							>
								{renderShippingCode()}
								{renderShopOrProductList()}
								{renderFee()}
								{!!data?.Data ? (
									<>
										<Panel header="Nhân viên xử lý" key="5">
											<div id="handling-staff" className={clsx(className, active === 5 && '', 'px-4 !pt-0')}>
												<OrderHandlingStaff
													data={data?.Data}
													userSaleCatalogue={userSale}
													userOrderCatalogue={userOrder}
													loading={isFetching}
													RoleID={newUser?.UserGroupId}
												/>
											</div>
										</Panel>
										<Panel header="Thông tin đặt hàng" key="6">
											<div id="order-info" className={clsx(className, active === 6 && '')}>
												<OrderInfo data={data?.Data} loading={isLoading} />
											</div>
										</Panel>
										<Panel header="Lịch sử" key="7">
											<div id="history" className={clsx(className, active === 7 && '')}>
												<OrderHistory data={data?.Data} loading={isFetching} />
											</div>
										</Panel>
									</>
								) : null}
							</Collapse>
						</div>
					</div>
				</FormProvider>
				{data && <MessageControlManager clientId={data.Data.UID} mainOrderId={+query?.id} />}
			</Spin>
			<div>
				{/* <OrderShopDetailModal
					newUser={newUser}
					orderShopId={orderShopId}
					isOpen={detailController.isOpen}
					onClose={detailController.onClose}
					parentOrderID={orderId}
				/> */}
			</div>
		</div>
	)
}

Index.displayName = SEOConfigs.oder.detail
Index.breadcrumb = breadcrumb.order.orderList.detail
Index.Layout = Layout

export default Index
