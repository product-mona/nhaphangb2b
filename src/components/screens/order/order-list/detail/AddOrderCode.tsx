import { Input } from 'antd'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { mainOrderCode } from '~/api'
import { IconButton, toast } from '~/components'

type TProps = {
	orderId: number
	dataList: any[]
	realPriceCNY: number
}

export const AddOrderCode: React.FC<TProps> = ({ orderId, dataList, realPriceCNY }) => {
	const queryClient = useQueryClient()
	const [code, setCode] = useState<string>('')

	const createMutation = useMutation(mainOrderCode.create, {
		onSuccess: (res) => {
			queryClient.invalidateQueries(['OrderShopDetailModal', orderId])
			queryClient.invalidateQueries(['order-list', orderId])
			setCode('')
		},
		onError: (err) => {
			setCode('')
		}
	})
	const _onPress = () => {
		if (!realPriceCNY) {
			toast.error('Vui lòng nhập tổng sô tiền mua thật và nhấn cập nhật trước khi thực hiện thao tác tạo mã đơn hàng')
		} else {
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
	}

	return (
		<div className={clsx('flex')}>
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

			<IconButton title="Thêm" showLoading onClick={_onPress} icon="fas fa-plus" btnClass="ml-4" toolip={'Thêm'} />
		</div>
	)
}
