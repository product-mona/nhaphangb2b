import React, {useRef} from "react";
import {FilterRangeDate, FilterSelect} from "~/components";
import {IconButton} from "~/components/globals/button/IconButton";
import {categoryPaymentData, ECategoryPaymentData} from "~/configs/appConfigs";

type TProps = {
	handleFilter: (newFilter) => void;
};

export const HistoryTransactionVNDFilter: React.FC<TProps> = ({handleFilter}) => {
	const FromDate = useRef<string>(null);
	const ToDate = useRef<string>(null);
	const Status = useRef<ECategoryPaymentData>(0);

	return (
		<div className="mb-4 md:mb-0">
			<div className="sm:grid sm:grid-cols-3 md:gap-4 gap-2 w-full">
				<div className="col-span-1 sm:mb-0 mb-4">
					<FilterRangeDate
						format="DD/MM/YYYY"
						placeholder="Từ ngày / đến ngày"
						handleDate={(val: string[]) => {
							FromDate.current = val[0];
							ToDate.current = val[1];
						}}
					/>
				</div>
				<div className="col-span-1 sm:mb-0 mb-4">
					<FilterSelect
						placeholder="Chọn trạng thái"
						label="Trạng thái"
						data={categoryPaymentData}
						isClearable={true}
						handleSearch={(val: ECategoryPaymentData) => (Status.current = val)}
					/>
				</div>
				<div className="col-span-1 text-left sm:mb-0 mb-4 flex items-end justify-start">
					<IconButton
						onClick={() =>
							handleFilter({
								fromDate: FromDate.current,
								toDate: ToDate.current,
								status: Status.current,
							})
						}
						btnClass="!mr-2"
						btnIconClass="!mr-2"
						title="Lọc"
						toolip="Lọc kết quả"
						icon="fas fa-filter"
					/>
				</div>
			</div>
		</div>
	);
};
