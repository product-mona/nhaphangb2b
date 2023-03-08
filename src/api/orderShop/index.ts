import BaseAPI from '../methods'

type TFilterParams = {
	UID: number
}

const { globalCRUD, put, post, get } = new BaseAPI<TUserCartOrderShopTemp, TFilterParams>('order-shop')

export const orderShopApi = {
	...globalCRUD,

	getShopList: (params: { mainOrderID: number }) => get('/get-list-order-shop', { params })
}
