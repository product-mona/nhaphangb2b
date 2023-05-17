import router, { useRouter } from 'next/router'
import React from 'react'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { mainOrder } from '~/api'
import { MessageControlUser, SecondOrderIDProductList, ShopOrderGeneralInfo, ShopOrderOverView, UserLayout } from '~/components'
import { TNextPageWithLayout } from '~/types/layout'

export const ShopOrderDetailPage: TNextPageWithLayout = () => {
	const { id } = router.query
	const { query } = useRouter()

	const { data, isError, isLoading, refetch } = useQuery(['orderList', +query?.id], () => mainOrder.getByID(+query?.id), {
		onSuccess: (data) => {
			if (data?.Data?.OrderType !== 1) {
				router.push('/user/order-list')
			}
		},

		onError: toast.error,
		retry: false,
		enabled: !!+query?.id
	})

	return (
		<React.Fragment>
			<div className="titlePageUser">
				<span className="text-[#666565]">Chi tiết đơn cửa hàng </span>
				{data?.Data.MainOrderCustomID}
			</div>
			<div className="mb-4 ">
				<div className="sm:grid sm:grid-cols-2 gap-4">
					<div className="col-span-1">
						<ShopOrderOverView data={data?.Data} />
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

				{/* <OrderIDPaymentHistory data={data?.Data?.PayOrderHistories} /> */}
				{/* {data && <MessageControlUser clientId={data.Data.UID} mainOrderId={+query?.id} />} */}
			</div>
		</React.Fragment>
	)
}

ShopOrderDetailPage.displayName = 'Chi tiết đơn cửa hàng'
ShopOrderDetailPage.Layout = UserLayout
