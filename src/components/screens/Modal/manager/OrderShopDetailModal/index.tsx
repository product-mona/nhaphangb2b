import { CaretRightOutlined } from '@ant-design/icons'
import { Collapse, Modal } from 'antd'
import clsx from 'clsx'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { mainOrder } from '~/api'
import { OrderCost, OrderHistory, OrderProductList, OrderSurChargeList, OrderTransferCodeList } from '~/components/screens/order/order-list'
import { OrderCodeSecond } from '~/components/screens/order/order-list/detail/OrderCodeSecond'
import { showToast } from '~/components/toast'

type FCProps = {
	isOpen: boolean
	onClose: () => void
	orderShopId: number | null
	newUser?: TUser | null
	parentOrderID: number
}

const className = 'TabPanel py-4'
export const OrderShopDetailModal: FC<FCProps> = ({ orderShopId, isOpen, onClose, newUser, parentOrderID }) => {
	const queryClient = useQueryClient()
	//----------FORM----------//
	const form = useForm<TOrder>({})
	const watchFormState = form.watch()
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
				form.reset(data?.Data)
			},
			onError: () => {},
			enabled: !!orderShopId,
			refetchOnWindowFocus: false,
			keepPreviousData: true
		}
	)

	//----------MUTATION---------//
	const mutationUpdate = useMutation(mainOrder.update, {
		onSuccess: () => {
			toast.success('Cập nhật đơn hàng thành công')
			refetch()
			refetch()
			queryClient.invalidateQueries(['order-list', parentOrderID])
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
		// console.log(newData)
		mutationUpdate.mutateAsync(newData)
	}

	const onError = (err: any) => {
		console.log('err', err)
	}
	const renderView = () => {
		if (!!OrderShopDetailQuery?.Data && !!isOpen) {
			return (
				<div>
					<div className="p-4">
						<Collapse
							expandIconPosition="right"
							expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
							defaultActiveKey={['shop1', 'shop2']}
						>
							<Collapse.Panel header={`Mã đơn hàng (${OrderShopDetailQuery?.Data?.MainOrderCodes?.length || 0})`} key="shop1">
								<div id="order-code" className={clsx(className, 'px-4')}>
									<OrderCodeSecond data={OrderShopDetailQuery?.Data} RoleID={newUser?.UserGroupId} />
								</div>
							</Collapse.Panel>

							<Collapse.Panel header={`Mã vận đơn (${OrderShopDetailQuery?.Data?.SmallPackages.length || 0})`} key="shop2">
								<div id="transfer-code-list" className={clsx(className, '!p-2 !py-0')}>
									<OrderTransferCodeList
										data={OrderShopDetailQuery?.Data}
										loading={isFetching}
										handleUpdate={_onUpdate}
										RoleID={newUser?.UserGroupId}
									/>
								</div>
							</Collapse.Panel>
							<Collapse.Panel header={`Danh sách sản phẩm (${OrderShopDetailQuery?.Data?.Orders?.length || 0})`} key="shop3">
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
			className="Manager-OrderShopDetailModal"
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
			cancelText="Đóng"
			cancelButtonProps={{
				className: 'px-[16px] rounded bg-transparent text-[#626262]',
				size: 'large'
			}}
			okText="Cập nhật"
			okButtonProps={{
				size: 'large',
				title: 'Cập nhật chi tiết đơn hàng của shop này'
			}}
			onOk={form.handleSubmit(_onUpdate, onError)}
		>
			<FormProvider {...form}>
				<div>{renderView()}</div>
			</FormProvider>
		</Modal>
	)
}
