import { Menu, Popover, Image, Drawer } from 'antd'
import clsx from 'clsx'
import Cookies from 'js-cookie'
import { cloneDeep } from 'lodash'
import Link from 'next/link'
import router, { useRouter } from 'next/router'
import React, { FC, useCallback, useState } from 'react'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { mainOrder } from '~/api'
import configHomeData from '~/api/config-home'
import { selectConnection, selectRouter, useAppSelector } from '~/store'
import { _format } from '~/utils'
import styles from './index.module.css'

type TProps = {
	hover: boolean
	tabbar: boolean
	handleHover: (bool: boolean) => void
	handleTabbar: (bool: boolean) => void
}

const Sidebar: FC<TProps> = ({ handleHover, hover, tabbar }) => {
	const userNew = useAppSelector((state) => state.user.current)
	const connection = useAppSelector(selectConnection)
	let menuRouter = useAppSelector(selectRouter)
	const [renderMenuRouter, setRenderMenuRouter] = useState(menuRouter)
	const { route } = useRouter()
	const [dropdown, setDropdown] = useState('')
	const handleDropdown = useCallback((name: string) => setDropdown((dropdown) => (dropdown != name ? name : '')), [])
	const [logo, setLogo] = useState('')

	useQuery(['homeConfig'], () => configHomeData.get(), {
		onSuccess: (res) => {
			setLogo(_format.handleRemoveSpace(res?.Data?.LogoIMG))
		},
		onError: (error) => toast.error('Đã xả lỗi!')
	})

	useQuery(
		['count-order'],
		() =>
			mainOrder
				.getCountOrder({
					UID: userNew?.UserId,
					RoleID: userNew?.UserGroupId
				})
				.then((res) => {
					const data = res?.Data
					// const newMenuRouter = [...renderMenuRouter];
					const newMenuRouter = cloneDeep(menuRouter)
					newMenuRouter.forEach((menu) => {
						if (menu?.group === 'Danh sách đơn hàng') {
							const newControllers = [...menu?.controllers]
							newControllers[0].childrens.forEach((newC) => {
								newC.name = `${newC.name} (${data.find((x) => x.Key === newC.key)?.Value})`
							})
						}
					})
					setRenderMenuRouter(newMenuRouter)
				}),
		{
			enabled: userNew?.UserGroupId === 1 || userNew?.UserGroupId === 3 || userNew?.UserGroupId === 4 || userNew?.UserGroupId === 7,
			retry: false
		}
	)
	const onCloseDrawer = () => {
		handleHover(false)
	}
	const renderBigMenu = () => {
		return (
			<Drawer style={{}} width={280} title="Basic Drawer" placement="left" onClose={onCloseDrawer} visible={hover}>
				<div className={clsx(styles.navigation, styles.expand, tabbar && styles.show)}>
					<div className={clsx(styles.logo)}>
						<div className={styles.img}>
							<Link href="/">
								<a>
									<Image src={logo ? logo : '/logo.png'} width={'100%'} alt="logo" preview={false} />

									{/* <img src="/small_logo.png" alt="" /> */}
								</a>
							</Link>
						</div>
					</div>
					<Menu className={clsx(styles.list, '!pb-8')}>
						{renderMenuRouter?.map((item, index) => (
							<React.Fragment key={index}>
								{item.controllers?.map((subItem) => (
									<React.Fragment key={subItem.name}>
										{/** nav menu */}
										<Menus
											{...{
												...subItem,
												sidebarTabbar: tabbar,
												sidebarHovered: hover,
												dropdown: dropdown === subItem.name,
												handleDropdown: () => handleDropdown(subItem.name),
												activeRouter:
													subItem?.childrens?.some((item) => item.path === route) ?? subItem.path === route,
												subItemName: subItem.name,
												handleHover
											}}
										></Menus>
									</React.Fragment>
								))}
							</React.Fragment>
						))}
					</Menu>
				</div>
			</Drawer>
		)
	}
	const renderIconMenu = () => {
		return (
			<>
				<div className={clsx(styles.navigation, hover && styles.expand, tabbar && styles.show)}>
					<div className={clsx(styles.logo)}>
						<div className={styles.img}>
							<Link href="/">
								<a>
									<Image src={logo ? logo : '/logo.png'} width={'100%'} alt="logo" preview={false} />

									{/* <img src="/small_logo.png" alt="" /> */}
								</a>
							</Link>
						</div>
					</div>
					<Menu className={clsx(styles.list)}>
						{renderMenuRouter?.map((item, index) => (
							<React.Fragment key={index}>
								{item.controllers?.map((subItem) => (
									<React.Fragment key={subItem.name}>
										<Menus
											{...{
												...subItem,
												sidebarTabbar: tabbar,
												sidebarHovered: hover,
												dropdown: dropdown === subItem.name,
												handleDropdown: () => handleDropdown(subItem.name),
												activeRouter:
													subItem?.childrens?.some((item) => item.path === route) ?? subItem.path === route,
												subItemName: subItem.name,
												handleHover
											}}
										></Menus>
									</React.Fragment>
								))}
							</React.Fragment>
						))}
					</Menu>
					<div className={styles.sidebarFooter}>
						{!hover ? (
							<Popover
								title={'Thông tin người dùng'}
								placement="rightBottom"
								content={
									<li key={'Thông tin người dùng'} className="w-fit p-4 font-bold text-base">
										<Link href={'/user/info-users'}>
											<a className="popover-a">
												<span>
													<i
														className={clsx('fas fa-play', styles.icon)}
														style={{
															fontSize: 10,
															textAlign: 'center',
															padding: 0
														}}
													></i>
												</span>
												<span className="ml-4">Thông tin cá nhân</span>
											</a>
										</Link>
									</li>
								}
							>
								<div className={styles.item}>
									<Link href={'/user/info-users'}>
										<a className={clsx(styles.link)}>
											<span className={clsx(styles.span)}>
												<i className={clsx('fas fa-user-tag', styles.icon)}></i>
											</span>
											<span className={styles.title}>Thông tin người dùng</span>
										</a>
									</Link>
								</div>
							</Popover>
						) : (
							<div className={styles.item}>
								<Link href={'/user/info-users'}>
									<a className={clsx(styles.link)}>
										<span className={clsx(styles.span)}>
											<i className={clsx('fas fa-user-tag', styles.icon)}></i>
										</span>
										<span className={styles.title}>Thông tin người dùng</span>
									</a>
								</Link>
							</div>
						)}
						{!hover ? (
							<Popover
								title={'Đăng xuất'}
								placement="rightBottom"
								content={
									<li key={'Đăng xuất'} className="w-fit p-4 font-bold text-base">
										<a
											className="popover-a"
											onClick={async () => {
												connection &&
													(await connection.invoke(
														'leave',
														userNew.UserId.toString(),
														userNew.UserGroupId.toString()
													))
												router.push('/')
												localStorage.removeItem('currentUser')
												Cookies.remove('tokenNHTQ-nhaphangb2b')
											}}
										>
											<span>
												<i
													className={clsx('fas fa-play', styles.icon)}
													style={{
														fontSize: 10,
														textAlign: 'center',
														padding: 0
													}}
												></i>
											</span>
											<span className="ml-4">Đăng xuất</span>
										</a>
									</li>
								}
							>
								<div className={styles.item}>
									<a className={styles.link}>
										<span className={clsx(styles.span)}>
											<i className={`fas fa-sign-out-alt ${styles.icon}`}></i>
										</span>
										<span className={styles.title}>Đăng xuất</span>
									</a>
								</div>
							</Popover>
						) : (
							<div className={styles.item}>
								<a
									className={styles.link}
									onClick={async () => {
										connection &&
											(await connection.invoke('leave', userNew.UserId.toString(), userNew.UserGroupId.toString()))
										router.push('/')
										localStorage.removeItem('currentUser')
										Cookies.remove('tokenNHTQ-nhaphangb2b')
									}}
								>
									<span className={clsx(styles.span)}>
										<i className={`fas fa-sign-out-alt ${styles.icon}`}></i>
									</span>
									<span className={styles.title}>Đăng xuất</span>
								</a>
							</div>
						)}
					</div>
				</div>
			</>
		)
	}
	return <>{hover ? <>{renderBigMenu()}</> : <>{renderIconMenu()}</>}</>
}

