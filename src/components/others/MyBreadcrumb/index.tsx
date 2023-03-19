import { FC, ReactNode } from 'react'
import { IconButton } from '~/components/globals/button/IconButton'
type FCProps = {
	title?: ReactNode
	subTitle?: ReactNode
	onBack: () => void
}
export const MyBreadcrumb: FC<FCProps> = ({ onBack, title, subTitle }) => {
	return (
		<div className="mt-[50px] mb-[20px] flex items-center">
			<div className="mr-[18px]">
				<IconButton
					onClick={() => onBack()}
					icon={'far fa-arrow-left'}
					title=""
					toolip="Trở lại"
					btnClass="!p-[18px] !bg-[transparent] !h-auto hover:!shadow-none hover:!bg-main10 rounded-[8px]"
					btnIconClass="text-main !w-[24px] !m-0 before:text-[24px]"
				/>
			</div>
			<div>
				<div className="titlePageUser p-0 m-0">{title}</div>
				<p className="text-textSub">{subTitle}</p>
			</div>
		</div>
	)
}
