import moment from 'moment'
import React, { useRef } from 'react'
import { FilterDate, FilterRangeDate, IconButton } from '~/components'

type TProps = {
	handleFilter: (newFilter) => void
}

export const PurchaseProfiltFilter: React.FC<TProps> = ({ handleFilter }) => {
	const fromDate = useRef<string>(null)
	const toDate = useRef<string>(null)

	return (
		<div className="grid grid-cols-4 gap-4">
			<div className="col-span-1">
				<FilterDate
					placeholder="Chọn tháng"
					format="MM/YYYY"
					picker="month"
					handleDate={(val: any) => {
						fromDate.current = !!val ? moment(val).startOf('month').format('YYYY-MM-DD') : val
						toDate.current = !!val ? moment(val).endOf('month').format('YYYY-MM-DD') : val
					}}
				/>
			</div>
			<div className="col-span-1 xl:mt-0 mt-4 flex items-end ">
				<IconButton
					title="Lọc"
					icon="fas fa-filter"
					onClick={() => {
						handleFilter({
							FromDate: fromDate.current,
							ToDate: toDate.current
						})
					}}
					btnClass="md:mx-4 !mx-0"
					showLoading
					toolip=""
				/>
			</div>
		</div>
	)
}
