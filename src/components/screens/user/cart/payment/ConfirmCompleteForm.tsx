import { useQuery } from 'react-query'
import { orderShopTemp } from '~/api'
import { IconButton } from '~/components/globals/button/IconButton'
import { FormCheckbox } from '~/components/globals/formBase'
import { useAppSelector } from '~/store'
import { TControl } from '~/types/field'
import { _format } from '~/utils'

type TProps = TControl<TUserPayment> & {
	onPress: () => void
	totalPrice: number
	loadingPayment?: boolean
}

export const ConfirmCompleteForm: React.FC<TProps> = ({ control, onPress, totalPrice, loadingPayment }) => {
	const ids = useAppSelector((state) => state.cart.selectedShopIds)
	const { data: getTotalPriceQuery } = useQuery(
		['getTotalPriceQuery', ids],
		() => {
			return orderShopTemp.getTotalPrice({ orderShopTempIds: ids.toString() })
		},
		{
			select: (data) => data.Data,
			onSuccess: (res) => {
				console.log('res', res)
			}
		}
	)
	return (
		<div className="tableBox">
			<div className="flex justify-between mb-4 ">
				<h2 className="!mb-0 text-[#141046] font-semibold">Tổng tiền hàng</h2>
				<span className="font-bold text-orange text-[18px]">{_format.getVND(getTotalPriceQuery?.TotalPriceCNY || 0)}</span>
			</div>
			<div className="flex justify-between w-full mb-1 ">
				<p className="text-[#626262]">Phí mua hàng</p>
				<span>{_format.getVND(getTotalPriceQuery?.FeeBuyProCNY || 0)}</span>
			</div>

			<div className="flex justify-between w-full mb-1 ">
				<p className="text-[#626262]">Phí kiểm đếm</p>
				<span>{_format.getVND(getTotalPriceQuery?.CheckProductPrice || 0)}</span>
			</div>
			<div className="flex justify-between w-full mb-1 ">
				<p className="text-[#626262]">Phí đóng gỗ</p>
				<span>{_format.getVND(getTotalPriceQuery?.PackedPrice || 0)}</span>
			</div>
			<div className="flex justify-between w-full mb-1 ">
				<p className="text-[#626262]">Phí bảo hiểm</p>
				<span>{_format.getVND(getTotalPriceQuery?.InsuranceMoney || 0)}</span>
			</div>
			<div className="flex justify-between w-full mb-1 ">
				<p className="text-[#626262]">Phí giao hàng</p>
				<span>{_format.getVND(getTotalPriceQuery?.FastDeliveryPrice || 0)}</span>
			</div>

			<FormCheckbox
				label="Tôi đồng ý với các điều khoản đặt hàng của NHAPHANGB2B"
				control={control}
				name="IsAgreement"
				// rules={{ required: 'Vui lòng xác nhận trước khi thanh toán' }}
			/>
			<div className="text-label my-4 text-[#fa8d14]">Vui lòng xác nhận trước khi hoàn tất đơn hàng.</div>
			<div className="flex justify-end">
				<IconButton
					btnClass="w-[120px] text-orange py-2 rounded-xl bg-[#f8dfd5]"
					showLoading
					onClick={onPress}
					title="Hoàn tất"
					icon={loadingPayment ? 'fas fa-spinner fa-pulse' : 'fas fa-check-circle'}
					toolip={''}
					green
					disabled={loadingPayment}
				/>
			</div>
		</div>
	)
}
