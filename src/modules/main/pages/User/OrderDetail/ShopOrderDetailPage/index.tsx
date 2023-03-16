import router, { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { mainOrder } from '~/api'
import {
	MessageControlUser,
	OrderIDDetail,
	OrderIDPaymentHistory,
	OrderIDProductList,
	OrderOverView,
	UserLayout,
	OrderIDShopList,
	ShopOrderOverView,
	ShopOrderGeneralInfo,
	SecondOrderIDProductList
} from '~/components'
import { SEOConfigs } from '~/configs/SEOConfigs'
import { TNextPageWithLayout } from '~/types/layout'

export const ShopOrderDetailPage: TNextPageWithLayout = () => {
	const { id } = router.query
	const { query } = useRouter()
	// const router = useRouter()
	const { data, isError, isLoading, refetch } = useQuery(['orderList', +query?.id], () => mainOrder.getByID(+query?.id), {
		onSuccess: (data) => {
			console.log('onSuccess', data?.Data?.OrderType)
			if (data?.Data?.OrderType !== 1) {
				router.push('/user/order-list')
			}
		},

		onError: toast.error,
		retry: false,
		enabled: !!+query?.id
	})

	const updatePaid = (type: 'deposit' | 'payment') => {
		const id = toast.loading('Đang xử lý ...')
		mainOrder
			.updateOrder([data?.Data?.Id], {
				Status: type === 'deposit' ? 2 : 7
			})
			.then((res) => {
				toast.update(id, {
					render: type === 'deposit' ? 'Đặt cọc thành công!' : 'Thanh toán thành công!',
					isLoading: false,
					type: 'success',
					autoClose: 1000
				})
				refetch()
			})
			.catch((error) => {
				toast.update(id, {
					render: (error as any)?.response?.data?.ResultMessage,
					isLoading: false,
					type: 'success',
					autoClose: 1000
				})
			})
	}

	return (
		<React.Fragment>
			<div className="titlePageUser">Chi tiết đơn hàng của shop #{id}</div>
			<div className="mb-4 ">
				<div className="sm:grid sm:grid-cols-2 gap-4">
					<div className="col-span-1">
						<ShopOrderOverView data={data?.Data} updatePaid={updatePaid} />
					</div>
					<div className="col-span-1">
						<ShopOrderGeneralInfo data2={data?.Data?.Orders} dataAll={data?.Data} data={data?.Data?.FeeSupports} />
					</div>
				</div>
				{/* <OrderTransportList data={data?.Data?.SmallPackages} /> */}
				<div className="my-4">
					<SecondOrderIDProductList data={data?.Data?.Orders} dataOrder={data?.Data} />
				</div>
				{/* <OrderIDProductList data={data?.Data?.Orders} /> */}
				{/* danh sách shop*/}
				{/* <OrderIDShopList dataOrder={data?.Data} orderShopList={data?.Data?.OrderShops || []} /> */}
				{/* <OrderIDPaymentHistory data={data?.Data?.PayOrderHistories} /> */}
				{data && <MessageControlUser clientId={data.Data.UID} mainOrderId={+query?.id} />}
			</div>
		</React.Fragment>
	)
}

ShopOrderDetailPage.displayName = 'Chi tiết đơn cửa hàng'
ShopOrderDetailPage.Layout = UserLayout
