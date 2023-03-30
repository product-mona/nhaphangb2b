import { Affix, Popconfirm } from 'antd'
import clsx from 'clsx'
import router from 'next/router'
import { Link } from 'rc-scroll-anim'
import React, { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useMutation, useQueries, useQueryClient } from 'react-query'
import { useMediaQuery } from 'react-responsive'
import { toast } from 'react-toastify'
import { mainOrder, order } from '~/api'
import { ActionButton, FormInputNumber, FormSelect } from '~/components'
import { IconButton } from '~/components/globals/button/IconButton'
import { orderStatus, statusData } from '~/configs/appConfigs'
import { useWareHouseTQ } from '~/hooks'
import { useCatalogue } from '~/hooks/useCatalogue'
import { _format } from '~/utils'

type TProps = {
	active: number
	handleActive: (active: number) => void
	handleUpdate: (data: TOrder) => void
	data: TOrder
	loading: boolean
	disabledPayment?: boolean
	refetch?: any
	RoleID: number
	isShopOrder?: boolean
	handleOpenEditExchangeModal?: () => void
}

const nameContent = 'w-2/4 py-1 text-sm text-[#3E3C6A] tracking-normal'
const contentItem = 'flex items-center border-b border-[#EDF1F7] py-[4px]'
const contentValue = 'w-2/4 py-1 text-sm font-medium text-black text-right'
const linkMenu = 'cursor-pointer py-[2px] text-[#0000005a] text-sm block'
const linkMenuActive = 'border-l-2 border-orange !text-black font-medium'

const IsShouldAffix: React.FC<{}> = ({ children }) => {
	const isBigScreen = useMediaQuery({ query: '(min-width: 1280px)' })
	return isBigScreen ? <Affix offsetTop={20}>{children}</Affix> : <>{children}</>
}

