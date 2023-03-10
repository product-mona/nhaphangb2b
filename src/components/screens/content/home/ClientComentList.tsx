import { Tag, Image } from 'antd'
import React, { useRef, useState } from 'react'
import { ActionButton, DataTable } from '~/components'
import { TColumnsType, TTable } from '~/types/table'
import { _format } from '~/utils'
import { ClientCommentForm } from './ClientCommentForm'

export const ClientComentList: React.FC<TTable<TCustomerBenefit> & { refetchcustomerComment }> = ({ data, refetchcustomerComment }) => {
	const columns: TColumnsType<TCustomerBenefit> = [
		{
			dataIndex: 'Id',
			title: 'Vị trí',
			render: (_, __, index) => index + 1,
			width: 50
		},
		{
			dataIndex: 'IMG',
			align: 'center',
			title: 'Ảnh',
			render: (_, record) => {
				return (
					<Image src={record?.IMG ? record.IMG : '/pro-empty.jpg'} preview={false} className="!h-[60px] !w-[60px] rounded-full" />
				)
			},
			width: 120
		},
		{
			dataIndex: 'Name',
			title: 'Tên khách hàng',
			width: 120
		},
		{
			dataIndex: 'Active',
			title: 'Trạng thái',
			render: (_, record) => <Tag color={record?.Active ? 'green' : 'red'}>{record?.Active ? 'Hiện' : 'Ẩn'}</Tag>,
			width: 120
		},
		{
			dataIndex: 'Description',
			title: 'Nội dung nhận xét',
			responsive: ['xl']
		},
		{
			dataIndex: 'Created',
			title: 'Ngày tạo',
			render: (date) => _format.getVNDate(date),
			width: 200
		},
		{
			dataIndex: 'action',
			align: 'right',
			title: 'Thao tác',
			render: (_, record) => <ActionButton icon="fas fa-edit" onClick={() => handleModal(record)} title="Cập nhật" />,
			width: 80
		}
	]

	const item = useRef<TCustomerBenefit>()
	const [modal, setModal] = useState(false)
	const handleModal = (itemSelected: TCustomerBenefit) => {
		item.current = itemSelected
		setModal(true)
	}

	const expandable = {
		expandedRowRender: (record) => (
			<ul className="px-2 text-xs">
				<li className="flex justify-between py-2">
					<span className="font-medium mr-4">Nội dung:</span>
					{record?.Description}
				</li>
			</ul>
		)
	}

	return (
		<React.Fragment>
			<DataTable
				{...{
					columns,
					data,
					title: 'DANH SÁCH KHÁCH HÀNG NHẬN XÉT',
					expandable: expandable
				}}
			/>
			<ClientCommentForm
				{...{
					onCancel: () => setModal(false),
					visible: modal,
					defaultValues: item?.current,
					refetchcustomerComment: refetchcustomerComment
				}}
			/>
		</React.Fragment>
	)
}
