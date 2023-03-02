import React from "react";
import {FormInput, FormEditor} from "~/components";
import {FormSwitch} from "~/components/globals/formBase";
import {TControl} from "~/types/field";

export const AddArticleCategoryForm: React.FC<TControl<TArticleCategory & {sideBar: boolean}>> = ({control}) => {
	return (
		<React.Fragment>
			<div className="grid grid-cols-2 gap-4 p-4">
				<div className="col-span-1">
					<FormInput
						control={control}
						label="Tên chuyên mục"
						placeholder="Nhập tên chuyên mục"
						name="Name"
						rules={{
							required: "không bỏ trống tên chuyên mục",
						}}
					/>
				</div>
				<div className="col-span-1">
					<FormSwitch control={control} name="sideBar" label="Hiện sidebar" />
				</div>
				<div className="col-span-2">
					<FormEditor control={control} label="" name="Description" required={false} />
				</div>
			</div>
		</React.Fragment>
	);
};
