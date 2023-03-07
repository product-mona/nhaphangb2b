import clsx from 'clsx'
import { useEffect, useState } from 'react'
import styles from './index.module.css'
import { Image } from 'antd'
import Link from 'next/link'

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
								<Image src={itemActive?.IMG} preview={false} width="100%" height="100%" />
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

export const HomeServices = ({ data }) => {
	return (
		<div className={clsx(styles.servicesWrap)}>
			<div className="container">
				<div className={clsx(styles.innerServicesWrap)}>
					<h1 className={styles.mainTitle}>Dịch vụ của chúng tôi</h1>
					<InnerContent data={data} />
				</div>
			</div>
		</div>
	)
}
