import { Empty } from 'antd'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueries, useQuery, useQueryClient } from 'react-query'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { orderShopTemp, shipping, user, warehouseFrom, warehouseTo } from '~/api'
import {
	CartSteps,
	ConfirmCompleteForm,
	DeliveryInfo,
	PaymentOrderInfo,
	ReceiveInfoForm,
	StaticUserForm,
	toast,
	UserLayout,
	WareHouseInfo
} from '~/components'
import { SEOHomeConfigs } from '~/configs/SEOConfigs'
import { useCatalogue, useDeepEffect, useWareHouseTQ } from '~/hooks'
import { deleteOrderShopTempById, useAppDispatch, useAppSelector } from '~/store'
import { TNextPageWithLayout } from '~/types/layout'
import { Collapse } from 'antd'
import { number } from 'prop-types'
import { toastFormError } from '~/utils'
const { Panel } = Collapse

const Index: TNextPageWithLayout & React.FC<{}> = () => {
	const dispatch = useAppDispatch()
	const router = useRouter()
	const queryClient = useQueryClient()

	//---------REDUX---------//

	//get list id orpayment
	const ids = useAppSelector((state) => state.cart.selectedShopIds)

	// getdetail orderShop list
	const orderShopTempsData = useQueries(
		ids.map((id) => ({
			queryKey: ['orderShopTempData', id],
			queryFn: () => orderShopTemp.getByID(id).then((res) => res.Data)
		}))
	).map((res) => res.data)

	const { data: userPayment } = useQuery('userPayment', () => user.getByID(orderShopTempsData[0]?.UID), {
		refetchOnWindowFocus: false,
		enabled: !!orderShopTempsData[0]?.UID
	})

	const { data: warehouseTQ } = useQuery(['warehouseFromData'], () => warehouseFrom.getList().then((res) => res.Data.Items), {
		enabled: !!ids,
		refetchOnWindowFocus: false
	})

	const { data: warehouseVN } = useQuery(['warehouseToData'], () => warehouseTo.getList().then((res) => res.Data.Items), {
		enabled: !!ids,
		refetchOnWindowFocus: false
	})

	const { data: shippingTypeToWarehouse } = useQuery(
		['shippingType'],
		() =>
			shipping
				.getList({
					PageSize: 9999,
					PageIndex: 1
				})
				.then((res) => res.Data.Items),
		{
			enabled: !!ids,
			refetchOnWindowFocus: false
		}
	)
	//-----------FORM-----------//
	const schema = yup.object().shape({
		warehouseTQ: yup.number().required('Kho Trung Qu???c kh??ng ???????c ????? tr???ng'),
		warehouseVN: yup.number().required('Kho chuy???n v??? kh??ng ???????c ????? tr???ng'),
		shippingType: yup.number().required('Ph????ng th???c v???n chuy???n kh??ng ???????c ????? tr???ng'),
		IsAgreement: yup.boolean()
	})
	const { control, handleSubmit, reset, getValues, setValue, setError, watch } = useForm<TUserPayment>({
		mode: 'onBlur',
		defaultValues: {
			ShopPayments: orderShopTempsData.map((data) => ({
				ShopId: data?.Id
			}))
		},
		resolver: yupResolver(schema)
	})
	const allFormState = watch()
	useDeepEffect(() => {
		if (!!orderShopTempsData.length && !!orderShopTempsData?.[0]) {
			const { FullName, Address, Email, Phone } = orderShopTempsData?.[0]
			reset({
				ReceiverFullName: FullName,
				ReceiverAddress: Address,
				ReceiverEmail: Email,
				ReceiverPhone: Phone,
				FullName: FullName,
				Address: Address,
				Email: Email,
				Phone: Phone,
				warehouseTQ: warehouseTQ?.[0].Id,
				shippingType: shippingTypeToWarehouse?.[0].Id,
				ShopPayments: orderShopTempsData.map((data) => ({
					ShopId: data?.Id,
					WarehouseTQ: warehouseTQ?.[0].Id,
					WarehouseVN: warehouseVN?.[0].Id,
					ShippingType: shippingTypeToWarehouse?.[0].Id
				}))
			})
		}
	}, [[shippingTypeToWarehouse, warehouseTQ, warehouseVN, orderShopTempsData]])

	const mutationPayment = useMutation(orderShopTemp.payment)

	const onPress = async (data: TUserPayment) => {
		console.log(data)
		const { ShopPayments, IsAgreement, ...restData } = data
		if (!IsAgreement) {
			setError('IsAgreement', { type: 'custom', message: 'Qu?? kh??ch l??ng x??c nh???n ??i???u kho???n ?????t h??ng tr?????c khi mua h??ng.' })
		} else {
			const fmData = {
				...restData,
				IsAgreement,
				ShopPayments: ShopPayments.map((x) => x.ShopId)
			}
			console.log(fmData)
			mutationPayment
				.mutateAsync(fmData)
				.then(() => {
					toast.success('?????t h??ng th??nh c??ng!')
					queryClient.invalidateQueries({ queryKey: 'menuData' })
					router.push('/user/order-list')
					ids.map((id) => dispatch(deleteOrderShopTempById(id)))
				})
				.catch((error) => {
					toast.error('Vui l??ng th??? l???i!')
				})
		}
	}
	const onError = (err: any) => {
		toastFormError(err)
	}

	return (
		<div className="">
			<div className="">
				<div className="titlePageUser">Thanh to??n</div>
				<CartSteps current={2} />
				{!ids.length || (!orderShopTempsData?.[0] && <Empty description="Kh??ng t??m th???y d??? li???u n??o trong thanh to??n" />)}
			</div>
			{!!ids.length && !!orderShopTempsData?.[0] && (
				<React.Fragment>
					<div className="grid grid-cols-10 gap-4">
						<div className="xl:col-span-7 col-span-10 flex flex-col gap-4 order-1">
							{orderShopTempsData.map((orderShopTempData, index) => (
								<Fragment key={`${index}-${orderShopTempData?.Id}`}>
									<PaymentOrderInfo
										{...{
											index,
											orderShopTempData,
											warehouseVN,
											shippingTypeToWarehouse,
											warehouseTQ,
											userPayment,
											control
										}}
									/>
								</Fragment>
							))}
						</div>
						<div className="xl:col-span-3 col-span-10 flex flex-col order-2">
							<Collapse defaultActiveKey={[]} expandIconPosition="right">
								<Panel header="TH??NG TIN CHUNG" key="1">
									<div className="p-4">
										<StaticUserForm control={control} />
										<ReceiveInfoForm control={control} />
									</div>
								</Panel>
							</Collapse>

							<div className="sticky top-4">
								<Collapse defaultActiveKey={['deliveri']} expandIconPosition="right">
									<Panel header="TH??NG TIN V???N CHUY???N" key="deliveri">
										<div className="p-4">
											<DeliveryInfo control={control} />
										</div>
									</Panel>
								</Collapse>
								<ConfirmCompleteForm
									totalPrice={1}
									control={control}
									loadingPayment={mutationPayment.isLoading}
									onPress={handleSubmit(onPress, onError)} /// obSubmit
								/>
							</div>
						</div>
					</div>
					<div className="mb-4" />
				</React.Fragment>
			)}
		</div>
	)
}

Index.displayName = SEOHomeConfigs.shopping.payment
Index.Layout = UserLayout

export default Index
