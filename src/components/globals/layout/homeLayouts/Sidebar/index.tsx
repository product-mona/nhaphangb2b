import { Menu, TablePaginationConfig } from 'antd'
import SubMenu from 'antd/lib/menu/SubMenu'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { pageType } from '~/api'
import { showToast } from '~/components'
import { defaultPagination } from '~/configs/appConfigs'
import styles from './index.module.css'

export const HomeSidebar = () => {
	const router = useRouter()
	const [pagination, setPagination] = useState<TablePaginationConfig>(defaultPagination)
	const [newItems, setNewItems] = useState([])
	const [keys, setKeys] = useState(
		router?.query?.code?.toString().includes('/') ? [router?.query?.code?.toString().split('/')[0]] : [router?.query?.code?.toString()]
	)

	useEffect(() => {
		setKeys(
			router?.query?.code?.toString().includes('/')
				? [router?.query?.code?.toString().split('/')[0]]
				: [router?.query?.code?.toString()]
		)
	}, [router?.query])

	useQuery(
		['pageType', { Current: pagination.current, PageSize: pagination.pageSize }],
		() =>
			pageType.getList({
				PageIndex: pagination.current,
				PageSize: 1000,
				OrderBy: ' PT.Position ',
				Active: true
			}),
		{
			onSuccess: (data) => {
				setPagination({ ...pagination, total: data?.Data?.TotalItem })
				const newItems = data?.Data?.Items.map((item) => {
					const newPage = JSON.parse(item?.PagesJson)
					return {
						...item,
						SubMenu: newPage
					}
				})
				setNewItems(newItems)
			},
			onError: (error) =>
				showToast({
					title: 'Đã xảy ra lỗi!',
					message: (error as any)?.response?.data?.ResultMessage,
					type: 'error'
				})
		}
	)

	return (
		<div className={styles.wrapperChuyenMuc}>
			<div className="font-bold text-[#fff] bg-[#4a8916] p-4 text-base uppercase border-0">Chuyên mục</div>
			<div className={styles.sidebar}>
				<Menu
					mode="inline"
					onOpenChange={(openKeys) => {
						setKeys([openKeys[openKeys.length - 1]] ?? [])
					}}
					openKeys={keys}
				>
					{newItems.map((item) =>
						item?.Active === true && item?.SubMenu !== null ? (
							// ${item?.Code === keys[0].split("/")[0] && "ant-menu-submenu-open ant-menu-submenu-active"}
							<SubMenu
								className={`chuyen-muc-subMenu`}
								key={item?.Code}
								title={
									<a
										className={`${styles.aMain}`}
										onClick={() =>
											router.push({
												pathname: '/chuyen-muc',
												query: { code: item?.Code }
											})
										}
									>
										{item?.Name}
									</a>
								}
							>
								{item?.SubMenu?.map((sub) => (
									<Menu.Item key={sub?.Code} className={`${styles.liSubMenu}`}>
										<a
											onClick={() => {
												router.push({
													pathname: '/chuyen-muc/detail',
													query: { code: sub?.Code }
												})
											}}
										>
											{sub?.Title}
										</a>
									</Menu.Item>
								))}
							</SubMenu>
						) : (
							<Menu.Item key={item?.Code} className={item?.Code === keys[0] && 'ant-menu-item-selected'}>
								<a
									className={styles.aMain}
									onClick={() =>
										router.push({
											pathname: '/chuyen-muc',
											query: { code: item?.Code }
										})
									}
								>
									{item?.Name}
								</a>
							</Menu.Item>
						)
					)}
				</Menu>
				{/* <Menu>
					{newItems[5]?.SubMenu?.map((sub) => (
						<Menu.Item key={sub?.Code} className={`${styles.liSubMenu}`}>
							<a
								onClick={() => {
									router.push({
										pathname: '/chuyen-muc/detail',
										query: { code: sub?.Code }
									})
								}}
							>
								{sub?.Title}
							</a>
						</Menu.Item>
					))}
				</Menu> */}
			</div>
		</div>
	)
}
