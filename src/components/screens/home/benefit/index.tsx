import styles from './index.module.css'

// Import Swiper styles
import { Collapse, Image, Input } from 'antd'
import { useState } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const UlContent = ({ data }) => {
	const [active, setActive] = useState(1)

	return (
		<ul>
			{data?.map((item) => (
				<Content item={item} key={item.Id} active={active} setActive={setActive} />
			))}
		</ul>
	)
}

const Content = ({ item, active, setActive }) => {
	return (
		<li className={styles.contentWrapper}>
			<div className={styles.head}>
				<h3 className={styles.h3}>{item?.Name}</h3>
				<Image
					src="/benefig-arrow.png"
					width={24}
					height={24}
					preview={false}
					className={`${styles.icon} ${active === item?.Id ? styles.iconActive : ''}`}
					onClick={() => {
						setActive(active === item?.Id ? 0 : item?.Id)
					}}
				/>
			</div>
			<div className={`${active === item.Id ? styles.contentActive : ''} ${styles.content} w-full h-full`}>
				{active === item.Id ? (
					<Input.TextArea
						style={{
							padding: 0,
							background: 'transparent',
							color: '#FFF',
							border: 'none',
							boxShadow: 'none'
						}}
						defaultValue={item?.Description}
						placeholder=""
						autoSize
					/>
				) : (
					<></>
				)}
				{/* <p>{item?.Description}</p> */}
			</div>
		</li>
	)
}

export const HomeBenefit = ({ data }) => {
	return (
		<div className={styles.benefitWrap}>
			<div className="container">
				<div className={styles.innerBenefit}>
					<h1 className={styles.mainTitle}>Quyền lợi khách hàng</h1>
					<UlContent data={data} />
				</div>
			</div>
		</div>
	)
}
