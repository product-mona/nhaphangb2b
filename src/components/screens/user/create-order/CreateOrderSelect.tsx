import clsx from "clsx";
import {FC} from "react";
import {FormSelect, IconButton} from "~/components";
import {useAppSelector} from "~/store";
import {TControl} from "~/types/field";

type TProps = TControl<TUserCreateOrder> & {
	warehouseTQCatalogue: TWarehouseTQCatalogue[];
	warehouseVNCatalogue: TWarehouseVNCatalogue[];
	shippingTypeToWarehouseCatalogue: TShippingTypeToWarehouse[];
	user?: any;
};
const infoContainer = "flex items-center";
const listBox = "lg:flex items-center justify-end mt-4 w-full mb-4 px-4";

export const CreateOrderSelect: FC<TProps> = ({
	control,
	warehouseTQCatalogue,
	shippingTypeToWarehouseCatalogue,
	warehouseVNCatalogue,
	append,
	user,
}) => {
	const {current: newUser} = useAppSelector((state) => state.user);

	if (!newUser) return null;

	return (
		<>
			<div className="grid grid-cols-2 gap-4">
				<div className={clsx(infoContainer)}>
					<div className="IconFilter text-white bg-[#2A8BD5] text-center">
						<i className="fas fa-user"></i>
					</div>
					<div className="w-full pl-5">
						{!user ? (
							<div className="mt-2 xl:mt-0 w-full">
								<FormSelect
									data={user}
									control={control}
									name="UID"
									placeholder=""
									label="Username"
									select={{label: "UserName", value: "Id"}}
									defaultValue={{UserName: newUser?.UserName, Id: newUser?.UserId}}
									disabled
									required={false}
								/>
							</div>
						) : (
							<div className="mt-2 xl:mt-0 w-full">
								<FormSelect
									data={user}
									label="Username"
									control={control}
									name="UID"
									placeholder="Chọn khách hàng"
									select={{label: "UserName", value: "Id"}}
									rules={{required: "This field is required"}}
								/>
							</div>
						)}
					</div>
				</div>

				<div className={infoContainer}>
					<div className="IconFilter text-white bg-[#27A689] text-center">
						<i className="fas fa-shipping-fast"></i>
					</div>
					<div className="w-full pl-5">
						<FormSelect
							data={shippingTypeToWarehouseCatalogue}
							control={control}
							name="ShippingType"
							label="Phương thức vận chuyển"
							placeholder="Chọn phương thức vận chuyển"
							rules={{required: "This field is required"}}
							select={{label: "Name", value: "Id"}}
						/>
					</div>
				</div>

				<div className={infoContainer}>
					<div className="IconFilter text-white bg-[#F1A934] text-center">
						<i className="fas fa-warehouse"></i>
					</div>
					<div className="w-full pl-5">
						<FormSelect
							data={warehouseTQCatalogue}
							control={control}
							name="WarehouseTQ"
							label="Kho Trung Quốc"
							placeholder="Chọn kho TQ"
							rules={{required: "This field is required"}}
							select={{label: "Name", value: "Id"}}
						/>
					</div>
				</div>
				<div className={infoContainer}>
					<div className="IconFilter text-white bg-[#E54C36] text-center">
						<i className="fas fa-warehouse"></i>
					</div>
					<div className="w-full pl-5">
						<FormSelect
							data={warehouseVNCatalogue}
							control={control}
							name="WarehouseVN"
							label="Kho đích"
							placeholder="Chọn kho VN"
							rules={{required: "This field is required"}}
							select={{label: "Name", value: "Id"}}
						/>
					</div>
				</div>
			</div>

			<div className={listBox}>
				<IconButton
					icon="far fa-plus"
					title="Thêm kiện"
					onClick={() =>
						append({
							Id: new Date().getTime(),
							ImageProduct: null,
							LinkProduct: null,
							NameProduct: null,
							NoteProduct: null,
							PriceProduct: null,
							PropertyProduct: null,
							QuantityProduct: null,
						})
					}
					showLoading
					toolip=""
					green
				/>
			</div>
		</>
	);
};
