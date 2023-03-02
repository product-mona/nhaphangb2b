import React, {useRef} from "react";
import {FilterInput, FilterSelect, IconButton} from "~/components";
import {paymentData} from "~/configs";

type TProps = {
	handleFilter: (newFilter) => void;
	handleExportExcel: () => void;
};

export const PersonalRechargeFilter: React.FC<TProps> = ({handleFilter, handleExportExcel}) => {
	const SearchContent = useRef(null);
	const Status = useRef(null);

	return (
		<div className="flex items-end justify-between py-2 mb-4">
			<div className="col-span-1 xl:pb-0 pb-4 grid grid-cols-3 gap-4">
				<FilterInput
					placeholder="Username"
					id="UserName"
					name="Nhập username"
					label="UserName"
					inputClassName="max-w-[500px] !w-[unset]"
					allowClear
					handleSearch={(val: string) => (SearchContent.current = val.trim())}
				/>
				<FilterSelect
					data={[
						{name: "Chờ duyệt", id: 1},
						{name: "Đã duyệt", id: 2},
						{name: "Hủy", id: 3},
					]}
					label="Trạng thái"
					isClearable
					placeholder="Chọn trạng thái"
					handleSearch={(val: number) => (Status.current = val)}
				/>
				<IconButton
					onClick={() =>
						handleFilter({
							SearchContent: SearchContent.current,
							Status: Status.current,
							PageIndex: 1,
						})
					}
					icon="fas fa-filter"
					btnClass="w-fit self-end"
					title="Lọc"
					showLoading
					toolip="Lọc"
				/>
			</div>
			<IconButton
				onClick={() => handleExportExcel()}
				icon="fas fa-file-export"
				title="Xuất"
				showLoading
				toolip="Xuất thống kê"
				green
			/>
		</div>
	);
};
