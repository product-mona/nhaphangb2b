import React from 'react'
import styles from './index.module.css'
import clsx from 'clsx'

type TProps = {
	hover: boolean
	userPage?: boolean
}
const Footer: React.FC<TProps> = ({ hover, userPage }) => {
	return (
		<footer
			className={clsx(
				styles.footer,
				userPage && 'xl:!w-[100%]'
				// !userPage && "!pl-[88px]",
				// !userPage && hover && "!pl-[300px]",
			)}
		>
			<p
				style={{
					fontSize: '14px',
					fontWeight: 'normal'
				}}
			>
				© 2023 Nhập hàng Trung Quốc
			</p>
			<p
				style={{
					fontSize: '14px',
					fontWeight: 'normal'
				}}
			>
				Mona Logistics Version 6.0
			</p>
		</footer>
	)
}

export default Footer
