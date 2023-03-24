import clsx from 'clsx'
import { useEffect, useState } from 'react'
import styles from './index.module.css'
import { Image, Grid } from 'antd'
import Link from 'next/link'
const { useBreakpoint } = Grid
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'

const InnerContent = ({ data }) => {
	const [itemActive, setItemActive] = useState<any>({})

	useEffect(() => {
		console.log('data nè', data)
		if (data) {
			setItemActive(data[0])
		}
	}, [data])
	const onActive = (data: any) => {
		if (itemActive.Id == data.Id) {
			return true
		} else {
			return false
		}
	}
	return (
		<div className={styles.innerContent}>
			<div className={styles.boxLeft}>
				{data?.map((item) => {
					const isActive = onActive(item)
					return (
						<div
							className={clsx({ [styles.boxLeftActive]: isActive }, styles.boxLeftContent)}
							key={item?.Id}
							onClick={() => setItemActive(item)}
						>
							<h3
								key={item?.Id}
								style={{
									textAlign: 'left',
									color: isActive ? '#FFF' : '#626262',
									letterSpacing: '0.02em'
								}}
							>
								{item?.Name}
							</h3>
						</div>
					)
				})}
			</div>
			<div className={styles.boxRight}>
				<div className={styles.innerBoxRight}>
					<Link href="">
						<>
							<div className={styles.img}>
								<Image
									// style={{
									// 	objectFit: 'contain'
									// }}
									src={itemActive?.IMG}
									preview={false}
									width="100%"
									height={200}
								/>
							</div>
							<p>{itemActive?.Description}</p>
							<a target={'_blank'} href={itemActive.Link}>
								Xem chi tiết
								<i className="fal fa-arrow-right ml-4"></i>
							</a>
						</>
					</Link>
				</div>
			</div>
		</div>
	)
}
const SwiperServices = ({ data }) => {
	const screens = useBreakpoint()
	return (
		<div className={styles.innerContent}>
			<Swiper
				// navigation={true}
				slidesPerView={screens.sm ? 1.6 : 1}
				spaceBetween={30}
				pagination={true}
				modules={[Pagination]}
				className={clsx('h-full w-full', 'swiperBanner')}
			>
				{data?.map((item) => {
					return (
						<SwiperSlide
							style={{
								width: '100%'
							}}
						>
							<div className={` w-full h-auto`}>
								<div className={styles.innerBoxRight}>
									<Link href="">
										<>
											<div className={styles.img}>
												<Image src={item?.IMG} preview={false} width="100%" height={200} />
											</div>
											<p>{item?.Description}</p>
											<a target={'_blank'} href={item.Link}>
												Xem chi tiết
												<i className="fal fa-arrow-right ml-4"></i>
											</a>
										</>
									</Link>
								</div>
							</div>
						</SwiperSlide>
					)
				})}
			</Swiper>
		</div>
	)
}
export const HomeServices = ({ data }) => {
	return (
		<div className={clsx(styles.servicesWrap)}>
			<div className="container">
				<h1 className={'titleSection'}>Dịch vụ của chúng tôi</h1>
				<div className={clsx(styles.innerServicesWrap, 'hidden md:block')}>
					<InnerContent data={data} />
				</div>
				<div className={clsx(styles.innerServicesWrap, 'block md:hidden')}>
					<SwiperServices data={data} />
				</div>
			</div>
		</div>
	)
}
