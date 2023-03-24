import { Card } from 'antd'
import React from 'react'
import styles from './CardHorizontal.module.css'
import { _format } from '~/utils'

type TProps = {
	Title?: string
	IMG?: string
	Created?: Date
	Summary?: string
	Code?: string
}

export const CardHorizontal: React.FC<TProps> = ({ Title, IMG, Created, Summary, Code }) => {
	return (
		<React.Fragment>
			<article
				className={styles.article}
				// className=" border-[1px] border-solid border-[#ddd] "
				style={{
					float: 'left',
					width: '100%',
					position: 'relative',
					display: 'block',
					marginBottom: '29px',

					// background: '#f9f9f9',

					padding: '10px'
				}}
			>
				<p
					style={{
						width: '27%',
						float: 'left',
						marginRight: '15px',
						position: 'relative',
						overflow: 'hidden'
					}}
				>
					<div
						className="cursor-pointer pb-[100%] sm:pb-[66.67%]"
						style={{
							display: 'block',
							width: '100%',
							height: '100%',
							position: 'relative',
							background: 'transparent',
							fontSize: '100%'
						}}
					>
						<img
							alt={Title}
							src={IMG || '/pro-empty.jpg'}
							style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
						/>
					</div>
				</p>
				<div
					style={{
						display: 'block'
					}}
				>
					<p
						style={{
							textAlign: 'left'
						}}
					>
						<p
							className="font-bold !mb-[5px] cursor-pointer  overflow-hidden text-lg text-[#333] hover:text-[#0b600d]"
							style={{
								display: '-webkit-box',
								WebkitLineClamp: 1,
								WebkitBoxOrient: 'vertical'
							}}
						>
							{Title}
						</p>
						<p
							className="text-[#6b6f82] overflow-hidden"
							style={{
								display: '-webkit-box',
								WebkitLineClamp: 4,
								WebkitBoxOrient: 'vertical',
								height: '88px'
							}}
						>
							{Summary ?? '...'}
						</p>
					</p>
				</div>
			</article>
		</React.Fragment>
	)
}
