import { Button } from 'antd'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { _format } from '~/utils'
import { CartOrderItem } from '.'

export const CartOrder = ({ currentCart, note, setNote, toggleShopId, chosenShopIds, refetchCart }) => {
	//currentCart là giỏ hàng của thằng userID này api: orderShopTemp.getList

	return (
		<div className="cartOrderContainer">
			{currentCart.map((cart, index) => {
				return (
					<div className="mb-4" key={`${index}-${cart?.Id}`}>
						<CartOrderItem
							cart={cart}
							note={note?.[cart?.Id]}
							handleNote={(key: number, value: string) => setNote({ ...note, [key]: value })}
							toggleShopId={toggleShopId}
							checked={chosenShopIds.includes(cart?.Id)}
							refetchCart={refetchCart}
						/>
					</div>
				)
			})}
		</div>
	)
}
