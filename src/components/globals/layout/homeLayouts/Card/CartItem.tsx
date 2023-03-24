import { Card } from 'antd'
import React from 'react'
import { _format } from '~/utils'

type TProps = {
	Title?: string
	IMG?: string
	Created?: Date
	Summary?: string
}

const CartItem: React.FC<TProps> = ({ Title, IMG, Created, Summary }) => {
	return (
		<React.Fragment>
			<Card
				style={{ overflow: 'hidden', height: '100%', borderColor: '#d3d3d3' }}
				cover={<img alt={Title} src={IMG || '/pro-empty.jpg'} style={{ objectFit: 'cover', width: '100%', height: '150px' }} />}
			>
				<p
					className="font-bold !mb-3 overflow-hidden hover:text-[#008d4b]"
					style={{
						display: '-webkit-box',
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical',
						fontSize: '16px'
						// height: '44px'
					}}
				>
					{Title}
				</p>
				<p
					className="text-[#6b6f82] overflow-hidden "
					style={{
						display: '-webkit-box',
						WebkitLineClamp: 4,
						WebkitBoxOrient: 'vertical',
						height: '88px'
					}}
				>
					{Summary ?? '...'}
				</p>
			</Card>
		</React.Fragment>
	)
}

export default CartItem
