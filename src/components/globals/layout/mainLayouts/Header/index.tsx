import { Avatar as AvatarAntd, Drawer, Image, Tag, Tooltip } from 'antd'
import clsx from 'clsx'
import Cookies from 'js-cookie'
import Link from 'next/link'
import router, { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { default as AvatarName } from 'react-avatar'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { getAllNewNotify, notification, user } from '~/api'
import configHomeData from '~/api/config-home'
import { showToast } from '~/components'
import { getLevelId } from '~/configs'
import { selectConnection, selectFirstPageDashboard, useAppSelector } from '~/store'
import { _format } from '~/utils'
import Notification from './box/Notification'
import styles from './index.module.css'
import { toast } from 'react-toastify'

type TProps = {
	tabbar: boolean
	handleTabbar: (bool: boolean) => void
	hover: boolean
	handleHover: (bool: boolean) => void
	userPage?: boolean
}

const NotificationComponent = ({ userPage, userNew, ids }) => {
	const [visible, setVisible] = useState(false)
	const router = useRouter()

	const [list, setList] = useState([])
	const totalItems = useRef(0)
	const TypeFilter = useRef(4)

	const [filter, setFilter] = useState({
		Type: TypeFilter.current,
		OfEmployee: userPage ? false : true,
		UID: userNew?.UserId,
		PageIndex: 1,
		PageSize: 20,
		IsRead: 2
	})

	const { isLoading, isFetching, refetch } = useQuery(['notification', { filter }], () => notification.getList(filter), {
		onSuccess: (res) => {
			if (res?.Data.Items.length <= 0) {
				setList([]);
				return
			}
			totalItems.current = res?.Data?.TotalItem
			let newList = []
			if (filter.Type !== TypeFilter.current) {
				newList = res?.Data?.Items
			} else {
				newList = [...list, ...res?.Data?.Items]
			}
			setList(newList)
			TypeFilter.current = filter.Type
		},
		onError: (error) => toast.error(error),
		retry: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		enabled: !!userNew?.UserId
	})

	const { data: dataNewNotify, refetch: notiTotalRefetch } = useQuery(
		['new-notification'],
		() =>
			getAllNewNotify
				.getAll({
					OfEmployee: userPage ? false : true
				})
				.then((res) => {
					return res?.Data
				}),
		{
			onError: (error) => {
				showToast({
					title: 'Đã xảy ra lỗi!',
					message: (error as any)?.response?.data?.ResultMessage,
					type: 'error'
				})
			},
			enabled: !!userNew,
			retry: false
		}
	)

	return (
		<li className={clsx(styles.item, 'col-span-1 cursor-pointer', dataNewNotify >= 100 ? 'mr-[40px]' : 'mr-[10px]')}>
			<div className={clsx(styles.block, styles.actionInfo, '!flex')} onClick={() => setVisible(true)}>
				<div className={`text-[20px] text-[#fff] ${dataNewNotify > 0 && styles.bellIcon}`}>
					<i className="fas fa-bell"></i>
				</div>
				{dataNewNotify > 0 && (
					<div
						className={`text-[12px]  items-center flex bg-[#ed6868] rounded-full absolute px-[10px] top-[50%] left-[50%] translate-y-[-90%]`}
					>
						<span className="items-center flex text-[#fff]">{dataNewNotify >= 100 ? '100+' : dataNewNotify}</span>
					</div>
				)}
			</div>
			<Drawer
				title="Thông báo"
				placement="right"
				visible={visible}
				width={'440px'}
				maskStyle={{
					backgroundColor: '#00000070'
				}}
				onClose={() => setVisible(false)}
				closeIcon={false}
				closable={false}
				extra={
					<div className="flex gap-4 items-center">
						{dataNewNotify > 0 && (
							<Tag
								color="blue"
								onClick={() => {
									getAllNewNotify
										.readAll({
											uid: userNew?.UserId,
											isEmployee: router.asPath.includes('/user') ? 0 : 1
										})
										.then(() => {
											refetch();
											notiTotalRefetch();
										})
								}}
								className="cursor-pointer"
							>
								Đọc tất cả!
							</Tag>
						)}
						<Link href={`${userPage === true ? '/user' : '/manager'}/notification`}>
							<Tag color="#073238">
								<a onClick={() => setVisible(false)} className="!text-[#fff]">
									Tất cả thông báo!
								</a>
							</Tag>
						</Link>
					</div>
				}
			>
				<Notification
					onClose={() => setVisible(false)}
					filter={filter}
					setFilter={setFilter}
					isFetching={isFetching}
					list={list}
					isLoading={isLoading}
					totalItems={totalItems}
				/>
			</Drawer>
		</li>
	)
}

const Header: React.FC<TProps> = ({ hover, handleTabbar, handleHover, userPage }) => {
	const userNew = useAppSelector((state) => state.user.current)
	const ids = useAppSelector((state) => state?.user?.current)?.UserId
	const firstPage = useAppSelector(selectFirstPageDashboard)
	const connection = useAppSelector(selectConnection)
	const [dataList, setDataList] = useState([])
	const [configData, setConfigData] = useState<any>({})
	const { route } = useRouter()
	const isUserRoute = route.split('/')[1].includes('user')

	const { reset } = useForm<TUser>({
		mode: 'onBlur'
	})
	const connectionId = connection?.connectionId

	useEffect(() => {
		if (!connectionId) return
		connection.on('send-notification', (noti) => {
			return dataList.unshift(noti)
		})
	}, [connectionId])

	const { data: dataUser } = useQuery(['clientData', ids], () => user.getByID(ids), {
		onSuccess: (data) => {
			reset(data.Data)
		},
		onError: (error) => {
			showToast({
				title: 'Đã xảy ra lỗi!',
				message: (error as any)?.response?.data?.ResultMessage,
				type: 'error'
			})
		},
		retry: false,
		enabled: !!userNew
	})

	useQuery(['homeConfig'], () => configHomeData.get(), {
		onSuccess: (res) => {
			const data = res?.Data
			setConfigData(data)
		},
		onError: (error) => {
			showToast({
				title: 'Đã xảy ra lỗi!',
				message: (error as any)?.response?.data?.ResultMessage,
				type: 'error'
			})
		}
	})

	return (
		<>
			<header
				className={clsx(
					styles.header,
					'xl:flex xl:w-unset sm:fixed xl:relative sm:h-[54px] xl:h-fit ',
					userPage !== true && `!fixed !h-[54px] ${styles.headerManager}`,
					userPage && 'xl:!w-[100%]'
				)}
			>
				<div className="flex">
					{!hover && (
						<div className={clsx(styles.menuAction, 'block', userPage && 'xl:!hidden', hover && '!pl-[265px]')}>
							<button className={clsx(styles.action, 'text-[#fff]')} onClick={() => handleHover(!hover)}>
								<div className={styles.openMenu}>
									<i className="fas fa-align-left"></i>
								</div>
							</button>
						</div>
					)}
				</div>
				{isUserRoute && (
					<div className="sm:hidden xl:block relative mr-auto p-3">
						<Link href="/">
							<a className={clsx(styles.logo, 'block')}>
								<div className={`${styles.img} w-[50px]`}>
									<Image
										src={configData?.LogoIMG ? configData?.LogoIMG : '/logo.png'}
										width={'3rem'}
										height={'100%'}
										alt="logo"
										preview={false}
										className='bg-white rounded-sm'
									/>
								</div>
							</a>
						</Link>
					</div>
				)}
				<ul className={`${styles.wrapper} grid-cols-3`}>
					<li className={clsx(styles.item, 'col-span-1')}>
						<div className={clsx(styles.block)}>
							{userPage === true && userNew?.UserGroupId !== 2 && (
								<Link href={firstPage}>
									<a className={clsx(styles.block, styles.actionInfo)}>
										<span className={styles.btnSwitchManager}>
											<i className="fas fa-user-shield"></i>
											<span>MANAGER</span>
										</span>
									</a>
								</Link>
							)}
							{userPage !== true && (
								<Link href="/user">
									<a className={clsx(styles.block, styles.actionInfo)}>
										<span className={styles.btnSwitchManager}>
											<i className="fas fa-user"></i>
											<span>USER</span>
										</span>
									</a>
								</Link>
							)}
						</div>
					</li>
					<li className={`col-span-1 items-center xl:!flex ${styles.item}`}>
						<div className={`xl:flex items-center rounded-md px-2 ${styles.block}`}>
							<span className="!mr-2 text-[#fff] text-sm font-normal">Tỉ giá</span>
							<span className="!font-bold xl:!text-sm !text-xs flex items-center !text-[#fff]">
								1¥ = {_format.getVND(configData?.Currency, ' VNĐ')}
							</span>
						</div>
					</li>
					<li className={clsx(styles.item, 'col-span-1  items-center xl:!flex')}>
						<div className={clsx(styles.block, 'xl:flex items-center rounded-md px-2')}>
							<span className="!mr-2 text-sm font-normal text-[#fff]">Số dư</span>
							<span className="font-bold xl:text-sm text-xs flex items-center text-[#fff]">
								{dataUser?.Data?.Wallet !== 0 ? _format.getVND(dataUser?.Data?.Wallet) : '0 VNĐ'}
							</span>
						</div>
					</li>
					<li className={clsx(styles.item, 'col-span-1 lg:flex items-center !px-2')}>
						<div className={clsx(styles.block, styles.actionInfo, '!flex items-center rounded-xl !px-2 !py-[4px] bg-[#fff]')}>
							{
								<span
									className={`${
										dataUser?.Data?.LevelId > 3 ? 'text-[#8a64e3]' : 'text-orange'
									} font-semibold text-normal leading-[initial] text-[13px]`}
								>
									{getLevelId[dataUser?.Data?.LevelId]?.Name}
								</span>
							}
						</div>
					</li>
					<NotificationComponent userPage={userPage} userNew={userNew} ids={ids} />
					<li className={clsx(styles.item, 'col-span-1', isUserRoute && 'cursor-pointer')}>
						<div className={clsx(styles.block, styles.profile)}>
							<div className={styles.img}>
								{dataUser?.Data?.AvatarIMG ? (
									<AvatarAntd src={dataUser?.Data?.AvatarIMG} />
								) : (
									<AvatarName name={dataUser?.Data?.UserName} round={true} size={'35px'} textSizeRatio={2} />
								)}
							</div>
							<div className="ml-2 flex items-center">
								<span className="text-[#fff] text-xs items-end uppercase font-semibold">{userNew?.UserName}</span>
							</div>
						</div>
						{isUserRoute && (
							<div className={clsx(styles.dropdown, 'shadow-lg p-2')}>
								<ul className={clsx(styles.list)}>
									<li className={`${styles.item} ${styles.link}`}>
										<a href="/user/info-users" className={styles.link}>
											<i className="fas fa-user-cog"></i>
											Thông tin của bạn
										</a>
									</li>
									<li className={`${styles.item} ${styles.link} hover:!bg-red`}>
										<button
											className={styles.link}
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
											<i className="fas fa-sign-out-alt"></i>
											Đăng xuất
										</button>
									</li>
								</ul>
							</div>
						)}
					</li>
				</ul>
			</header>
		</>
	)
}

export default Header
