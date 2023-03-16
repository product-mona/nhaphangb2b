import { InputNumber, Tooltip } from 'antd'
import React from 'react'
import { _format } from '~/utils'

export const OrderIDProductList: React.FC<any> = ({ data }) => {
	return (
		<div className="tableBox mt-4 px-2">
			<div className="flex justify-between">
				<div className="titleTable !pb-0">Danh sách sản phẩm</div>
			</div>
			{data?.map((item, index) => (
				<div key={index} className="orderProductItem border">
					<div className="flex flex-wrap">
						<div className="flex w-full items-center mb-5 justify-between px-3 borderBottom">
							<Tooltip title="Link đến sản phẩm" placement="topLeft">
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
										<InputNumber size="middle" value={_format.getVND(item?.UPriceBuy, '')} readOnly />
									</div>
								</div>
							</div>
							<div className="block flex md:flex-col justify-between ml-2 w-1/4">
								<div className="text-sm mr-4 text-[#484747] font-semibold">Đơn giá (VNĐ)</div>
								<div className="text-orange">
									<div className="text-sm text-center">
										<InputNumber size="middle" value={_format.getVND(item?.UPriceBuyVN, '')} readOnly />
									</div>
								</div>
							</div>
							<div className="block flex md:flex-col justify-between ml-2 w-1/4">
								<div className="text-sm mr-4 text-[#484747] font-semibold">Thành tiền (VNĐ)</div>
								<div className="text-sm text-center">
									<InputNumber
										size="middle"
										value={_format.getVND(item?.UPriceBuyVN * item?.Quantity, '')}
										disabled={true}
										className="text-center"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
