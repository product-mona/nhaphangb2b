import React from 'react'
import { FormEditor, FormInput, FormInputNumber, FormSwitch } from '~/components/globals/formBase'
import { TControl } from '~/types/field'

export const EditArticleCategoryForm: React.FC<TControl<TArticleCategory>> = ({ control }) => {
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
							required: 'Không bỏ trống tên chuyên mục'
						}}
					/>
				</div>
				<div className="flex justify-between">
					<div className="mt-4 w-1/2">
						<FormSwitch control={control} name="Active" label={'Hiển thị chuyên mục?'} />
					</div>
					<div className="w-1/2">
						<FormInputNumber
							control={control}
							label="Vị trí"
							placeholder="Vị trí"
							name="Position"
							rules={{
								required: 'Không bỏ trống vị trí'
							}}
						/>
					</div>
				</div>
				<div className="col-span-2">
					<FormEditor control={control} label="" name="Description" required={false} />
				</div>
			</div>
		</React.Fragment>
	)
}
