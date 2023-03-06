import { FormInput, FormSelect } from '~/components'
import { useShippingTypeToWarehouse, useWareHouseTQ, useWareHouseVN } from '~/hooks'
import { TControl } from '~/types/field'

type TProps = TControl<TUserPayment>

export const DeliveryInfo: React.FC<TProps> = ({ control }) => {
	const warehouseTQ = useWareHouseTQ()
	const warehouseVN = useWareHouseVN()
	const shippingTypeToWarehouse = useShippingTypeToWarehouse()
	return (
		<div className="grid grid-cols-1 gap-4 mt-4 pb-4">
			<h2 className="col-span-1 text-[#141046] font-semibold !mb-0">Thông tin vận chuyển</h2>

			<div className="col-span-1 mb-2">
				<FormSelect
					data={warehouseTQ.data || []}
					select={{ label: 'Name', value: 'Id' }}
					name={`warehouseTQ`}
					label="Chọn kho TQ"
					placeholder="Chọn kho TQ"
					control={control}
				/>
			</div>
			<div className="col-span-1 mb-2">
				<FormSelect
					data={warehouseVN.data || []}
					select={{ label: 'Name', value: 'Id' }}
					name={`warehouseVN`}
					label="CHUYỂN VỀ KHO"
					placeholder="CHUYỂN VỀ KHO"
					control={control}
				/>
			</div>
			<div className="col-span-1 mb-2">
				<FormSelect
					data={shippingTypeToWarehouse.data || []}
					select={{ label: 'Name', value: 'Id' }}
					name={`shippingType`}
					label="Phương thức vận chuyển"
					placeholder="Phương thức vận chuyển"
					control={control}
				/>
			</div>
		</div>
	)
}
