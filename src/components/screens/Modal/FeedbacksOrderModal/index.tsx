import { Input, Modal } from 'antd'
import { FC } from 'react'
import { useMutation, useQuery } from 'react-query'
import { FormProvider, useForm, Controller } from 'react-hook-form'

import { mainOrder, mainOrderNoteApi } from '~/api'
import { DataTable } from '~/components/globals/table'
import { TColumnsType, TTable } from '~/types/table'
import { _format } from '~/utils'
import { FormTextarea } from '~/components/globals/formBase'
import { toast } from '~/components/toast'
import { IconButton } from '~/components/globals/button/IconButton'

type FCProps = {
	isOpen: boolean
	onClose: () => void
	orderId?: number
	orderIdCustom: string
	Uid: number
}
export const FeedbacksOrderModal: FC<FCProps> = ({ isOpen, onClose, orderId, orderIdCustom, Uid }) => {
	return (
		<Modal
			visible={isOpen}
			onCancel={onClose}
			destroyOnClose
			footer={null}
			title={<div className="h-full flex text-[16px] font-bold tracking-wide  pb-3">Phản hồi/ghi cho chú đơn hàng</div>}
			maskStyle={{ backgroundColor: 'rgba(252, 252, 252, 50%)' }}
			width={1000}
		>
			<FeedbacksOrderForm Uid={Uid} isOpen={isOpen} onClose={onClose} orderId={orderId} orderIdCustom={orderIdCustom} />
		</Modal>
	)
}

const FeedbacksOrderForm: FC<FCProps> = ({ Uid, orderId, onClose, orderIdCustom }) => {
	const { data, isError, isLoading, isFetching, refetch } = useQuery(
		['FeedbacksOrderForm', orderId],
		() => {
			if (orderId) {
				return mainOrderNoteApi.getList({ pageSize: 9999, pageIndex: 1, mainOrderID: orderId })
			} else return undefined
		},
		{
			onSuccess: (data) => {
				console.log('FeedbacksOrderForm', data)
				// if (!data?.Data?.IsCheckNotiPrice && data?.Data?.OrderType === 3) toast.warning('Đơn hàng chưa cập nhật báo giá cho khách!')
				// form.reset(data?.Data)
			},
			retry: false,
			enabled: !!orderId,
			keepPreviousData: true
		}
	)

	const changeHistoryColumns: TColumnsType<any> = [
		{
			dataIndex: 'Created',
			title: 'Ngày tạo',
			width: 179,
			render: (date) => _format.getVNDate(date)
		},
		{
			dataIndex: 'CreatedBy',
			title: 'Người tạo',
			width: 150
		},
		{
			dataIndex: 'Note',
			title: 'Nội dung',
			render: (note) => (
				<Input.TextArea
					style={{
						padding: 0,
						background: 'transparent',
						border: 'none',
						boxShadow: 'none'
					}}
					defaultValue={note || ''}
					placeholder=""
					autoSize
					readOnly
				/>
			)
		}
	]

	const { control, reset, handleSubmit } = useForm<any>({
		defaultValues: {
			isUserNote: true,
			mainOrderID: orderId,
			uid: Uid,
			mainOrderIDCustom: orderIdCustom,
			note: ''
		}
	})

	const mutationCreate = useMutation(mainOrderNoteApi.create, {
		onError: (err) => {
			return console.log(err)
		},
		onSuccess: (res) => {
			toast.success('Thêm ghi chú thành công')
			reset()
			refetch()
		}
	})
	const onSubmit = (data: any) => {
		mutationCreate.mutateAsync(data)
	}
	return (
		<div>
			<div className="overflow-y-scroll max-h-[50vh] ">
				<DataTable
					{...{
						style: 'secondary',
						columns: changeHistoryColumns,
						data: data?.Data?.Items || [],
						pagination: false
					}}
				/>
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={`p-4 group mt-3`}>
					<FormTextarea
						autoSize={{ minRows: 2, maxRows: 6 }}
						control={control}
						name="note"
						label=""
						placeholder="Nhập ghi chú mới ở đây"
						required={false}
					/>
					<div className="group-focus-within:flex hidden justify-end mt-4">
						<IconButton type="submit" icon={'fas fa-save'} title="Lưu" />
					</div>
				</div>
			</form>
			{/* <div onClick={onClose}>Đóng</div> */}
		</div>
	)
}
