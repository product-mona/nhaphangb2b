import { InputNumber, Tooltip } from 'antd'
import React, { useCallback, useMemo } from 'react'
import { numberWithCommas, _format } from '~/utils'

type SecondOrderIDProductListProps = {
	data: TProduct[]
	dataOrder?: TOrder
}
export const SecondOrderIDProductList: React.FC<SecondOrderIDProductListProps> = ({ data, dataOrder }) => {
	// totalCost
	const totalFeeEachOne = useMemo(() => {
		//InsuranceMoney  phí bảo hiểm
		//IsFastDeliveryPrice   Phí giao hàng tận nhà
		//IsPackedPrice  Phí đóng gỗ
		//IsCheckProductPrice Phí kiểm đếm
		//FeeWeight  Phí cân nặng
		//FeeBuyPro Phí mua hàng
		const totalFee =
			dataOrder.InsuranceMoney +
			dataOrder.IsFastDeliveryPrice +
			dataOrder.IsPackedPrice +
			dataOrder.IsCheckProductPrice +
			dataOrder.FeeWeight +
			dataOrder.FeeBuyPro
		if (!!dataOrder.TotalItem) {
			return totalFee / dataOrder.TotalItem
		} else {
			return 0
		}
	}, [dataOrder])

	const renderCostPrice = useCallback(
		(price: number) => {
			const resut = price + totalFeeEachOne
			return numberWithCommas(resut.toFixed(2))
		},
		[totalFeeEachOne]
	)
	return (
		<div className="tableBox">
			<div className="flex justify-between">
				<div className="titleTable mb-[-6px]">Danh sách sản phẩm</div>
			</div>
			{data?.map((item, index) => (
				<div
					key={index}
					onClick={() => {
						console.log('item', item)
					}}
					className="orderProductItem border"
				>
					<div className="flex flex-wrap">
						<div className="flex w-full items-center mb-5 justify-between px-3 borderBottom">
							<Tooltip placement="topLeft" title="Link đến sản phẩm">
								<a href={item?.LinkOrigin} target="_blank" className="mainTitle">
									{item?.LinkOrigin}
								</a>
							</Tooltip>
						</div>
						<div className="flex w-5/12 items-center">
							<div className="flex">
								<div className="self-stretch flex items-center">
									<div className="w-[20px] h-[20px] text-center rounded-full text-orange border">{index + 1}</div>
								</div>
								<div className="w-[75px] h-[75px] border border-[#6969691a] ml-4 rounded-xl overflow-hidden">
									<a href={item?.LinkOrigin} target="_blank">
										<img
											src={item?.ImageOrigin ? item?.ImageOrigin : '/pro-empty.jpg'}
											style={{
												width: '100%',
												height: '100%'
											}}
										/>
									</a>
								</div>
							</div>
							<div className="ml-2">
								<div className="flex flex-wrap items-end">
									<span className="text-sm mr-4 text-[#484747] font-semibold">* Thuộc tính:</span>
									<span>{item?.Property}</span>
								</div>
								<div className="flex flex-wrap items-end">
									<span className="text-sm mr-4 text-[#484747] font-semibold">* Ghi chú:</span>
									<input
										type="text"
										className="border-b !rounded-none border-[#0000003a] text-[#000] bg-[transparent] max-w-[140px] outline-0"
										value={item?.Brand ?? ''}
										disabled={true}
									/>
								</div>
							</div>
						</div>
						<div className="flex w-7/12">
							<div className="block flex md:flex-col justify-between ml-2 w-1/4">
								<div className="text-sm mr-4 text-[#484747] font-semibold">Số lượng (cái)</div>
								<div className="text-sm text-center">
									<InputNumber size="middle" value={_format.getVND(item?.Quantity, '')} readOnly />
								</div>
							</div>
							<div className="block flex md:flex-col justify-between ml-2 w-1/4">
								<div className="text-sm mr-4 text-[#484747] font-semibold">Đơn giá (¥)</div>
								<div className="text-orange">
									<div className="text-sm text-center">
										<Tooltip title={`${_format.getVND(item?.PriceVND, '')} VNĐ`} placement="bottom">
											<InputNumber size="middle" value={_format.getVND(item?.PriceCNY, '')} readOnly />
										</Tooltip>
									</div>
								</div>
							</div>
							<div className="block flex md:flex-col justify-between ml-2 w-1/4">
								<div className="text-sm mr-4 text-[#484747] font-semibold">Thành tiền (¥)</div>
								<div className="text-sm text-center">
									<Tooltip title={`${_format.getVND(item?.PriceVND * item?.Quantity, '')} VNĐ`} placement="bottom">
										<InputNumber
											size="middle"
											value={_format.getVND(item?.PriceCNY * item?.Quantity, '')}
											readOnly
											className="text-center"
										/>
									</Tooltip>
								</div>
							</div>
							<div className="block flex md:flex-col justify-between ml-2 w-1/4">
								<div className="text-sm mr-4 text-[#484747]  font-semibold truncate">Giá vốn 1 sản phẩm</div>
								<div className="text-orange">
									<div className="text-sm text-center">
										<Tooltip title={`Đơn giá (VNĐ) + Tổng chi phí trên từng sản phẩm`} placement="bottom">
											<InputNumber addonBefore="VNĐ" size="middle" value={renderCostPrice(item.PriceVND)} readOnly />
										</Tooltip>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
