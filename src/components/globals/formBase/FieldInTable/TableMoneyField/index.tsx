import { ErrorMessage } from '@hookform/error-message'
import { InputNumber } from 'antd'
import clsx from 'clsx'
import _ from 'lodash'
import React, { ComponentProps } from 'react'
import { Control, Controller, FieldValues, Path, RegisterOptions, useController } from 'react-hook-form'
import Select, { components, DropdownIndicatorProps, GroupBase, StylesConfig } from 'react-select'
import { TFieldSelect } from '~/types/field'
import { checkIsArray, _format } from '~/utils'

type TableMoneyFieldProps<T extends FieldValues> = {
	control: Control<T>
	name: Path<T>
	hideMessage?: boolean
	hideError?: boolean
	min?: number
	size?: ComponentProps<typeof InputNumber>['size']
}

export const TableMoneyField = <T extends FieldValues = FieldValues, TFieldDatas extends object = object>({
	control,
	name,
	hideMessage,
	hideError,
	// labelSx,
	onChange: onChangeFromOutside,
	min = 0,
	size = 'middle',
	...rest
}: Omit<ComponentProps<typeof InputNumber>, keyof TableMoneyFieldProps<T>> & TableMoneyFieldProps<T>) => {
	return (
		<div className={clsx('w-full')}>
			<div>
				<Controller
					control={control}
					name={name}
					render={({ field: { onChange, ...restField }, fieldState }) => (
						<>
							<InputNumber
								min={min}
								size={size}
								className={clsx(!!fieldState.isDirty && 'ring-1 ring-offset-1 ring-[#40a9ff]')}
								onChange={(vl) => {
									if (vl === null) {
										onChange(0)
									} else {
										onChange(vl)
									}
								}}
								{...restField}
								{...rest}
							/>
							{!!fieldState.error && <p className="text-warning text-xs font-medium mt-1">{fieldState.error?.message}</p>}
						</>
					)}
				/>
			</div>
		</div>
	)
}
