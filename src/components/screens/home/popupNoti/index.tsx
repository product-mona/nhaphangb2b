import { Modal } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import configHomeData from '~/api/config-home'
import styles from './index.module.css'

export const PopupNoti = () => {
	const notiShow = useRef(() => {
		const showNoti = JSON.parse(localStorage.getItem('showNoti'))
		return showNoti === undefined ? false : showNoti
	})
	const [openModal, setOpenModal] = useState(false)

	const { data, isFetching, isLoading } = useQuery(['confighome'], () => configHomeData.get(), {
		onSuccess: (res) => {
			const showNoti = JSON.parse(localStorage.getItem('showNoti'))
			// console.log('res?.Data?.NotiPopupTitl', res?.Data?.NotiPopupTitle, !!res?.Data?.NotiPopupTitle)
			if (res?.Data?.NotiPopupTitle) {
				// console.log('res?.Data?.NotiPopupTitl', res?.Data?.NotiPopupTitl)
				localStorage.setItem('showNoti', JSON.stringify(true))
				setOpenModal(true)
			} else {
				setOpenModal(false)
			}
			return res?.Data
		},
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false
	})

	return (
		<Modal visible={openModal} closeIcon={false} footer={false} className="homePopupNoti">
			<div className={styles.popupNoti}>
				<div className={styles.head}>
					<h1>
						NHẬP HÀNG B2B KÍNH CHÀO QUÝ KHÁCH
						{/* {data?.Data?.CompanyLongName} */}
					</h1>
				</div>
				<div className={styles.content}>
					<h3>{data?.Data?.NotiPopupTitle}</h3>
					<div dangerouslySetInnerHTML={{ __html: data?.Data?.NotiPopup }}></div>
				</div>
				<div className={styles.foot}>
					<button
						className={`${styles.btn} ${styles.btn1}`}
						onClick={() => {
							setOpenModal(!openModal)
							localStorage.setItem('showNoti', JSON.stringify(false))
						}}
					>
						{' '}
						Đóng và không hiện lại
					</button>
					<button className={`${styles.btn} ${styles.btn2}`} onClick={() => setOpenModal(!openModal)}>
						Đóng
					</button>
				</div>
				<div className={styles.contact}>
					<a href={`mailto:${data?.Data?.NotiPopupEmail}`}>{data?.Data?.NotiPopupEmail || data?.Data?.EmailContact}</a>
					<span className="text-white">||</span>
					<a href={`tel:${data?.Data?.Hotline}`}>{data?.Data?.Hotline}</a>
				</div>
			</div>
		</Modal>
	)
}
