import { Collapse, Modal } from 'antd'
import { CaretRightOutlined } from '@ant-design/icons'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { FC, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { mainOrder } from '~/api'
import { OrderCode, OrderCost, OrderProductList, OrderSurChargeList, OrderTransferCodeList } from '~/components/screens/order/order-list'
import clsx from 'clsx'
import { useAppSelector } from '~/store'
import { toast } from 'react-toastify'
import { showToast } from '~/components/toast'
import { OrderCodeSecond } from '~/components/screens/order/order-list/detail/OrderCodeSecond'

type FCProps = {
	isOpen: boolean
	onClose: () => void
	orderShopId: number | null
	newUser?: TUser | null
}
const className = 'TabPanel py-4'
export const OrderShopDetailModal: FC<FCProps> = ({ orderShopId, isOpen, onClose, newUser }) => {
	//----------FORM----------//
	const form = useForm<TOrder>({})

	//----------QUERY---------//
	const {
		data: OrderShopDetailQuery,
		isError,
		isLoading,
		isFetching,
		refetch
	} = useQuery(
		['OrderShopDetailModal', orderShopId],
		() => {
			if (!!orderShopId) {
				return mainOrder.getByID(orderShopId)
			} else return undefined
		},
		{
			onSuccess: (data) => {
				console.log('OrderShopDetailModal', orderShopId, data)
				form.reset(data?.Data)
			},
			onError: () => {},
			enabled: !!orderShopId
			// refetchOnMount: "always",
		}
	)

	//----------MUTATION---------//
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
	const _onUpdate = (data: TOrder) => {
		const { HistoryOrderChanges, PayOrderHistories, Complains, ...newData } = data
		// await mutationUpdate.mutateAsync(newData)
		console.log(data)
	}

	const renderView = () => {
		if (!!OrderShopDetailQuery?.Data && !!isOpen) {
			return (
				<div>
					<FormProvider {...form}>
						<div className="p-4">
							<Collapse
								expandIconPosition="right"
								expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
								defaultActiveKey={['shop1', 'shop2', 'shop3', 'shop4', 'shop5', 'shop6', 'shop7']}
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
											// refetch={refetch}
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
										<OrderCost loading={isFetching} data={OrderShopDetailQuery?.Data} RoleID={newUser?.UserGroupId} />
									</div>
								</Collapse.Panel>

								{/* <Collapse.Panel header="Lịch sử" key="7">
									<div id="history" className={clsx(className, active === 7 && '')}>
										<OrderHistory data={data?.Data} loading={isFetching} />
									</div>
								</Collapse.Panel> */}
							</Collapse>
						</div>
					</FormProvider>
				</div>
			)
		} else {
			return <></>
		}
	}
	return (
		<Modal
			style={{
				maxWidth: 1200
			}}
			width="100%"
			title={
				<>
					Chi tiết đơn hàng của Shop ID
					<span className="text-mainDark font-[600]"> {OrderShopDetailQuery?.Data.MainOrderCustomID}</span>
				</>
			}
			onCancel={onClose}
			maskClosable={false}
			visible={isOpen}
		>
			<div>{renderView()}</div>
		</Modal>
	)
}
