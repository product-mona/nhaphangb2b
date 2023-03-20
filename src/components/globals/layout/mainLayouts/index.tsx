import { BackTop } from 'antd'
import clsx from 'clsx'
import router, { useRouter } from 'next/router'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import OneSignal from 'react-onesignal'
import { user } from '~/api'
import { firstPageDirect } from '~/configs'
import { useAppSelector } from '~/store'
import { TlayoutWithChild } from '~/types/layout'
import AuthLayoutProtector from '../authLayouts/AuthlayoutProtector'
import Footer from './Footer'
import Header from './Header'
import styles from './index.module.css'
import Sidebar from './Sidebar'
import UserSidebar from './Sidebar/UserSidebar'

type TProps = {
	breadcrumb?: string
	userPage?: boolean
}

function handleCheckAccessPage(userGroupId: number) {
	const pathname = router.pathname
	const pagePush = firstPageDirect.find((item) => item.id === userGroupId)

	if (pathname.includes('/user') || pathname.includes('/notification')) return

	switch (userGroupId) {
		case 2:
			if (pagePush.allowPath[0].split('/')[1] !== pathname?.split('/')[1]) {
				router.push(pagePush.page)
			}
			break
		case 3:
			for (let path in pagePush.denyPath) {
				if (pathname.includes(pagePush.denyPath[path])) {
					return router.push(pagePush.page)
				}
			}
			break
		case 4:
			if (pagePush.allowPath.findIndex((item) => item === pathname) === -1) {
				router.push(pagePush.page)
			}
			break
		case 5:
			if (pagePush.allowPath.findIndex((item) => item === pathname) === -1) {
				router.push(pagePush.page)
			}
			break
		case 6:
			if (pagePush.allowPath.findIndex((item) => item === pathname) === -1) {
				router.push(pagePush.page)
			}
			break
		case 7:
			if (pagePush.allowPath.findIndex((item) => item === pathname) === -1) {
				router.push(pagePush.page)
			}
			break
		case 8:
			if (pagePush.allowPath.findIndex((item) => item === pathname) === -1) {
				router.push(pagePush.page)
			}
			break
		default:
			break
	}
}

export const Layout: TlayoutWithChild & React.FC<TProps> = ({ children, userPage, breadcrumb }) => {
	const router = useRouter()
	const userNew = useAppSelector((state) => state.user.current)
	const ids = useAppSelector((state) => state?.user?.current)?.UserId

	useEffect(() => {
		// OneSignal.setSubscription(true)
		OneSignal.init({ appId: '86419110-33f6-4e71-b73b-54bd86b5f99a' })

		// .then(() => {
		// 	OneSignal.showSlidedownPrompt();
		// });

		// OneSignal.on("popoverShown", function () {
		// 	console.log("Slide Prompt Shown");
		// });

		OneSignal.on('subscriptionChange', async () => {
			const userData = await user.getByID(ids)
			const data = userData?.Data

			OneSignal.getUserId(async (userId) => {
				const res = await user.update({ ...data, OneSignalPlayerID: userId })
			})
		})
	}, [])

	const [hover, setHover] = useState(false)
	const handleHover = useCallback((bool: boolean) => setHover(bool), [])

	const [tabbar, setTabbar] = useState(false)
	const handleTabbar = useCallback((bool: boolean) => setTabbar(bool), [])

	const userGroupId = userNew?.UserGroupId
	if (userGroupId !== 1) {
		handleCheckAccessPage(userGroupId)
	}

	useEffect(() => {
		setHover(false)
	}, [router])

	return (
		<AuthLayoutProtector>
			<div className={styles.container}>
				{userPage === true ? (
					<UserSidebar {...{ hover, handleHover, tabbar, handleTabbar }} />
				) : (
					<Sidebar {...{ hover, handleHover, tabbar, handleTabbar }} />
				)}
				{/* <div className={clsx(hover && styles.overlay)} onClick={() => setHover(!hover)}></div> */}
				<div className={clsx(styles.wrapper, userPage && '!pl-0')}>
					<Header
						{...{
							handleTabbar,
							tabbar,
							hover,
							handleHover,
							userPage
						}}
					/>
					<main className={clsx(styles.main, userPage === true && '!p-0 xl:!w-[100%]')}>
						<div
							className={clsx(styles.mainContent, 'bg-transparent w-full items-center pb-[70px]', !!userPage && 'pt-[54px]')}
						>
							<div className={`${!userPage && 'container-admin'}`}>
								{breadcrumb && userPage !== true && <div className={clsx(styles.breadcrumb)}>{breadcrumb}</div>}

								{/** content và nav của user ở trong children not here */}
								{children}
							</div>
						</div>
						<BackTop className="!right-[2%]">
							<div className="hover:animate-bounce delay-1000">
								<i className="fas fa-angle-double-up text-[#fff] hover:text-[#eea387] bg-main text-xl py-[14px] px-[18px] rounded-3xl shadow-xl hover:bg-[#f8dfd5]"></i>
							</div>
						</BackTop>
						<Footer {...{ hover, userPage }} />
					</main>
					<div className={clsx(styles.decoration, userPage && '!bg-[#eceff1]')} />
				</div>
			</div>
		</AuthLayoutProtector>
	)
}

Layout.getLayout = (page: ReactElement) => <Layout>{page}</Layout>
