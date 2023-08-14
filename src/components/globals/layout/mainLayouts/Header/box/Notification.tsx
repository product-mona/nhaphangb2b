import { Tabs, Tag } from 'antd'
import router from 'next/router'
import { useRef, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { getAllNewNotify, notification } from '~/api'
import { _format } from '~/utils'

const templateTabs = [
	{
		tab: 'Tất cả',
		key: 4
	},
	{
		tab: 'Tài chính',
		key: 1
	},
	{
		tab: 'Đơn hàng',
		key: 2
	},
	{
		tab: 'Giỏ hàng',
		key: 5
	},
	{
		tab: 'Khiếu nại',
		key: 3
	}
]

const notiItem = ` cursor-pointer hover:!bg-[#b7f8e9] hover:!ml-[10px] transition-all
flex items-center justify-between text-[#333] border border-[#E9F6F3] font-[600] my-[6px] p-[9px]`
const notiItemContent = `flex flex-col`
const iconLoading = `mt-[40vh] flex item-center justify-center text-main text-[44px]`
const loadMore =
	'py-2 px-5 font-bold my-6 border border-[#5F9D46] text-[#5F9D46] bg-[#EFF5EC] rounded-[4px] hover:!bg-[#5F9D46] hover:!text-[#fff] transition-all cursor-pointer'

const NotiItem = ({ item, close }) => {
	const queryClient = useQueryClient()
	return (
		<div
			className={notiItem}
			style={{ backgroundColor: item.IsRead ? '#fff' : '#E9F6F3' }}
			onClick={() => {
				if (!item.IsRead) {
					item.IsRead = true
					getAllNewNotify.readNotify([item.Id]).then(() => {
						queryClient.invalidateQueries('new-notification')
					})
				}
				close()
				router.push(`${item.Url}`)
			}}
		>
			<div className={notiItemContent}>
				<span>{item.NotificationContent}</span>
				<span className="text-[12px] font-normal">{_format.getVNDate(item.Created)}</span>
			</div>
		</div>
	)
}

const Notification = ({ filter, setFilter, isFetching, list, isLoading, totalItems, onClose }) => {
	return (
		<Tabs
			defaultActiveKey="4"
			onTabClick={(key) => {
				setFilter({ ...filter, PageIndex: 1, Type: Number(key) })
			}}
		>
			{templateTabs.map((tm) => (
				<Tabs.TabPane key={tm.key} tab={tm.tab}>
					{!isFetching && list?.map((item) => <NotiItem item={item} key={item?.Id} close={onClose} />)}
					{(isLoading || isFetching) && (
						<div className={iconLoading} key={tm.key}>
							<i className="fas fa-spinner fa-spin"></i>
						</div>
					)}
					{list.length < totalItems.current && list.length > 0 && !isLoading && !isFetching && (
						<div
							className="text-center py-4"
							key={tm.key}
							onClick={() => {
								setFilter({ ...filter, PageIndex: filter.PageIndex + 1 })
							}}
						>
							<span className={loadMore}>XEM THÊM</span>
						</div>
					)}
					{list.length === 0 && !isLoading && !isFetching && (
						<div className={`${iconLoading} flex flex-col justify-center items-center`}>
							<i className="fas fa-bell-slash text-[60px] mb-[20px]"></i>
							<span className="text-[18px]">KHÔNG CÓ THÔNG BÁO!</span>
						</div>
					)}
				</Tabs.TabPane>
			))}
		</Tabs>
	)
}

export default Notification
