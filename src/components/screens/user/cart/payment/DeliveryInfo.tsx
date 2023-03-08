import { useEffect } from 'react'
import { FormInput, FormSelect, SecondFormSelect } from '~/components'
import { useShippingTypeToWarehouse, useWareHouseTQ, useWareHouseVN } from '~/hooks'
import { TControl } from '~/types/field'

type TProps = {
	control: any
}

export const DeliveryInfo: React.FC<TProps> = ({ control }) => {
	const warehouseTQ = useWareHouseTQ()

	const warehouseVN = useWareHouseVN()
	const shippingTypeToWarehouse = useShippingTypeToWarehouse()
	return (
		<div className="grid grid-cols-1 gap-4  pb-4">
			{/* <h2 className="col-span-1 text-[#141046] font-semibold !mb-0">Thông tin vận chuyển</h2> */}
			{/* <div className="col-span-1 mb-2">
				<FormSelect
					data={warehouseVN.data || []}
					select={{ label: 'Name', value: 'Id' }}
					name={`warehouseVN`}
					label="CHUYỂN VỀ KHO"
					placeholder="CHUYỂN VỀ KHO"
					control={control}
				/>
			</div> */}
			<div className="col-span-1 mb-2">
				<SecondFormSelect
					required
					options={warehouseVN.data || []}
					name={`warehouseVN`}
					label="CHUYỂN VỀ KHO"
					placeholder="CHUYỂN VỀ KHO"
					control={control}
					getOptionValue={(x) => x.Id}
					getOptionLabel={(x) => x.Name}
				/>
			</div>
			<div className="col-span-1 mb-2">
				<SecondFormSelect
					required
					options={shippingTypeToWarehouse.data || []}
					name={`shippingType`}
					label="Phương thức vận chuyển"
					placeholder="Phương thức vận chuyển"
					control={control}
					getOptionValue={(x) => x.Id}
					getOptionLabel={(x) => x.Name}
				/>
			</div>
		</div>
	)
}
