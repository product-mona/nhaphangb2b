import { TablePaginationConfig } from 'antd'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { mainOrder, payHelp, transportationOrder } from '~/api'
import { showToast, UserAnotherOrder, UserLayout, UserOrder, UserPayment, UserStatistic, UserTransfer } from '~/components'
import { defaultPagination } from '~/configs'
import { SEOHomeConfigs } from '~/configs/SEOConfigs'
import { selectUser, useAppSelector } from '~/store'
import { TNextPageWithLayout } from '~/types/layout'

const title = 'titlePageUser'
const boxItem = 'lg:col-span-2 col-span-2 mb-4'

const dataBoxItem = [
	{
		key: 'mainOrderTotal',
		label: 'Đơn hàng trọn gói',
		path: '/user/order-list',
		icon: 'fad fa-shopping-basket',
		color: '#2A8BD5',
		value: null
	},
	{
		key: 'mainOrderOtherTotal',
		label: 'Đơn hàng dịch vụ',
		path: '/user/order-list?q=3',
		icon: 'fad fa-shopping-basket',
		color: '#27A689',
		value: null
	}
	// {
	//   key: "transportTotal",
	//   label: "Ký gửi",
	//   path: "/user/deposit-list",
	//   icon: "fad fa-dolly",
	//   color: "#F1A934",
	//   value: null,
	// },
	// {
	//   key: "paymentTotal",
	//   label: "Thanh toán hộ",
	//   path: "/user/request-list",
	//   icon: "fad fa-credit-card",
	//   color: "#E54C36",
	//   value: null,
	// },
]

const Index: TNextPageWithLayout = () => {
	const { user } = useAppSelector(selectUser)
	const [pagination, setPagination] = useState<TablePaginationConfig>(defaultPagination)
	const [total, setTotal] = useState(dataBoxItem)

	const {
		data: orderData,
		isFetching: isFetchingOrder,
		isLoading: isLoadingOrder
	} = useQuery(
		[
			'userOrderListMainOrder',
			{
				PageIndex: 1,
				PageSize: 10,
				OrderBy: 'Created desc',
				UID: user?.UserId,
				OrderType: 4
			}
		],
		() =>
			mainOrder
				.getList({
					PageIndex: 1,
					PageSize: 10,
					OrderBy: 'Created desc',
					UID: user?.UserId,
					OrderType: 4
				})
				.then((res) => {
					dataBoxItem[0].value = res.Data.TotalItem
					return res.Data
				}),
		{
			onError: (error) => {
				showToast({
					// title: (error as any)?.response?.data?.ResultCode,
					title: 'Đã xảy ra lỗi!',
					message: (error as any)?.response?.data?.ResultMessage,
					type: 'error'
				})
			},
			enabled: !!user
		}
	)

	const {
		data: otherOrderData,
		isFetching: isFetchingOtherOrder,
		isLoading: isLoadingOtherOrder
	} = useQuery(
		[
			'userOrderOtherList',
			{
				PageIndex: 1,
				PageSize: 10,
				OrderBy: 'Created desc',
				OrderType: 3,
				UID: user?.UserId
			}
		],
		() =>
			mainOrder
				.getList({
					PageIndex: 1,
					PageSize: 10,
					OrderBy: 'Created desc',
					UID: user?.UserId,
					OrderType: 3
				})
				.then((res) => {
					dataBoxItem[1].value = res.Data.TotalItem
					return res.Data
				}),
		{
			onError: (error) => {
				showToast({
					// title: (error as any)?.response?.data?.ResultCode,
					title: 'Đã xảy ra lỗi!',
					message: (error as any)?.response?.data?.ResultMessage,
					type: 'error'
				})
			},
			enabled: !!user
		}
	)

	useEffect(() => {
		setTotal(dataBoxItem)
	}, [orderData, otherOrderData])

	return (
		<React.Fragment>
			<div className={title}>Dashboard</div>
			<div className="xl:flex w-12/12 gap-2 pb-4 flex-col">
				<div className={clsx(boxItem, 'py-0 w-full order-1 mb-[7px]')}>
					<UserStatistic total={total} />
				</div>
				<div className="w-full grid grid-cols-1 xl:mr-2 order-2">
					<div className={`${boxItem}`}>
						<UserOrder
							{...{
								data: orderData,
								isLoading: isLoadingOrder,
								isFetching: isFetchingOrder,
								pagination: pagination
							}}
						/>
					</div>
					<div className={boxItem}>
						<UserAnotherOrder
							{...{
								data: otherOrderData,
								isFetching: isFetchingOtherOrder,
								isLoading: isLoadingOtherOrder,
								pagination: pagination
							}}
						/>
					</div>
					{/* <div className={boxItem}>
            <UserTransfer
              {...{
                data: transportData,
                isFetching: isFetchingTransport,
                isLoading: isLoadingTransport,
                pagination: pagination,
              }}
            />
          </div>
          <div className={boxItem}>
            <UserPayment
              {...{
                data: paymentData,
                isLoading: isLoadingPayment,
                isFetching: isFetchingPayment,
                pagination: pagination,
              }}
            />
          </div> */}
				</div>
			</div>
		</React.Fragment>
	)
}
Index.displayName = SEOHomeConfigs.dashboard
Index.Layout = UserLayout

export default Index
