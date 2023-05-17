import clsx from 'clsx'
import moment from 'moment'
import React, { useRef } from 'react'
import { FilterDate, FilterRangeDate } from '~/components'
import { IconButton } from '~/components/globals/button/IconButton'
import { Button } from '~/components/globals/button/PrimaryButton'

type TProps = {
	handleFilter: (fromDate: string, toDate: string) => void
	handleType: () => void
	type: 'sum' | 'detail'
	resetPagination: () => void
}

export const SalesFilter: React.FC<TProps> = ({ handleFilter, type, handleType, resetPagination }) => {
	const fromDate = useRef<string>(null)
	const toDate = useRef<string>(null)

	return (
		<div className="lg:flex items-end">
			<FilterDate
				placeholder="Chọn tháng"
				format="MM/YYYY"
				picker="month"
				handleDate={(val: any) => {
					fromDate.current = !!val ? moment(val).startOf('month').format('YYYY-MM-DD') : val
					toDate.current = !!val ? moment(val).endOf('month').format('YYYY-MM-DD') : val
				}}
			/>
			<IconButton
				title="Xem thống kê"
				btnIconClass="!mr-2"
				icon="far fa-info-square"
				onClick={() => {
					handleFilter(fromDate.current, toDate.current)
					resetPagination()
				}}
				btnClass={'!mx-4'}
				showLoading
				toolip=""
			/>
			<IconButton
				onClick={handleType}
				icon="far fa-info-square"
				btnIconClass="!mr-2"
				title={type === 'detail' ? 'Xem biểu đồ tổng' : 'Xem biểu đồ chi tiết'}
				showLoading
				toolip=""
			/>
		</div>
	)
}
