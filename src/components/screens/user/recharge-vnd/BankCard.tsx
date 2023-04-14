import { Card, Modal, Tooltip } from 'antd'
import React from 'react'

export const BankCard = ({ item, setSelectedBank, selectedBank }) => {
	return (
		<React.Fragment key={item?.Id}>
			<Card
				className={`md:col-span-2 xl:col-span-1 cursor-pointer transition-all `}
				title=""
				onClick={() => {
					setSelectedBank(item)
				}}
				style={{
					border: item?.Id === selectedBank?.Id ? '3px solid #52c41a' : '3px solid #ececec',
					transform: item?.Id === selectedBank?.Id && 'scale(1.02)',
					padding: '12px'
				}}
				extra={
					<div className="flex justify-start items-center w-full">
						<div>
							<img width={30} height={'auto'} src={item?.IMG} alt="" className="mr-4" />
						</div>
						<p className="font-semibold text-[#595857]">{item?.BankName}</p>
					</div>
				}
			>
				<div className="flex gap-4">
					<div className="w-2/12">
						<div>
							<Tooltip title="Click để quét mã QR">
								<img
									width={'100%'}
									src="/QRcode.png"
									className="cursor-pointer"
									onClick={() => {
										Modal.info({
											title: 'Vui lòng kiểm tra kỹ thông tin!',
											content: <img src={item?.IMGQR} />
										})
									}}
								/>
							</Tooltip>
						</div>
					</div>
					<div className="w-10/12">
						<div className="flex justify-between  mb-[3px]">
							<p className=" text-[#595857] tracking-wider">Số tài khoản:</p>
							<p className="text-[16px] text-main">{item?.BankNumber}</p>
						</div>
						<div className="flex justify-between mb-[3px] ">
							<p className=" text-[#595857] tracking-wider">Chủ tài khoản:</p>
							<p>{item?.Branch}</p>
						</div>
						<div className="flex justify-between ">
							<p className=" text-[#595857] tracking-wider">Chi nhánh:</p>
							<p>{item?.Name}</p>
						</div>
					</div>
				</div>
			</Card>
		</React.Fragment>
	)
}
