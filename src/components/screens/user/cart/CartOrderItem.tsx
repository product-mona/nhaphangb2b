import { Checkbox, Collapse, Spin, Tooltip, Typography, Button as AntButton } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useMutation } from 'react-query'
import { orderShopTemp, orderTemp } from '~/api'
import { ActionButton, Button } from '~/components'
import { IconButton } from '~/components/globals/button/IconButton'
import { showToast, toast } from '~/components/toast'
import { setSelectedShopIds, useAppDispatch } from '~/store'
import { _format } from '~/utils'
import styles from './CartOrderItem.module.css'
import { CheckboxCustom } from './block'
import { OrderTempItem } from './OrderTempItem'

type TProps = {
	cart: TUserCartOrderShopTemp
	toggleShopId: (shopId: number) => void
	checked: boolean
	note: string
	handleNote: (key: number, value: string) => void
	refetchCart: () => void
}

const TopContainer = ({ checked, toggleShopId, cart, onHandleShop, loading, disabled }) => {
	return (
		<div className="topContainer">
			<div className="top flex justify-between items-center">
				<div className="">
					{/* {checked && <div className="mb-3 text-xs font-semibold tracking-wide">Bạn đã chọn đơn hàng này!</div>} */}
					<Tooltip title="Chọn đặt đơn hàng này">
						<Checkbox
							onChange={(e) => {
								e.stopPropagation()
								toggleShopId(cart?.Id)
							}}
							checked={checked}
						>
							<span className="text-[#fff]">
								Tên shop: <span className="font-bold">{cart?.ShopName}</span>
							</span>
						</Checkbox>
					</Tooltip>
				</div>
				<IconButton
					onClick={() => onHandleShop(cart?.Id)}
					icon={loading ? 'fas fa-sync fa-spin' : 'fas fa-trash-alt'}
					title=""
					showLoading
					toolip="Xóa cửa hàng"
					btnClass="bg-red hover:bg-redHover"
					btnIconClass="!mr-0"
					disabled={disabled}
				/>
			</div>
		</div>
	)
}

