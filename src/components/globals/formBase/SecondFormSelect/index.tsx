import { ErrorMessage } from '@hookform/error-message'
import clsx from 'clsx'
import _ from 'lodash'
import React, { ComponentProps } from 'react'
import { Control, Controller, FieldValues, Path, RegisterOptions, useController } from 'react-hook-form'
import Select, { components, DropdownIndicatorProps, GroupBase, StylesConfig } from 'react-select'
import { TFieldSelect } from '~/types/field'
import { checkIsArray, _format } from '~/utils'

type SecondFormSelectProps<T extends FieldValues> = {
	options: any[]
	isLoading?: boolean
	placeholder?: string
	opacity?: number
	isMulti?: boolean
	label?: string
	// labelSx?: ComponentProps<typeof Typography>['sx']
	hideMessage?: boolean
	required?: boolean
	onChange?: (value: any) => void
	getOptionValue: (value: any) => any
	getOptionLabel: (value: any) => any
	saveOnBlur?: boolean
	control: Control<T>
	name: Path<T>
}

export const SecondFormSelect = <T extends FieldValues = FieldValues, TFieldDatas extends object = object>({
	control,
	isLoading,
	hideMessage,
	label,
	// labelSx,
	required,
	name,
	opacity,
	onChange,
	getOptionValue = (x) => x.value,
	placeholder = 'Chọn...',
	saveOnBlur,
	options,
	isMulti,
	...rest
}: Omit<ComponentProps<typeof Select>, keyof SecondFormSelectProps<T>> & SecondFormSelectProps<T>) => {
	const { field, fieldState } = useController({
		control,
		name
	})
	return (
		<div className={clsx('w-full')}>
			{label && (
				<label className="text-[12px] bg-white py-[2px] uppercase font-bold" htmlFor={name}>
					{label} {required === true && <span className="text-red">*</span>}
				</label>
			)}
			<div>
				<Select
					isMulti={isMulti}
					classNamePrefix="select"
					menuPosition="fixed"
					components={{ DropdownIndicator: DropdownIndicator }}
					value={
						isMulti
							? options?.filter((o) => (checkIsArray(field.value) ? field.value.includes(getOptionValue(o)) : null))
							: options?.find((x) => (getOptionValue(x) === field.value) as any) || null
					}
					onChange={(value: any) => {
						if (!value) {
							field.onChange('')
							// helpers.setValue(null);
							// @ts-ignorea
							onChange?.('')
							return
						}
						if (isMulti) field.onChange(...value.map((x: any) => getOptionValue(x)))
						else field.onChange(getOptionValue(value))
						onChange?.(value)
					}}
					isLoading={isLoading}
					placeholder={placeholder}
					options={options}
					getOptionValue={getOptionValue as any}
					styles={{ ..._format.customStyles }}
					{...rest}
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
