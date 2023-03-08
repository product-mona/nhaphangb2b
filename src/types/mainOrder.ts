export interface IOrderShop {
	FeeBuyPro: number
	Id: number
	InsuranceMoney: number
	IsCheckProduct: boolean
	IsCheckProductPrice: number
	IsFast: boolean
	IsFastDelivery: boolean
	IsFastDeliveryPrice: number
	IsFastPrice: number
	IsInsurance: boolean
	IsPacked: boolean
	IsPackedPrice: number
	MainOrderID: number
	Note: string
	PriceCNY: number
	PriceVND: number
	RowNumber: number
	ShopId: string
	ShopName: string
	Site: string
	TotalItem: number
	UID: number
	Orders: TProduct[]
}
export interface IMainOrder {}