type TMenu = {
	// router
	path: string
	icon: string
	name: string
	childrens?: {
		path: string
		name: string
	}[]
	subItemName: string

	// animation
	sidebarHovered: boolean
	sidebarTabbar: boolean
	activeRouter: boolean
	dropdown: boolean
	handleDropdown: () => void
	handleHover: (bool: boolean) => void
}

const Menus: FC<TMenu> = ({
	icon,
	sidebarHovered,
	name,
	path,
	childrens,
	activeRouter,
	dropdown,
	subItemName,
	handleDropdown,
	sidebarTabbar,
	handleHover
}) => {
	return (
		<ul>
			<li onClick={handleDropdown} className={styles.item}>
				{!childrens?.length ? (
					<>
						{(!sidebarHovered && !sidebarTabbar && (
							<Popover
								overlayStyle={{ borderRadius: 10 }}
								title={subItemName}
								placement="rightTop"
								content={
									<li key={name} className="w-fit p-4 font-bold text-base">
										<Link href={path}>
											<a className="popover-a">
												<span>
													<i
														className={clsx('fas fa-play', styles.icon)}
														style={{
															fontSize: 10,
															textAlign: 'center',
															padding: 0
														}}
													></i>
												</span>
												<span className="ml-4">{name}</span>
											</a>
										</Link>
									</li>
								}
							>
								<a className={clsx(styles.link, activeRouter && styles.active)}>
									<span className={clsx(styles.span)}>
										<i className={clsx(icon, styles.icon)}></i>
									</span>
									<span className={styles.title}>{name}</span>
									{!!childrens?.length && (
										<span
											className={clsx(
												styles.arrow,
												((sidebarHovered && activeRouter) || (dropdown && sidebarHovered)) && 'rotate-90'
											)}
										>
											<i className="fas fa-angle-right"></i>
										</span>
									)}
								</a>
							</Popover>
						)) || (
							<Link href={path === 'javascript;' ? null : path}>
								<a
									className={clsx(styles.link, activeRouter && styles.active)}
									onClick={(e) => {
										e.currentTarget
											.closest('ul.ant-menu')
											.querySelectorAll('a')
											.forEach((item) => {
												item.classList.remove(`${styles.active}`)
												handleHover(false)
											})
									}}
								>
									<span className={clsx(styles.span)}>
										<i className={clsx(icon, styles.icon)}></i>
									</span>
									<span className={styles.title}>{name}</span>
									{!!childrens?.length && (
										<span className={styles.arrow}>
											<i className="fas fa-angle-right"></i>
										</span>
									)}
								</a>
							</Link>
						)}
					</>
				) : (
					<>
						{(!sidebarHovered && !sidebarTabbar && (
							<Popover
								overlayStyle={{ borderRadius: 10 }}
								title={subItemName}
								placement="rightTop"
								content={childrens?.map((children) => (
									<li key={children.name} className="w-fit p-4 font-bold text-base">
										<Link href={children.path}>
											<a className="popover-a">
												<span>
													<i
														className={clsx('fas fa-play', styles.icon)}
														style={{
															fontSize: 10,
															textAlign: 'center',
															padding: 0
														}}
													></i>
												</span>
												<span className="ml-4">{children.name}</span>
											</a>
										</Link>
									</li>
								))}
							>
								<a className={clsx(styles.link, activeRouter && styles.active)}>
									<span className={clsx(styles.span)}>
										<i className={clsx(icon, styles.icon)}></i>
									</span>
									<span className={styles.title}>{name}</span>
									{!!childrens?.length && (
										<span
											className={clsx(
												styles.arrow,
												((sidebarHovered && activeRouter) || (dropdown && sidebarHovered)) && 'rotate-90'
											)}
										>
											<i className="fas fa-angle-right"></i>
										</span>
									)}
								</a>
							</Popover>
						)) || (
							// activeRouter && styles.active
							<a className={clsx(styles.link)}>
								<span className={clsx(styles.span)}>
									<i className={clsx(icon, styles.icon)}></i>
								</span>
								<span className={styles.title}>{name}</span>
								{!!childrens?.length && (
									<span
										className={clsx(
											styles.arrow,
											((sidebarHovered && activeRouter) || (dropdown && sidebarHovered)) && 'rotate-90'
										)}
									>
										<i className="fas fa-angle-right"></i>
									</span>
								)}
							</a>
						)}
					</>
				)}
				{!!childrens?.length && (
					<ul
						className={styles.dropdown}
						style={{
							height: (sidebarHovered && activeRouter) || (dropdown && sidebarHovered) ? 56 * childrens.length : 0
						}}
					>
						{childrens.map((children) => (
							<li key={children.name} className={styles.item}>
								<Link href={children.path}>
									<a
										className={clsx(styles.link)}
										id={children.path}
										onClick={(e) => {
											e.currentTarget
												.closest('ul.ant-menu')
												.querySelectorAll('a')
												.forEach((item) => {
													item.classList.remove(`${styles.active}`)
												})
											e.currentTarget.classList.add(`${styles.active}`)
											handleHover(false)
										}}
									>
										<span className={clsx(styles.span)}>
											<i
												className={clsx('fas fa-play', styles.icon)}
												style={{ fontSize: 10, textAlign: 'center' }}
											></i>
										</span>
										<span className={styles.title}>{children.name}</span>
									</a>
								</Link>
							</li>
						))}
					</ul>
				)}
			</li>
		</ul>
	)
}

export default Sidebar