export const CartOrderItem: React.FC<TProps> = ({ cart, note, handleNote, toggleShopId, checked, refetchCart }) => {
	const [loading, setLoading] = useState(false)
	const [loadingPayment, setLoadingPayment] = useState(false)
	// const { getValues, setValue,reset,watch,handleSubmit } = useForm<{
	// 	IsPacked: boolean
	// 	IsFastDelivery: boolean
	// 	IsInsurance: boolean
	// 	IsCheckProduct: boolean
	// 	shopCartList: TUserCartOrderShopTemp
	// }>({
	// 	mode: 'onBlur',
	// 	defaultValues: {
	// 		IsPacked: false, //cart?.IsPacked,
	// 		IsFastDelivery: false, //cart?.IsFastDelivery,
	// 		IsInsurance: false,//cart?.IsInsurance,
	// 		IsCheckProduct: false, //cart?.IsCheckProduct
	// 	}
	// })
	const methods = useForm<TUserCartOrderShopTemp>({
		defaultValues: {}
	})
	const allFormState = methods.watch()
	useEffect(() => {
		methods.reset(cart)
	}, [cart])
	const mutationDeleteShop = useMutation(orderShopTemp.delete, {
		onSuccess: (_, id) => {
			toast.success('Xoá cửa hàng thành công')
			refetchCart()
			setLoading(true)
		},
		onError: (error) => {
			setLoading(true)
			toast.error
		}
	})
	const mutationUpdateProduct = useMutation(orderTemp.updateField, {
		onSuccess: (data, params) => {
			toast.success('Cập nhật sản phẩm thành công')
			refetchCart()
		},
		onError: toast.error
	})

	const mutationDeleteProduct = useMutation(orderTemp.delete, {
		onSuccess: (_, id) => {
			toast.success('Xoá sản phẩm thành công')
			refetchCart()
		},
		onError: toast.error
	})
	const mutationUpdateByShop = useMutation(orderTemp.updateByShop, {
		onSuccess: (res) => {
			toast.success('Cập nhật giỏ hàng thành công')
			refetchCart()
		},
		onError: toast.error
	})
	const onPayment = () => {
		setLoading(true)
		orderShopTemp
			.updateField({
				...cart,
				IsPacked: methods.getValues('IsPacked'),
				IsFastDelivery: methods.getValues('IsFastDelivery'),
				IsInsurance: methods.getValues('IsInsurance'),
				IsCheckProduct: methods.getValues('IsCheckProduct')
			})
			.then(() => {
				// dispatch(setSelectedShopIds([cart?.Id]));
				// router.push("/user/cart/payment");
				// toast.success("Cập nhật dịch vụ thành công!");
			})
			.finally(() => {
				setLoading(false)
			})
	}

	const onChangeCheckbox = async (e: CheckboxChangeEvent, type: 'IsPacked' | 'IsFastDelivery' | 'IsInsurance' | 'IsCheckProduct') => {
		methods.setValue(type, e.target.checked)
		onPayment()
	}

	const onHandleProduct = async (type: 'update' | 'delete', data: { Id: number; Quantity: number; Brand?: string }) => {
		try {
			if (type === 'update') {
				await mutationUpdateProduct.mutateAsync(data)
			} else {
				await mutationDeleteProduct.mutateAsync(data.Id)
			}
		} catch (error) {
			showToast({
				title: (error as any)?.response?.data?.ResultCode,
				message: (error as any)?.response?.data?.ResultMessage,
				type: 'error'
			})
		}
	}

	const onHandleShop = async (id: number) => {
		setLoading(true)
		mutationDeleteShop.mutateAsync(id)
	}
	const onSubmit = (data: any) => {
		// console.log('onSubmit', data)
	}
	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<div
					className="cartOrderItemContainer tableBox py-3"
					style={{
						pointerEvents: loading ? 'none' : 'all'
					}}
				>
					<Collapse defaultActiveKey={1} collapsible="header" className="collapse-cart-order-item">
						<Collapse.Panel
							header={
								<TopContainer
									checked={checked}
									toggleShopId={toggleShopId}
									cart={cart}
									onHandleShop={onHandleShop}
									loading={loading}
									disabled={loadingPayment}
								/>
							}
							key={1}
							showArrow={false}
						>
							{allFormState?.OrderTemps?.map((orderTempData, index) => (
								<Spin
									key={orderTempData?.Id}
									spinning={
										(mutationDeleteProduct.isLoading || mutationUpdateProduct.isLoading) &&
										mutationUpdateProduct.variables?.Id === orderTempData?.Id
									}
								>
									<div key={orderTempData?.Id}>
										<OrderTempItem
											{...{
												orderTempData,
												index,
												isLoading: mutationDeleteProduct.isLoading || mutationUpdateProduct.isLoading,
												deleteProduct: () =>
													onHandleProduct('delete', {
														Id: orderTempData?.Id,
														Quantity: 0
													}),
												updateProduct: (Quantity, Brand) => {
													// console.log(cart)
													// console.log('upodate', {
													// 	Id: orderTempData?.Id, //id này là id của sản phẩm
													// 	Quantity,
													// 	Brand
													// })
													onHandleProduct('update', {
														Id: orderTempData?.Id,
														Quantity,
														Brand
													})
												}
											}}
										/>
									</div>
								</Spin>
							))}
						</Collapse.Panel>
					</Collapse>
					<div className="">
						<div className="footer grid col-span-2">
							<div className="left col-span-1">
								<div className="flex items-center">
									<div className="leftTitle">Dịch vụ kèm theo</div>
								</div>
								<div className="flex">
									<div className="col-span-1">
										<CheckboxCustom
											defaultChecked={cart?.IsFastDelivery}
											onChange={(e) => onChangeCheckbox(e, 'IsFastDelivery')}
											label="Giao tận nhà"
										/>
									</div>
									<div className="col-span-1">
										<CheckboxCustom
											defaultChecked={cart?.IsCheckProduct}
											onChange={(e) => onChangeCheckbox(e, 'IsCheckProduct')}
											label="Kiểm hàng"
										/>
									</div>
									<div className="col-span-1">
										<CheckboxCustom
											defaultChecked={cart?.IsPacked}
											onChange={(e) => onChangeCheckbox(e, 'IsPacked')}
											label="Đóng gỗ"
										/>
									</div>
									<div className="col-span-1">
										<CheckboxCustom
											defaultChecked={cart?.IsInsurance}
											onChange={(e) => onChangeCheckbox(e, 'IsInsurance')}
											label="Bảo hiểm"
										/>
									</div>
								</div>
							</div>
							<div className="mid col-span-1">
								<div>
									<div className="totalPrice">
										<span className="totalPriceLeft">Tổng tiền (VNĐ):</span>
										<span className="totalPriceRight">{_format.getVND(cart?.PriceVND, '')}</span>
									</div>

									<div className="totalPrice">
										<span className="totalPriceLeft">Tổng sản phẩm:</span>
										<span className="totalPriceRight">{cart?.Quantity}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					{methods.formState.isDirty ? (
						<div className="flex justify-center items-center sticky  bottom-[8px]">
							<div className={styles.snackBar}>
								<div>
									<p className={styles.snackBarLabel}>Bạn vừa thay đổi giỏ hàng của shop này. Hãy cập nhật</p>
								</div>
								<div className="flex">
									<Tooltip title="Cập nhật giỏ hàng">
										<button
											className={styles.snackBarSubmitBtn}
											onClick={() => {
												// console.log(allFormState.OrderTemps)
												const fmData = {
													orderShopId: allFormState.Id,
													orders: allFormState.OrderTemps.map((vl) => {
														return {
															id: vl.Id,
															quantity: vl.Quantity,
															brand: vl.Brand
														}
													})
												}
												mutationUpdateByShop.mutateAsync(fmData)
											}}
										>
											CẬP NHẬT
										</button>
									</Tooltip>
									<Tooltip title="Hoàn tác">
										<button
											style={{
												fill: '#FFF',
												stroke: '#FFF',
												color: '#FFF'
											}}
											onClick={() => {
												methods.reset()
											}}
										>
											<svg
												focusable="false"
												aria-hidden="true"
												viewBox="0 0 24 24"
												data-testid="CloseIcon"
												width={20}
												height={20}
											>
												<path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
											</svg>
										</button>
									</Tooltip>
								</div>
							</div>
						</div>
					) : null}
				</div>
			</form>
		</FormProvider>
	)
}
