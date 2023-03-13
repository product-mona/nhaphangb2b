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
}

export const TableMoneyField = <T extends FieldValues = FieldValues, TFieldDatas extends object = object>({
	control,
	name,
	hideMessage,
	hideError,
	// labelSx,
	onChange: onChangeFromOutside,
	min = 0,
	...rest
}: Omit<ComponentProps<typeof InputNumber>, keyof TableMoneyFieldProps<T>> & TableMoneyFieldProps<T>) => {
	return (
		<div className={clsx('w-full')}>
			<div>
				<Controller
					control={control}
					name={name}
					render={({ field, fieldState }) => (
						<>
							<InputNumber
								min={min}
								className={clsx(!!fieldState.isDirty && 'ring-2 ring-[#f14f04]')}
								{...field}
								{...rest}
								// onChange={(e) => {
								// 	if (!!e.target.value) {
								// 		field.onChange(+e.target.value)
								// 	} else field.onChange(0)
								// 	onChangeFromOutside?.(e)
								// }}
							/>
							{!!fieldState.error && <p className="text-warning text-xs font-medium mt-1">{fieldState.error?.message}</p>}
						</>
					)}
				/>
			</div>
		</div>
	)
}

const DropdownIndicator: React.FC<DropdownIndicatorProps> = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<span className="h-full cursor-pointer px-3">
				<i className="text-[#6b6f82] text-base far fa-chevron-down"></i>
			</span>
		</components.DropdownIndicator>
	)
}
