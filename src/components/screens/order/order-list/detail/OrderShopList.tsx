import { Collapse } from 'antd'
import React, { FC } from 'react'
import { order } from '~/api'
import { IconButton } from '~/components/globals/button/IconButton'
import { IOrderShop } from '~/types'
import { _format } from '~/utils'
import { OrderProductItem } from './OrderProductItem'
import { OrderProductList } from './OrderProductList'

type OrderIDShopListProps = {
	data: TOrder
	RoleID: number
	refetch: () => void
}
export const OrderShopList: FC<OrderIDShopListProps> = ({ data, RoleID, refetch }) => {
	const onExportExcel = async () => {
		// try {
		//   const res = await order.exportExcel({
		//     MainOrderID: data?.Id,
		//   });
		//   router.push(`${res.Data}`);
		// } catch (error) {
		//   toast.error(error);
		// }
	}
	return (
		<React.Fragment>
			<div className="orderProductItem flex justify-between items-center">
				{/* <div className="flex flex-col">
					<span className="font-bold">Tổng số lượng: ddang caap nhat </span>
					<span className="font-bold">Tổng tiền sản phẩm: {_format.getVND(data?.PriceVND)}</span>
				</div>
				<div>
					{(RoleID === 1 || RoleID === 3 || RoleID === 4) && (
						<IconButton
							onClick={() => onExportExcel()}
							title="Xuất"
							icon="fas fa-file-export"
							showLoading
							toolip="Xuất thống kê"
							green
							btnClass="ml-4"
						/>
					)}
				</div> */}
			</div>

			{/*     max-h-[700px] overflow-y-auto */}
			<div>
				<div className="h-full">
					{data?.OrderShops.map((x, idx) => {
						return (
							<div>
								<Collapse defaultActiveKey={idx} expandIconPosition="right">
									<Collapse.Panel
										header={<h2 className="uppercase font-bold !mb-0 text-[#fff]">{x.ShopId}</h2>}
										key={idx}
									>
										<div>
											<OrderProductList dataOrderShop={x} refetch={refetch} RoleID={RoleID} />
										</div>
									</Collapse.Panel>
								</Collapse>
							</div>
						)
					})}
					{/* {data?.Orders?.map((order, index) => (
              <OrderProductItem
                key={`${order.Id}`}
                order={order}
                index={index}
                handleUpdateProduct={handleUpdateProduct}
                loading={loadingUpdate}
                RoleID={RoleID}
                // setCheckUpdate={() => setCheckUpdate(true)}
              />
            ))} */}
				</div>
			</div>
		</React.Fragment>
	)
}
