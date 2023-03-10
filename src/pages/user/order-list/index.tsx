import { Pagination } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { mainOrder } from '~/api'
import {
	ModalDelete,
	showToast,
	toast,
	UserAnotherOrderInfo,
	UserAnotherOrderListDrawer,
	UserAnotherOrderListFilter,
	UserAnotherOrderListTable,
	UserLayout
} from '~/components'
import { createdMoneyOfOrdersData, ECreatedOrderStatusData, orderStatus } from '~/configs/appConfigs'
import { SEOHomeConfigs } from '~/configs/SEOConfigs'
import { selectUser, useAppSelector } from '~/store'
import { TNextPageWithLayout } from '~/types/layout'
import { TDepositType, TModalType } from '~/types/table'

const Index: TNextPageWithLayout = () => {
	const { user } = useAppSelector(selectUser)
	const { query } = useRouter()
	const [items, setItems] = useState<TOrder[]>([])
	const type = useRef<'deposit' | 'payment'>('deposit')
	const queryClient = useQueryClient()

	const [filter, setFilter] = useState({
		TypeSearch: null,
		SearchContent: null,
		Status: null,
		FromDate: null,
		ToDate: null,
		PageIndex: 1,
		PageSize: 20,
		UID: user?.UserId,
		OrderType: query?.q === '3' ? 3 : 1,
		TotalItems: null
	})

	const [depositType, setDepositType] = useState<TDepositType>('one')
	const [modal, setModal] = useState(false)
	const [moneyOfOrders, setMoneyOfOrders] = useState(createdMoneyOfOrdersData)

	const handleFilter = (newFilter) => {
		setFilter({ ...filter, ...newFilter })
	}

	useEffect(() => {
		setFilter({
			TypeSearch: null,
			SearchContent: null,
			Status: null,
			FromDate: null,
			ToDate: null,
			PageIndex: 1,
			PageSize: 20,
			UID: user?.UserId,
			OrderType: query?.q === '3' ? 3 : 1,
			TotalItems: null
		})
		setMoneyOfOrders(createdMoneyOfOrdersData)
	}, [query?.q, user])

	const { data, isFetching, refetch } = useQuery(['orderList', filter], () => mainOrder.getList(filter).then((res) => res.Data), {
		onSuccess: (data) =>
			setFilter({
				...filter,
				TotalItems: data?.TotalItem,
				PageIndex: data?.PageIndex,
				PageSize: data?.PageSize
			}),
		onError: (error) => {
			showToast({
				title: '???? x???y ra l??i!',
				message: (error as any)?.response?.data?.ResultMessage,
				type: 'error'
			})
		},
		retry: true,
		enabled: !!user?.UserId
	})

	const mutationUpdateDeposit = useMutation(
		(data: TOrder[]) =>
			mainOrder.updateOrder(
				data?.map((item) => item.Id),
				{ Status: 2 }
			),
		{
			onSuccess: () => {
				setModal(false)
				queryClient.invalidateQueries('orderList')
				queryClient.invalidateQueries('clientData')
				queryClient.invalidateQueries({ queryKey: 'menuData' })
				toast.success('?????t c???c th??nh c??ng')
			},
			onError: (error) => {
				setModal(false)
				setItems([])
				showToast({
					title: '???? x???y ra l???i!',
					message: (error as any)?.response?.data?.ResultMessage,
					type: 'error'
				})
			}
		}
	)

	const mutationUpdatePayment = useMutation(
		(data: TOrder[]) =>
			mainOrder.updateOrder(
				data?.map((item) => item?.Id),
				{ Status: 7 }
			),
		{
			onSuccess: () => {
				setModal(false)
				queryClient.invalidateQueries('orderList')
				queryClient.invalidateQueries('clientData')
				queryClient.invalidateQueries({ queryKey: 'menuData' })
				toast.success('Thanh to??n th??nh c??ng')
			},
			onError: (error) => {
				setModal(false)
				showToast({
					title: (error as any)?.response?.data?.ResultCode,
					message: (error as any)?.response?.data?.ResultMessage,
					type: 'error'
				})
				setItems([])
			}
		}
	)

	const handleModal = (itemsSelected?: TOrder[], currentModalType?: TModalType, currentDepositType?: TDepositType) => {
		setItems(itemsSelected)
		setDepositType(currentDepositType)
		if (!!itemsSelected?.length) {
			setModal(true)
		} else {
			setModal(false)
		}
	}

	useQuery(
		['main-order-amount', { OrderType: query?.q === '3' ? 3 : 1 }],
		() =>
			mainOrder.getMainOrderAmount({
				orderType: query?.q === '3' ? 3 : 1
			}),
		{
			onSuccess: (res) => {
				const data = res.Data
				for (let key in data) {
					moneyOfOrders.forEach((item) => {
						if (item.key === key) {
							item.value = data[key]
						}
					})
				}
				setMoneyOfOrders(moneyOfOrders)
			},
			onError: (error) => {
				showToast({
					title: '???? x???y ra l??i!',
					message: (error as any)?.response?.data?.ResultMessage,
					type: 'error'
				})
			},
			enabled: !!user?.UserId
		}
	)

	useQuery(
		['number-of-order', { UID: user?.UserId, orderType: query?.q === '3' ? 3 : 1 }],
		() =>
			mainOrder.getNumberOfOrder({
				UID: user?.UserId,
				orderType: query?.q === '3' ? 3 : 1
			}),
		{
			onSuccess(res) {
				const data = res.Data
				data?.forEach((d) => {
					const target = orderStatus.find((x) => x?.id === d?.Status)
					if (target) {
						target.value = d?.Quantity
					}
				})
			},
			onError(error) {
				showToast({
					title: '???? x???y ra l??i!',
					message: (error as any)?.response?.data?.ResultMessage,
					type: 'error'
				})
			},
			enabled: !!user?.UserId
		}
	)

	return (
		<React.Fragment>
			<div className="titlePageUser">{query?.q === '3' ? 'Danh s??ch ????n mua h??? kh??c' : 'Danh s??ch ????n mua h???'}</div>
			<div className="tableBox py-2">
				<UserAnotherOrderInfo numberOfOrder={orderStatus} moneyOfOrders={moneyOfOrders} />
				<div className="">
					<UserAnotherOrderListFilter
						numberOfOrder={orderStatus}
						handleFilter={handleFilter}
						stateFilterStatus={filter.Status}
						// handleDepositAll={() => {
						// 	type.current = 'deposit'
						// 	handleModal(
						// 		data?.Items?.filter((item) => item.Status === ECreatedOrderStatusData.Undeposited),
						// 		undefined,
						// 		'all'
						// 	)
						// }}
						// handlePaymentAll={() => {
						// 	type.current = 'payment'
						// 	handleModal(
						// 		data?.Items?.filter((item) => item.Status === ECreatedOrderStatusData.ArrivedToVietNamWarehouse),
						// 		undefined,
						// 		'all'
						// 	)
						// }}
					/>
					<UserAnotherOrderListTable
						{...{
							data: data?.Items,
							loading: isFetching,
							selectedRowKeys: items.map((item) => item.Id),
							handleModal,
							type,
							q: query?.q
						}}
					/>
					<div className="mt-4 text-right">
						<Pagination
							total={filter?.TotalItems}
							current={filter?.PageIndex}
							pageSize={filter?.PageSize}
							onChange={(page, pageSize) => handleFilter({ ...filter, PageIndex: page, PageSize: pageSize })}
						/>
					</div>
				</div>
				<ModalDelete
					visible={modal && depositType !== 'some' && type.current === 'deposit'}
					onConfirm={() => {
						mutationUpdateDeposit.mutateAsync(items)
						handleModal([])
					}}
					onCancel={() => handleModal([])}
					title={
						depositType === 'some'
							? 'B???n c?? ch???c mu???n ?????t c???c nh???ng ????n ???? ch???n'
							: depositType === 'all'
							? 'B???n c?? ch???c mu???n ?????t c???c t???t c??? ????n'
							: `B???n c?? mu???n ?????t c???c ????n #${items?.[0]?.Id}`
					}
				/>
				<ModalDelete
					visible={modal && depositType !== 'some' && type.current === 'payment'}
					onConfirm={() => {
						mutationUpdatePayment.mutateAsync(items)
						handleModal([])
					}}
					onCancel={() => handleModal([])}
					title={
						depositType === 'some'
							? 'B???n c?? ch???c mu???n thanh to??n nh???ng ????n ???? ch???n'
							: depositType === 'all'
							? 'B???n c?? ch???c mu???n thanh to??n t???t c??? ????n'
							: `B???n c?? mu???n thanh to??n ????n #${items?.[0]?.Id}`
					}
				/>
			</div>
			<UserAnotherOrderListDrawer
				visible={modal && depositType === 'some'}
				data={items}
				onCancel={() => setModal(false)}
				handleDeposit={mutationUpdateDeposit.mutateAsync}
				handlePayment={mutationUpdatePayment.mutateAsync}
			/>
		</React.Fragment>
	)
}

Index.displayName = SEOHomeConfigs.buyGroceries.listOder
Index.Layout = UserLayout

export default Index
