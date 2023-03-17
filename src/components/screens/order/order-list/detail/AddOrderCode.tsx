import { Input } from 'antd'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { mainOrderCode, orderShopApi } from '~/api'
import { IconButton, FormInput, SecondFormSelect, toast } from '~/components'

type TForm = {
	Code: string
}

type TProps = {
	orderId: number
	dataList: any[]
}

export const AddOrderCode: React.FC<TProps> = ({ orderId, dataList }) => {
	const queryClient = useQueryClient()
	const [code, setCode] = useState<string>('')
	// const { data: orderShopList } = useQuery(
	// 	['orderShopList', orderId],
	// 	() => {
	// 		if (!!orderId) {
	// 			return orderShopApi.getShopList({ mainOrderID: orderId })
	// 		} else return undefined
	// 	},
	// 	{
	// 		enabled: !!orderId,
	// 		select: (data) => data.Data,
	// 		onSuccess: (res) => {},
	// 		refetchOnWindowFocus: false
	// 	}
	// )
	const createMutation = useMutation(mainOrderCode.create, {
		onSuccess: (res) => {
			queryClient.invalidateQueries(['OrderShopDetailModal', orderId])
			setCode('')
		},
		onError: (err) => {
			setCode('')
		}
	})
	const _onPress = () => {
		const fmCode = code.trim()
		if (!fmCode.length) {
			toast.warning('Mã đơn hàng không được để trống')
		} else {
			if (!dataList.find((x) => x.Code.toLowerCase() === fmCode.toLowerCase())) {
				createMutation.mutateAsync({
					MainOrderId: orderId,
					Code: fmCode
				})
			} else {
				toast.error('Đã trùng mã đơn hàng')
			}
		}
	}

	return (
		<div className={clsx('flex')}>
			{/* <FormInput
				control={control}
				name="Code"
				placeholder="Mã đơn hàng"
				rules={{
					required: 'Không bỏ trống mã đơn hàng',
					validate: (val: string) => (!val.trim().length ? 'This field is required' : true)
				}}
				inputContainerClassName="max-w-[300px]"
			/> */}
			<div>
				<div className="w-full">
					<Input
						value={code}
						onChange={(e) => {
							setCode(e.target.value)
						}}
						placeholder="Nhập mã đơn hàng"
						className={clsx('h-10 rounded-xl md:text-sm text-xs')}
					/>
				</div>
			</div>
			{/* <div className="ml-2 min-w-[300px] w-auto">
			
				<SecondFormSelect
					required
					options={orderShopList || []}
					name={`orderShopID`}
					placeholder="Chọn shop"
					control={control}
					getOptionValue={(x) => x.Id}
					getOptionLabel={(x) => x.ShopId}
				/>
			</div> */}
			<IconButton title="Thêm" showLoading onClick={_onPress} icon="fas fa-plus" btnClass="ml-4" toolip={'Thêm'} />
		</div>
	)
}
