import { CaretRightOutlined } from '@ant-design/icons'
import { Breadcrumb, Collapse, Spin } from 'antd'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { mainOrder } from '~/api'
import {
	Layout,
	MessageControlManager,
	OrderCost,
	OrderDetail,
	OrderHistory,
	OrderProductList,
	OrderSurChargeList,
	OrderTransferCodeList,
	showToast,
	toast
} from '~/components'
import { MyBreadcrumb } from '~/components/others'
import { OrderCodeSecond } from '~/components/screens/order/order-list/detail/OrderCodeSecond'
import { useAppSelector } from '~/store'
import { TNextPageWithLayout } from '~/types/layout'

const className = 'TabPanel py-4'
const { Panel } = Collapse

const ShopOrderDetail: TNextPageWithLayout = () => {
	const router = useRouter()
	const { current: newUser } = useAppSelector((state) => state.user)
	if (!newUser) return null

	const orderId = Number(router.query.id)
	const shopOrderId = Number(router.query.shopOrderId)

	const [active, setActive] = React.useState(0)

	const form = useForm<TOrder>({
		mode: 'onBlur'
	})

	const {
		data: OrderShopDetailQuery,
		isError,
		isLoading,
		isFetching,
		refetch
	} = useQuery(
		['order-list', shopOrderId],
		() => {
			if (shopOrderId) {
				return mainOrder.getByID(shopOrderId)
			} else return undefined
		},
		{
			onSuccess: (data) => {
				form.reset(data?.Data)
			},
			retry: false,
			enabled: !!shopOrderId,
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
	}

	return (
		<div>
			<MyBreadcrumb
				onBack={() => {
					router.push({
						pathname: '/manager/order/order-list/detail',
						query: {
							id: orderId
						}
					})
				}}
				title="Chi tiết đơn nhỏ"
				subTitle={
					<>
						<Breadcrumb>
							<Breadcrumb.Item>
								<a href={`/manager/order/order-list${OrderShopDetailQuery?.Data.OrderType === 3 ? '?q=3' : ''}`}>
									Danh sách đơn hàng
								</a>
							</Breadcrumb.Item>
							<Breadcrumb.Item>
								<Link
									href={{
										pathname: '/manager/order/order-list/detail',
										query: {
											id: orderId
										}
									}}
									passHref
								>
									<a rel="noopener noreferrer">Đơn hàng {orderId}</a>
								</Link>
							</Breadcrumb.Item>
							<Breadcrumb.Item>{OrderShopDetailQuery?.Data.MainOrderCustomID}</Breadcrumb.Item>
						</Breadcrumb>
					</>
				}
			/>
			<Spin spinning={isFetching}>
				<FormProvider {...form}>
					<div className="xl:grid xl:grid-cols-10 gap-1 h-full w-full">
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
									data={OrderShopDetailQuery?.Data}
									loading={isFetching}
									refetch={refetch}
									RoleID={newUser?.UserGroupId}
									isShopOrder
								/>
							</div>
						</div>
						<div className="col-span-8 tableBoxPag !h-fit !pb-0 xl:ml-6">
							<Collapse
								expandIconPosition="right"
								expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
								defaultActiveKey={['1', '2', '3', '4', '5', '6', '7']}
							>
								<Collapse.Panel
									header={`Mã đơn hàng (${OrderShopDetailQuery?.Data?.MainOrderCodes?.length || 0})`}
									key="shop1"
								>
									<div id="order-code" className={clsx(className, 'px-4')}>
										<OrderCodeSecond data={OrderShopDetailQuery?.Data} RoleID={newUser?.UserGroupId} />
									</div>
								</Collapse.Panel>

								<Collapse.Panel
									header={`Mã vận đơn (${OrderShopDetailQuery?.Data?.SmallPackages.length || 0})`}
									key="shop2"
								>
									<div id="transfer-code-list" className={clsx(className, '!p-2 !py-0')}>
										<OrderTransferCodeList
											data={OrderShopDetailQuery?.Data}
											loading={isFetching}
											handleUpdate={_onUpdate}
											RoleID={newUser?.UserGroupId}
										/>
									</div>
								</Collapse.Panel>
								<Collapse.Panel
									header={`Danh sách sản phẩm (${OrderShopDetailQuery?.Data?.Orders?.length || 0})`}
									key="shop3"
								>
									<div id="product-list" className={clsx(className, '!px-2 !py-0')}>
										<OrderProductList
											dataOrderShop={OrderShopDetailQuery?.Data}
											// loading={isFetching}
											refetch={refetch}
											RoleID={newUser?.UserGroupId}
										/>
									</div>
								</Collapse.Panel>

								<Collapse.Panel header="Chi phí đơn hàng" key="4">
									<div id="surcharge-list" className={clsx(className, 'p-2 !pt-0')}>
										<OrderSurChargeList
											data={OrderShopDetailQuery?.Data}
											loading={isFetching}
											handleUpdate={_onUpdate}
											RoleID={newUser?.UserGroupId}
										/>
										<OrderCost data={OrderShopDetailQuery?.Data} RoleID={newUser?.UserGroupId} />
									</div>
								</Collapse.Panel>

								<Collapse.Panel header="Lịch sử thay đổi" key="7">
									<div id="history" className={clsx(className)}>
										<OrderHistory data={OrderShopDetailQuery?.Data} loading={isFetching} />
									</div>
								</Collapse.Panel>
							</Collapse>
						</div>
					</div>
				</FormProvider>
				{OrderShopDetailQuery && <MessageControlManager clientId={OrderShopDetailQuery.Data.UID} mainOrderId={+shopOrderId} />}
			</Spin>
		</div>
	)
}
ShopOrderDetail.displayName = 'Chi tiết đơn cửa hàng'

ShopOrderDetail.Layout = Layout

export default ShopOrderDetail
