import React from 'react';
import styles from './index.module.css';
import clsx from 'clsx';

type TProps = {
	hover: boolean;
	userPage?: boolean;
};
const Footer: React.FC<TProps> = ({ hover, userPage }) => {
	return (
		<footer
			className={clsx(
				styles.footer,
				userPage && "xl:!w-[100%]"
				// !userPage && "!pl-[88px]",
				// !userPage && hover && "!pl-[300px]",
			)}
		>
			<p className="text-xs">
				© 2022 NHẬP HÀNG TRUNG QUỐC
			</p>
			<p className="text-xs">
				MONA LOGISTICS VERSION 6.0
			</p>
		</footer>
	);
};

export default Footer;
