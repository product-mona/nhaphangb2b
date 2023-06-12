import { Input } from 'antd'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { mainOrderNoteApi } from '~/api'
import { IconButton } from '~/components/globals/button/IconButton'
import { FormTextarea } from '~/components/globals/formBase'
import { DataTable } from '~/components/globals/table'
import { TColumnsType } from '~/types/table'
import { _format } from '~/utils'
type FCProps = {
	orderId?: number
	orderIdCustom: string
	Uid: number
}
const changeHistoryColumns: TColumnsType<any> = [
	{
		dataIndex: 'Created',
		title: 'NGÀY TẠO',
		width: 179,
		render: (date) => _format.getVNDate(date)
	},
	{
		dataIndex: 'CreatedBy',
		title: 'NGƯỜI TẠO',
		width: 150
	},
	{
		dataIndex: 'Note',
		title: 'NỘI DUNG',
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
export const OrderFeedBacksTable: FC<FCProps> = ({ Uid, orderId, orderIdCustom }) => {
	const { data, isError, isLoading, isFetching, refetch } = useQuery(
		['FeedbacksOrderForm', orderId],
		() => {
			if (orderId) {
				return mainOrderNoteApi.getList({ pageSize: 9999, pageIndex: 1, mainOrderID: orderId, OrderBy: 'Id' })
			} else return undefined
		},
		{
			onSuccess: (data) => {
				// if (!data?.Data?.IsCheckNotiPrice && data?.Data?.OrderType === 3) toast.warning('Đơn hàng chưa cập nhật báo giá cho khách!')
				// form.reset(data?.Data)
			},
			retry: false,
			enabled: !!orderId,
			keepPreviousData: true
		}
	)

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
		mutationCreate.mutate(data)
	}
	return (
		<div>
			{/* <div className="overflow-y-scroll max-h-[50vh] "> */}
			<div className="">
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
				<div className={`p-4 pb-0 group flex items-end gap-4`}>
					<div className="flex-grow">
						<FormTextarea
							autoSize={{ minRows: 2, maxRows: 6 }}
							control={control}
							name="note"
							label=""
							placeholder="Nhập ghi chú mới ở đây"
							required={false}
						/>
					</div>
					<div className="group-focus-within:flex hidden justify-end ">
						<IconButton blue type="submit" icon={'fas fa-save'} title="Lưu" />
					</div>
				</div>
			</form>
		</div>
	)
}
