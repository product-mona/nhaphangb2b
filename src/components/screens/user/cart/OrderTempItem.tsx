import { InputNumber, Tooltip } from 'antd'
import { useFormContext } from 'react-hook-form'
import Link from 'next/link'
import React from 'react'
import { ActionButton, FormInput, FormInputNumber, TableMoneyField, TableTextField } from '~/components'
import { _format } from '~/utils'

type TProps = {
	orderTempData: TUserCartOrderTemp
	index: number
	deleteProduct: () => void
	updateProduct: (quantity: number, brand: string) => void
	isLoading: boolean
}

export const OrderTempItem: React.FC<TProps> = ({ index, orderTempData, updateProduct, deleteProduct, isLoading }) => {
	const { control } = useFormContext()

	const [priceCNY, setPriceCNY] = React.useState(() => {
		if (orderTempData?.PricePromotion !== 0) {
			return orderTempData?.PriceOrigin > orderTempData?.PricePromotion
				? _format.getVND(orderTempData?.PricePromotion, ' ')
				: _format.getVND(orderTempData?.PriceOrigin, ' ')
		}

		return _format.getVND(orderTempData?.PriceOrigin, ' ')
	})

	return (
		<div
			key={orderTempData.Id}
			className="orderProductItem border"
			style={{
				opacity: isLoading ? '0.4' : '1',
				pointerEvents: isLoading ? 'none' : 'all'
			}}
		>
			<div className="flex flex-wrap  lg:justify-between">
				<div className="flex w-full items-center mb-5 justify-between px-3 borderBottom">
					<Tooltip title="Link đến sản phẩm" placement="topLeft">
						<a href={orderTempData?.LinkOrigin} target="_blank" className="mainTitle">
							<p className="truncate max-w-[300px] hover:text-[#006BA0]">
								{/* {orderTempData?.LinkOrigin.replace('?', '.')} */}
								{orderTempData?.ItemId}
							</p>
						</a>
					</Tooltip>

					<div className="flex items-center">
						<ActionButton
							iconContainerClassName="border-none"
							title="Xóa sản phẩm này!"
							icon="fas fa-trash-alt"
							onClick={deleteProduct}
						/>
					</div>
				</div>
				<div className="flex xl:w-7/12 items-center">
					<div className="flex">
						<div className="self-stretch flex items-center">
							<div className="w-[20px] h-[20px] text-center rounded-[5px] border border-[#0c5963] flex items-center justify-center">
								{index + 1}
							</div>
						</div>
						<div className="w-[75px] h-[75px] border border-[#6969691a] ml-4 rounded-xl overflow-hidden">
							<Link href={orderTempData?.LinkOrigin}>
								<a target="_blank">
									<img src={_format.parseImageURL(orderTempData?.ImageOrigin)} width="100%" height="100%" />
								</a>
							</Link>
						</div>
					</div>
					<div className="ml-2">
						<div className="flex flex-wrap items-end">
							<span className="text-sm mr-4 text-[#484747] font-semibold">* Thuộc tính:</span>
							<span>{orderTempData?.Property}</span>
						</div>
						<div className="flex flex-wrap items-end">
							<span className="text-sm mr-4 text-[#484747] font-semibold">* Ghi chú:</span>
							<div>
								<TableTextField size="small" control={control} name={`OrderTemps.${index}.Brand`} />
							</div>
							{/* <input
								type="text"
								className="border-b !rounded-none border-[#0000003a] text-[#000] bg-[transparent] max-w-[140px] outline-0"
								value={brand ?? ''}
								onChange={(e) => onChangeOrderBrand(e)}
							/> */}
						</div>
					</div>
				</div>
				<div className="xl:w-5/12 flex items-center">
					<div className="grid grid-cols-1 xl:!grid-cols-2">
						<div className="col-span-1 lg:!col-span-1 xl:block flex justify-between ml-2 mb-2 xl:mb-0">
							<div className="text-[10px] py-[2px] uppercase font-bold">Số lượng (cái)</div>
							<TableMoneyField control={control} name={`OrderTemps.${index}.Quantity`} />
						</div>
						<div className="col-span-1 lg:!col-span-1 xl:block flex justify-between ml-2 mb-2 xl:mb-0">
							<div className="text-[10px] py-[2px] uppercase font-bold">Đơn giá (¥)</div>
							<div className="text-orange">
								<div className="text-sm text-center">
									<InputNumber size="middle" disabled={true} value={priceCNY} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
