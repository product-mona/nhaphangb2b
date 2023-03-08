import clsx from 'clsx'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { mainOrderCode, orderShopApi } from '~/api'
import { IconButton, FormInput, SecondFormSelect, toast } from '~/components'

type TForm = {
	Code: string
	orderShopID: number
}

type TProps = {
	add: (data: TForm) => Promise<any>
	orderId: number
	dataList: any[]
}

export const AddOrderCode: React.FC<TProps> = ({ add, orderId, dataList }) => {
	const queryClient = useQueryClient()
	const {
		control,
		formState: { errors },
		handleSubmit,
		reset,
		setValue
	} = useForm<TForm>()
	const { data: orderShopList } = useQuery(
		['orderShopList', orderId],
		() => {
			if (!!orderId) {
				return orderShopApi.getShopList({ mainOrderID: orderId })
			} else return undefined
		},
		{
			enabled: !!orderId,
			select: (data) => data.Data,
			onSuccess: (res) => {},
			refetchOnWindowFocus: false
		}
	)
	const createMutation = useMutation(mainOrderCode.create, {
		onSuccess: (res) => {
			queryClient.invalidateQueries('order-list')
			setValue('Code', null)
		},
		onError: (err) => {
			setValue('Code', null)
		}
	})
	const _onPress = async (data: TForm) => {
		console.log(dataList)
		if (!dataList.find((x) => x.Code.toLowerCase() === data.Code.toLowerCase())) {
			createMutation.mutateAsync({
				MainOrderId: orderId,
				orderShopID: data.orderShopID,
				Code: data.Code
			})
		} else {
			toast.warning('Đã trùng mã đơn hàng')
		}
	}

	return (
		<div className={clsx('flex', errors.Code ? 'items-start' : 'items-center')}>
			<FormInput
				control={control}
				name="Code"
				placeholder="Mã đơn hàng"
				rules={{
					required: 'Không bỏ trống mã đơn hàng',
					validate: (val: string) => (!val.trim().length ? 'This field is required' : true)
				}}
				inputContainerClassName="max-w-[300px]"
			/>
			<div className="ml-2 min-w-[300px] w-auto">
				{/* select orderShopId  */}
				<SecondFormSelect
					required
					options={orderShopList || []}
					name={`orderShopID`}
					placeholder="Chọn shop"
					control={control}
					getOptionValue={(x) => x.Id}
					getOptionLabel={(x) => x.ShopId}
				/>
			</div>
			<IconButton title="Thêm" showLoading onClick={handleSubmit(_onPress)} icon="fas fa-plus" btnClass="ml-4" toolip={'Thêm'} />
		</div>
	)
}
