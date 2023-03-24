import { Input, Steps } from 'antd'
import styles from './index.module.css'

import 'antd/dist/antd.css'
import { useEffect, useState } from 'react'

export const HomeRegister = ({ data }) => {
	const [steps, setSteps] = useState([])
	const [current, setCurrent] = useState(0)

	useEffect(() => {
		const newSteps = []

		data?.map((item, index) => {
			newSteps.push({
				Code: item?.Code,
				Created: item?.Created,
				Name: item?.Name,
				Description: item?.Description,
				IMG: item?.IMG,
				Link: item?.Link,
				Current: index
			})
		})

		setSteps(newSteps.sort((a, b) => a?.Position - b?.Position))
	}, [data])

	return (
		<div className={`${styles.regisWrap} register`}>
			<div className="container">
				<div className={styles.inner}>
					<div className={styles.left}>
						<h1 className={'titleSection text-white text-left'}>Hướng dẫn đăng ký</h1>
						<Steps
							current={current}
							onChange={(current) => {
								setCurrent(current)
							}}
						>
							{steps?.map((item, index) => (
								<Steps.Step key={item?.Code} />
							))}
						</Steps>
						<div className={styles.stepContent}>
							<h3 className="secondTitle">{steps[current]?.Name}</h3>
							<Input.TextArea
								style={{
									padding: 0,
									background: 'transparent',

									border: 'none',
									boxShadow: 'none'
								}}
								value={steps[current]?.Description}
								placeholder=""
								autoSize
								readOnly
							/>

							<a className={`${styles.link} italic`} href={steps[current]?.Link ?? '/'}>
								Chi tiết
							</a>
						</div>
					</div>
					<div className={styles.right}>
						{steps?.map((item) => (
							<div
								className={`${styles.boxRight} ${item.Current === current ? styles.active : ''}`}
								key={item?.Code}
								onClick={() => setCurrent(item.Current)}
							>
								<div className={styles.img}>
									<img src={item?.IMG} alt="" />
								</div>
								<h3 className="secondTitle">{item?.Name}</h3>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
