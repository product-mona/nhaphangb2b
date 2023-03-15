import { Image, Popover } from 'antd'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, useCallback, useState } from 'react'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import configHomeData from '~/api/config-home'
import { userRouter } from '~/configs/routers'
import { selectFirstPageDashboard, useAppSelector } from '~/store'
import { _format } from '~/utils'
import styles from './index.module.css'

type TProps = {
	hover: boolean
	tabbar: boolean
	handleHover: (bool: boolean) => void
}

const Sidebar: FC<TProps> = ({ handleHover, hover, tabbar }) => {
	const { route } = useRouter()
	const [dropdown, setDropdown] = useState('')
	const handleDropdown = useCallback((name: string) => setDropdown((dropdown) => (dropdown != name ? name : '')), [])
	const firstPage = useAppSelector(selectFirstPageDashboard)
	const [logo, setLogo] = useState('')

	useQuery(['homeConfig'], () => configHomeData.get(), {
		onSuccess: (res) => {
			setLogo(_format.handleRemoveSpace(res?.Data?.LogoIMG))
		},
		onError: toast.error
	})

	return (
		<div
			className={clsx(
				styles.navigation,
				hover && styles.expand,
				tabbar && styles.show,
				'xl:!hidden',
				!hover && 'hidden !min-w-[unset]'
			)}
		>
			<div>
				<Link href="/">
					<a className={clsx(styles.logo)}>
						<span>
							<div className={styles.img}>
								<Image src={logo ? logo : '/logo.png'} width={'100%'} height={'100%'} alt="logo" preview={false} />
								{/* <img src="/small_logo.png" alt="" /> */}
							</div>
						</span>
					</a>
				</Link>
			</div>
			<ul className={`${styles.list} ul-parent`}>
				{userRouter.map((item, index) => (
					<React.Fragment key={index}>
						{item.controllers.map((subItem) => (
							<React.Fragment key={subItem.name}>
								<Menu
									{...{
										...subItem,
										sidebarHovered: hover,
										dropdown: dropdown === subItem.name,
										handleDropdown: () => handleDropdown(subItem.name),
										activeRouter: subItem?.childrens?.some((item) => item.path === route) ?? subItem.path === route
									}}
								/>
							</React.Fragment>
						))}
					</React.Fragment>
				))}
			</ul>
		</div>
	)
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

	// animation
	sidebarHovered: boolean
	activeRouter: boolean
	dropdown: boolean
	handleDropdown: () => void
}

const Menu: FC<TMenu> = ({ icon, sidebarHovered, name, path, childrens, activeRouter, dropdown, handleDropdown }) => {
	return (
		<li onClick={handleDropdown} className={styles.item}>
			{!childrens?.length ? (
				<>
					{(!sidebarHovered && (
						<Popover
							overlayStyle={{ borderRadius: 10 }}
							title={name}
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
									<span className={styles.arrow}>
										<i className="fas fa-angle-right"></i>
									</span>
								)}
							</a>
						</Popover>
					)) || (
						<Link href={path}>
							<a className={clsx(styles.link, activeRouter && styles.active)}>
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
					{(!sidebarHovered && (
						<Popover
							overlayStyle={{ borderRadius: 10 }}
							title={name}
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
									onClick={(e) => {
										e.currentTarget
											.closest('.ul-parent')
											.querySelectorAll('a')
											.forEach((item) => {
												item.classList.remove(`${styles.active}`)
											})
										e.currentTarget.classList.add(`${styles.active}`)
									}}
								>
									<span className={clsx(styles.span, '!mr-2')}>
										<i className={clsx('fas fa-play', styles.icon)} style={{ fontSize: 10, textAlign: 'center' }}></i>
									</span>
									<span className={styles.title}>{children.name}</span>
								</a>
							</Link>
						</li>
					))}
				</ul>
			)}
		</li>
	)
}

export default Sidebar
