import { Input, InputNumber, Tooltip } from 'antd'
import React, { useCallback, useMemo } from 'react'

import { numberWithCommas, _format, onCalTotalNumber } from '~/utils'

type SecondOrderIDProductListProps = {
	data: TProduct[]
	dataOrder?: TOrder
}
export const SecondOrderIDProductList: React.FC<SecondOrderIDProductListProps> = ({ data, dataOrder }) => {
	const totalFeeEachOne = useMemo(() => {
		//FeeBuyPro Phí mua hàng
		//IsCheckProductPrice Phí kiểm đếm
		//IsPackedPrice  Phí đóng gỗ
		//InsuranceMoney  phí bảo hiểm
		//IsFastDeliveryPrice   Phí giao hàng tận nhà
		// FeeShipCN phí ship nội địa
		//FeeWeight  Phí cân nặng
		if (!!dataOrder) {
			const totalItem = onCalTotalNumber(data, 'Quantity')

			const totalSurcharge = onCalTotalNumber(dataOrder.FeeSupports, 'SupportInfoVND') //toongr phu hpis
			const totalFee =
				dataOrder.FeeBuyPro + //phí mua hàng == 25740   //
				dataOrder.IsCheckProductPrice + // phí kiểm đếm  == 18000
				dataOrder.IsPackedPrice + // phí đóng gỗ 0   == 0
				dataOrder.InsuranceMoney + // phí bảo hiểm    == 0
				dataOrder.IsFastDeliveryPrice + // phí giao tận nhà 0   == 0
				dataOrder.FeeShipCN + //phí ship nội địa == 25740   //
				dataOrder.FeeWeight + //Phí cân nặng = 50000
				totalSurcharge // toongr phu hpis

			if (!!totalItem) {
				return totalFee / totalItem /// 244800
			} else {
				return 0
			}
		} else return 0
	}, [dataOrder])

	const renderCostPrice = useCallback(
		// dataOrder.CurrentCNYVN : tỉ giá của đơn lớn
		//PriceOrigin : đơn giá tệ origin 1 sản phẩm
		(PriceOrigin: number) => {
			console.log(PriceOrigin, dataOrder.CurrentCNYVN, totalFeeEachOne)
			const resut = PriceOrigin * dataOrder.CurrentCNYVN + totalFeeEachOne

			return numberWithCommas(Math.round(resut))
		},
		[totalFeeEachOne]
	)

	const renderGoodPrice = useCallback((priceOrigin: number, pricePromotion: number) => {
		if (!pricePromotion) {
			return priceOrigin
		} else {
			if (priceOrigin <= pricePromotion) {
				return priceOrigin
			} else return pricePromotion
		}
	}, [])

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
									<p className="hover:text-main">{item?.ItemId}</p>
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
							<div className="block flex md:flex-col justify-between ml-2 ">
								<div className="text-sm mr-4 text-[#484747] font-semibold text-right">Số lượng</div>
								<div className="text-sm text-center">
									<Input className="text-right" size="middle" value={_format.getVND(item?.Quantity, '')} readOnly />
								</div>
							</div>
							<div className="block flex md:flex-col justify-between ml-2 ">
								<div className="text-sm mr-4 text-[#484747] font-semibold text-right">Đơn giá (¥)</div>
								<div className="text-orange">
									<div className="text-sm">
										<Input
											className="text-right"
											size="middle"
											value={_format.getVND(renderGoodPrice(item?.PriceOrigin || 0, item?.PricePromotion || 0), '')}
											readOnly
										/>
									</div>
								</div>
							</div>
							<div className="block flex md:flex-col justify-between ml-2 w-3/12">
								<div className="text-sm mr-4 text-[#484747] font-semibold text-right">Thành tiền (¥)</div>
								<div className="text-sm text-center">
									<Input
										className="text-right"
										size="middle"
										value={_format.getVND(
											renderGoodPrice(item?.PriceOrigin || 0, item?.PricePromotion || 0) * item?.Quantity,
											''
										)}
										readOnly
									/>
								</div>
							</div>
							<div className="block flex md:flex-col justify-between ml-2 w-4/12">
								<div className="text-sm mr-4 text-[#484747] text-right font-semibold truncate">
									Giá vốn 1 sản phẩm (VNĐ)
								</div>
								<div className="text-orange">
									<div className="text-sm ">
										<Tooltip title={`Đơn giá (VNĐ) + Tổng chi phí trên từng sản phẩm`} placement="bottom">
											{/* <InputNumber size="middle" value={renderCostPrice(item?.PriceVND)} readOnly /> */}
											<Input
												className="text-right"
												size="middle"
												value={renderCostPrice(renderGoodPrice(item?.PriceOrigin || 0, item?.PricePromotion || 0))}
												readOnly
											/>
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
