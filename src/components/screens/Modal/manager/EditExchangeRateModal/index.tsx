import { InputNumber, Modal } from 'antd'
import clsx from 'clsx'
import React, { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { mainOrder } from '~/api'
import { toast } from 'react-toastify'
import { useMutation, useQueries, useQuery, useQueryClient } from 'react-query'
import { FormInputNumber } from '~/components'

type FCProps = {
	isOpen: boolean
	onClose: () => void
	SubMainOrders: any[]
}
export const EditExchangeRateModal: FC<FCProps> = ({ isOpen, onClose, SubMainOrders }) => {
	const queryClient = useQueryClient()
	const { handleSubmit, control, watch } = useFormContext<TOrder>()
	const [isUpdateSubOrder, setIsUpdateSubOrder] = useState<boolean>(false)
	const allFormState = watch()
	const updateForSubOrder = useQueries(
		SubMainOrders?.map((vl, idx) => {
			return {
				queryKey: ['OrderDetail', vl.Id],
				queryFn: () => {
					return mainOrder.getByID(vl?.Id)
				},
				onSuccess: (res) => {
					if (res.ResultCode == 200) {
						mutationUpdateSubOrder.mutateAsync({
							...res?.Data,
							CurrentCNYVN: allFormState.CurrentCNYVN
						})
					}
				}, // allFormState.SubMainOrders
				enabled: !!isUpdateSubOrder,
				refetchOnWindowFocus: false
			}
		})
	)
	const getAllSubOrder = useMutation(
		(ids: number[]) => {
			return Promise.all(ids.map((id) => mainOrder.getByID(id)))
		},
		{
			onSuccess: (res) => {
				console.log(res)
			},
			onError: (error) => {}
		}
	)
	const mutationUpdateSubOrder = useMutation(mainOrder.update, {
		onSuccess: () => {
			queryClient.invalidateQueries(['order-list'])
		},
		onError: (error) => {}
	})
	const mutationUpdate = useMutation(mainOrder.update, {
		onSuccess: () => {
			setIsUpdateSubOrder(true)
			// queryClient.invalidateQueries(['order-list', parentOrderID])
			toast.success('Cập nhật đơn hàng thành công')
		},
		onError: (error) => {
			// showToast({
			// 	title: 'Đã xảy ra lỗi',
			// 	message: (error as any)?.response?.data?.ResultMessage,
			// 	type: 'error'
			// })
		}
	})
	const onSubmit = () => {
		// alert(allFormState.CurrentCNYVN)
		// console.log(allFormState)
		mutationUpdate.mutateAsync(allFormState)
	}
	return (
		<Modal
			title="Cập nhật tỷ giá cho toàn bộ đơn hàng"
			onCancel={onClose}
			visible={isOpen}
			cancelText="Hủy"
			cancelButtonProps={{
				className: 'px-[16px] rounded bg-transparent text-[#626262]',
				size: 'large',
				disabled: mutationUpdate.isLoading || mutationUpdateSubOrder.isLoading
			}}
			okText="Cập nhật"
			okButtonProps={{
				size: 'large',
				disabled: mutationUpdate.isLoading || mutationUpdateSubOrder.isLoading
			}}
			onOk={() => {
				onSubmit()
			}}
		>
			<div>
				<div className={clsx('flex')}>
					<div>
						<div className="w-full">
							<FormInputNumber suffix=" VNĐ" control={control} name="CurrentCNYVN" placeholder="" allowNegative={false} />
						</div>
					</div>
				</div>
			</div>
		</Modal>
	)
}
