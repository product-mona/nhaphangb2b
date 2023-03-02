import clsx from 'clsx';
import React, { FC } from 'react';

type TProps = {
	title: string;
	onClick?: (data?: any) => void | Promise<any>;
	btnClass?: string;
	btnTextClass?: string;
	showLoading?: boolean;
	disabled?: boolean;
};

export const Button: FC<TProps> = ({
	onClick,
	title,
	btnClass,
	btnTextClass,
	showLoading = false,
	disabled = false
}) => {
	const [loading, setLoading] = React.useState(false);
	const _onPress = async () => {
		if (onClick) {
			if (showLoading) {
				try {
					setLoading(true);
					await onClick();
				} catch (error) {
				} finally {
					setLoading(false);
				}
			} else {
				onClick();
			}
		}
	};

	return (
		<div
			className={clsx(
				'bg-gray relative min-w-[80px] px-4 py-2 mx-1 h-10 cursor-pointer text-center inline-flex items-center justify-center',
				btnClass
			)}
			onClick={!loading && !disabled ? _onPress : undefined}
		>
			{loading && (
				<i
					className={clsx(
						'fa-spin fas fa-circle-notch text-white mr-2 text-lg'
					)}
				></i>
			)}
			<span className={clsx(btnTextClass, 'text-white text-sm')}>{title}</span>
			{(loading || disabled) && (
				<div className="absolute top-0 left-0 right-0 bottom-0 bg-[rgba(255,255,255,.4)] cursor-not-allowed" />
			)}
		</div>
	);
};
