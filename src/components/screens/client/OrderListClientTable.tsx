import { Tag } from 'antd';
import React from 'react';
import { DataTable } from '~/components';
import { TColumnsType, TTable } from '~/types/table';
import { _format } from '~/utils';

export const OrderListClientTable: React.FC<TTable<TOrder>> = ({
	data,
	handlePagination,
	pagination
}) => {


	const columns: TColumnsType<TOrder> = [
		{
			dataIndex: 'Id',
			title: 'ID',
			align: 'center'
		},
		{
			dataIndex: 'ImageOrigin',
			title: 'Ảnh sản phẩm',
			align: 'center',
			render: (img, record) => (
				<div className='flex justify-center'>
					<img
						src={img ? img : "/pro-empty.jpg"}
						alt={`Product image ${record.Id}`}
						width={78}
						height={78}
					/>
				</div>
			)
		},
		{
			dataIndex: 'TotalOrderAmount',
			title: 'Tổng tiền',
			align: 'center',
			render: (money) => _format.getVND(money, "")
		},
		{
			dataIndex: 'OrderType',
			title: 'Loại',
			align: 'center'
		},
		{
			dataIndex: 'OrdererUserName',
			title: 'Nhân viên đặt hàng',
			align: 'center'
		},
		{
			dataIndex: 'SalerUserName',
			title: 'Nhân viên kinh doanh',
			align: 'center'
		},
		{
			dataIndex: 'Created',
			title: 'Ngày đặt',
			align: 'center',
			render: (date) => _format.getVNDate(date)
		},
		{
			dataIndex: 'StatusName',
			title: 'TRẠNG THÁI',
			align: 'center',
			render: (status, record) => (
				<Tag color={record.Status === 1 ? 'green' : 'orange'}>{status}</Tag>
			),
			responsive: ['lg']
		},
		// {
		// 	dataIndex: 'action',
		// 	title: 'Thao tác',
		// 	align: 'center'
		// }
	];

	return (
		<DataTable {...{ pagination, data, onChange: handlePagination, columns }} />
	);
};