const ComponentAffix: React.FC<TProps> = ({
	data,
	loading,
	active,
	handleActive,
	handleUpdate,
	disabledPayment,
	refetch,
	RoleID,
	isShopOrder = false,
	handleOpenEditExchangeModal
}) => {
	const { warehouseTQ, warehouseVN, shippingTypeToWarehouse } = useCatalogue({
		warehouseTQEnabled: !!RoleID,
		warehouseVNEnabled: !!RoleID,
		shippingTypeToWarehouseEnabled: !!RoleID
	})
	const queryClient = useQueryClient()
	const { handleSubmit, control, watch } = useFormContext<TOrder>()
	const allFormState = watch()
	const updateExchangeRateFoprAllSubOrder = useMutation(
		(dataList: any[]) => {
			return Promise.all(
				dataList.map((vl) =>
					mainOrder.update({
						...vl,
						CurrentCNYVN: allFormState.CurrentCNYVN
					})
				)
			)
		},
		{
			onSuccess: () => {
				toast.success('Cập nhật đơn hàng thành công')
				queryClient.invalidateQueries(['order-list'])
			},
			onError: () => {
				toast.error('Thao tác thất bại. Vui lòng kiểm tra lại')
			}
		}
	)
	const getAllSubOrder = useMutation(
		(ids: number[]) => {
			return Promise.all(ids.map((id) => mainOrder.getByID(id)))
		},
		{
			onSuccess: (res) => {
				const resFm = res.filter((vl) => vl.ResultCode == 200).map((el) => el.Data)
				updateExchangeRateFoprAllSubOrder.mutateAsync(resFm)
			},
			onError: (error) => {}
		}
	)

	const mutationUpdate = useMutation(mainOrder.update, {
		onSuccess: () => {
			getAllSubOrder.mutateAsync(data?.SubMainOrders?.map((vl) => vl.Id) || [])
			// refetch()
		},
		onError: (error) => {
			toast.error('Thao tác thất bại. Vui lòng thử lại')
		}
	})
	const hanldeEdit = () => {
		toast.info('Đang thực hiện việc, vui lòng đợi trong giây lát...')
		return mutationUpdate.mutateAsync(allFormState)
	}

	return (
		<>
			<div className="tableBox p-4 md:mb-4 xl:mb-0">
				<div className="md:grid grid-cols-2 gap-4 xl:block">
					<div className="col-span-2">
						{!data?.IsCheckNotiPrice && data?.OrderType === 3 && (
							<div className={clsx(contentItem, 'w-full')}>
								{/* <div className={clsx(nameContent)}>Báo giá / báo cọc </div> */}
								<div className={clsx(contentValue, '!w-full')}>
									<IconButton
										onClick={async () => {
											const id = toast.loading('Đang xử lý ...')

											await mainOrder.updateNotiPrice({ ...data, IsCheckNotiPrice: true }).then(() => {
												mainOrder
													.updateDepositStatus({
														Id: data?.Id,
														// AmountDeposit: JSON.parse(localStorage.getItem('AmountDeposit'))
														AmountDeposit: allFormState.AmountDeposit
													})
													.then((res) => {
														localStorage.removeItem('AmountDeposit')
														toast.update(id, {
															render: 'Báo giá | báo cọc thành công!',
															autoClose: 0,
															isLoading: false,
															type: 'success'
														})
														refetch()
													})
													.catch((error) => {
														toast.update(id, {
															render: (error as any)?.response?.data?.ResultMessage,
															autoClose: 0,
															isLoading: false,
															type: 'error'
														})
													})
											})
										}}
										title="Báo giá | báo cọc"
										icon="far fa-credit-card"
										btnClass="mr-4 mb-4 lg:mb-0 w-full"
										btnIconClass="mr-4"
										showLoading
										toolip="Click để báo giá / báo cọc cho khách"
										yellow
										disabled={data?.IsCheckNotiPrice || !(RoleID === 1 || RoleID === 3 || RoleID === 4)}
									/>
								</div>
							</div>
						)}
						{data?.Status === 101 && data?.OrderType === 4 && (
							<div className={clsx(contentItem, 'w-full')}>
								<div className={clsx(contentValue, '!w-full')}>
									<IconButton
										onClick={async () => {
											const id = toast.loading('Đang xử lý ...')
											// const AmountDepositMoney = JSON.parse(localStorage.getItem('AmountDeposit'))
											if (!allFormState.AmountDeposit) {
												toast.update(id, {
													render: 'Vui lòng nhập số tiền phải cọc!',
													autoClose: 0,
													isLoading: false,
													type: 'warning'
												})
												return
											}
											await mainOrder
												.updateDepositStatus({
													Id: data?.Id,
													AmountDeposit: allFormState.AmountDeposit
												})
												.then((res) => {
													localStorage.removeItem('AmountDeposit')
													toast.update(id, {
														render: 'Báo giá | báo cọc thành công!',
														autoClose: 0,
														isLoading: false,
														type: 'success'
													})
													refetch()
												})
												.catch((error) => {
													toast.update(id, {
														render: (error as any)?.response?.data?.ResultMessage,
														autoClose: 0,
														isLoading: false,
														type: 'error'
													})
												})
										}}
										title={`Báo cọc`}
										icon="far fa-credit-card"
										btnClass="mr-4 mb-4 lg:mb-0 w-full"
										btnIconClass="mr-4"
										showLoading
										toolip="Click để báo giá / báo cọc cho khách"
										yellow
										disabled={data?.IsCheckNotiPrice || !(RoleID === 1 || RoleID === 3 || RoleID === 4 || RoleID === 7)}
									/>
								</div>
							</div>
						)}
						{!isShopOrder ? (
							<div className={clsx(contentItem)}>
								<div className={clsx(nameContent)}>Order ID</div>
								<div className={clsx(contentValue, 'truncate')}>{data?.Id}</div>
							</div>
						) : null}
						{!isShopOrder ? (
							<div className={clsx(contentItem)}>
								<div className={clsx(nameContent, 'flex')}>
									<span className="truncate">Tỷ giá đơn hàng</span>
								</div>
								<div className={clsx(contentValue, 'truncate')}>
									{!!(RoleID === 1 || RoleID === 3 || RoleID === 4) ? (
										<span>
											<Popconfirm
												title={
													<div>
														<p className="text-base pb-4">Cập nhật tỷ giá cho toàn bộ đơn hàng.</p>
														<FormInputNumber
															suffix=" VNĐ"
															control={control}
															name="CurrentCNYVN"
															placeholder=""
															allowNegative={false}
														/>
													</div>
												}
												onConfirm={hanldeEdit}
												okText="Cập nhật"
												cancelText="Hủy"
											>
												<ActionButton
													onClick={() => {}}
													iconContainerClassName="!text-blue !p-0 h-auto border-none"
													icon="fas fa-pen"
													title="Chỉnh sửa tỷ giá đơn hàng này"
													placement="bottom"
												/>
											</Popconfirm>
										</span>
									) : null}
									{_format.getVND(data?.CurrentCNYVN, '')}
								</div>
							</div>
						) : null}

						<div className={clsx(contentItem)}>
							<div className={clsx(nameContent)}>Loại đơn hàng</div>
							<div className={clsx(contentValue)}>
								{data?.OrderType == 4 ? 'Đơn trọn gói' : data?.OrderType == 1 ? 'Đơn nhỏ' : 'Đơn dịch vụ'}
							</div>
						</div>
						<div className={clsx(contentItem)}>
							<div className={clsx(nameContent)}>{data?.OrderType == 1 ? 'Tổng tiền' : 'Tổng tiền'} VNĐ</div>
							<div className={clsx(contentValue)}>{_format.getVND(data?.TotalOrderAmount, '')}</div>
						</div>
						{!isShopOrder ? (
							<>
								<div className={clsx(contentItem)}>
									<div className={clsx(nameContent)}>Đã trả</div>
									<div className={clsx(contentValue)}>{_format.getVND(data?.Deposit, '')}</div>
								</div>
								<div className={clsx(contentItem)}>
									<div className={clsx(nameContent)}>Còn lại</div>
									<div className={clsx(contentValue, '!text-warning')}>{_format.getVND(data?.RemainingAmount, '')}</div>
								</div>
							</>
						) : null}
					</div>
					<div className="col-span-1">
						<div className={clsx(contentItem, 'xl:mt-4 border-none')}>
							<FormSelect
								control={control}
								name="Status"
								label="Trang thái"
								placeholder=""
								data={orderStatus?.slice(1, orderStatus.length)}
								defaultValue={orderStatus?.slice(1, orderStatus.length - 1).find((x) => x.id === data?.Status)}
							/>
						</div>
						<div className={clsx(contentItem, 'border-none')}>
							<FormSelect
								control={control}
								name="FromPlace"
								label="Kho TQ"
								placeholder=""
								data={warehouseTQ}
								select={{ label: 'Name', value: 'Id' }}
								defaultValue={{
									Id: data?.FromPlace,
									Name: data?.FromPlaceName
								}}
								disabled={isShopOrder}
							/>
						</div>
						<div className={clsx(contentItem, 'border-none')}>
							<FormSelect
								control={control}
								name="ReceivePlace"
								label="Nhận hàng tại"
								placeholder=""
								data={warehouseVN}
								select={{ label: 'Name', value: 'Id' }}
								defaultValue={{
									Id: data?.ReceivePlace,
									Name: data?.ReceivePlaceName
								}}
								disabled={isShopOrder}
							/>
						</div>
						<div className={clsx(contentItem, 'border-none')}>
							<FormSelect
								control={control}
								name="ShippingType"
								label="Phương thức vận chuyển"
								placeholder=""
								data={shippingTypeToWarehouse}
								select={{ label: 'Name', value: 'Id' }}
								defaultValue={{
									Id: data?.ShippingType,
									Name: data?.ShippingTypeName
								}}
								disabled={isShopOrder}
							/>
						</div>
					</div>
				</div>
				{(RoleID === 1 || RoleID === 3 || RoleID === 4) && (
					<div className="flex items-center justify-center jus mt-3 pt-3 m-auto border-t border-[#edf1f7]">
						<IconButton
							onClick={handleSubmit(handleUpdate)}
							icon="fas fa-pencil"
							title="Cập nhật"
							btnClass="mr-2 !bg-orange !text-white"
							showLoading
							toolip=""
						/>
						{!isShopOrder &&
							data?.Status !== 101 &&
							data?.Status !== 102 &&
							!disabledPayment &&
							(RoleID === 1 || RoleID === 3) &&
							data?.TotalOrderAmount !== data?.Deposit && (
								<a
									style={{
										pointerEvents: data?.TotalOrderAmount === data?.Deposit ? 'none' : 'all'
									}}
								>
									<IconButton
										onClick={() => {
											const id = toast.loading('Đang xử lý ...')
											mainOrder
												.payment({
													Id: data?.Id,
													Note: undefined,
													PaymentMethod: 2,
													PaymentType: data?.Status === 0 ? 1 : 2,
													Amount: data?.Status === 0 ? data?.AmountDeposit : data?.RemainingAmount
												})
												.then(() => {
													toast.update(id, {
														render: `${data?.Status === 0 ? 'Đặt cọc thành công!' : 'Thanh toán thành công!'}`,
														autoClose: 0,
														isLoading: false,
														type: 'success'
													})
													refetch()
												})
												.catch((error) => {
													toast.update(id, {
														render: (error as any)?.response?.data?.ResultMessage,
														autoClose: 0,
														isLoading: false,
														type: 'error'
													})
												})
										}}
										icon="fas fa-credit-card"
										// title="Thanh toán"

										title={data?.Status === 0 ? 'Đặt cọc' : data?.RemainingAmount > 0 ? 'Thanh toán' : 'Hoàn tiền'}
										showLoading
										toolip=""
										blue
									/>
								</a>
							)}
					</div>
				)}
			</div>
		</>
	)
}

export const OrderDetail: FC<TProps> = (props) => {
	return (
		<IsShouldAffix>
			<ComponentAffix {...props} />
		</IsShouldAffix>
	)
}
