import { useRouter } from 'next/router'
import React from 'react'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { mainOrder } from '~/api'
import {
	MessageControlUser,
	OrderFeedBacksTable,
	OrderIDDetail,
	OrderIDPaymentHistory,
	OrderIDShopList,
	OrderOverView,
	SecondOrderIDProductList,
	UserLayout
} from '~/components'
import { SEOConfigs } from '~/configs/SEOConfigs'
import { useDisclosure } from '~/modules/core/hooks'
import { TNextPageWithLayout } from '~/types/layout'

const Index: TNextPageWithLayout = () => {
	const { query } = useRouter()
	const router = useRouter()

	const feedbackController = useDisclosure()

	const id = router.query.id as string | undefined

	const { data, isError, isLoading, refetch } = useQuery(['orderList', +query?.id], () => mainOrder.getByID(+query?.id), {
		onSuccess: (data) => {
			// OrderShops
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
	const renderDetailOrder = () => {
		// shop list for OrderType = 1 or product for orderTpye =3
		if (data?.Data.OrderType == 3) {
			return <SecondOrderIDProductList dataOrder={data?.Data} data={data?.Data?.Orders || []} />
		} else if (data?.Data.OrderType == 4) {
			return <OrderIDShopList dataOrder={data?.Data} orderShopList={data?.Data.SubMainOrders || []} />
		} else return null
	}
	return (
		<React.Fragment>
			<div className="titlePageUser">
				<span className="text-[#666565]">Chi tiết đơn hàng </span>
				{data?.Data.MainOrderCustomID}
			</div>

			<div className="mb-4 ">
				<div className="sm:grid sm:grid-cols-2 gap-4">
					<div className="col-span-1">
						<OrderOverView data={data?.Data} updatePaid={updatePaid} />
					</div>
					<div className="col-span-1">
						<OrderIDDetail data2={data?.Data?.Orders} dataAll={data?.Data} data={data?.Data?.FeeSupports} />
					</div>
				</div>
				<div className="mt-4">{renderDetailOrder()}</div>
				<div className="tableBox rounded-b-none mt-4">
					<div className="titleTable ">Phản hồi/ghi chú</div>
					<OrderFeedBacksTable orderId={+id} orderIdCustom={data?.Data.MainOrderCustomID || ''} Uid={data?.Data.UID} />
				</div>
				<OrderIDPaymentHistory data={data?.Data?.PayOrderHistories} />
				{data && <MessageControlUser clientId={data.Data.UID} mainOrderId={+query?.id} />}
			</div>
			{/* <div className="fixed right-5 z-[9999] top-[160px]">
				<Tooltip title="Phản hồi/ghi chú">
					<span className="relative inline-flex">
						<button
							className="wobble-hor-bottom flex items-center justify-center  bg-[#0A7CFF] h-[56px] w-[56px] rounded-full "
							type="button"
							onClick={feedbackController.onOpen}
						>
							<i className="fas fa-comment-alt-lines text-[#fff]   text-[24px] "></i>
						</button>
					</span>
				</Tooltip>
			</div>
			<div>
				<FeedbacksOrderModal
					orderId={+id}
					orderIdCustom={data?.Data.MainOrderCustomID || ''}
					isOpen={feedbackController.isOpen}
					onClose={feedbackController.onClose}
					Uid={data?.Data.UID}
				/>
			</div> */}
		</React.Fragment>
	)
}

Index.displayName = SEOConfigs.oder.detail
Index.Layout = UserLayout

export default Index
