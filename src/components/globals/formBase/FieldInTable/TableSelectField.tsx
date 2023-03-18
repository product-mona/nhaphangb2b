import { ErrorMessage } from '@hookform/error-message'
import clsx from 'clsx'
import _ from 'lodash'
import React, { ComponentProps } from 'react'
import { Control, Controller, FieldValues, Path, RegisterOptions, useController } from 'react-hook-form'
import Select, { components, DropdownIndicatorProps, GroupBase, StylesConfig } from 'react-select'
import { TFieldSelect } from '~/types/field'
import { checkIsArray, _format } from '~/utils'

export const DropdownIndicator = (props: any) => {
	return (
		<components.DropdownIndicator {...props}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				version="1.1"
				width="18"
				height="18"
				x="0"
				y="0"
				viewBox="0 0 24 24"
				xmlSpace="preserve"
			>
				<g>
					<path
						xmlns="http://www.w3.org/2000/svg"
						d="M6.414,9H17.586a1,1,0,0,1,.707,1.707l-5.586,5.586a1,1,0,0,1-1.414,0L5.707,10.707A1,1,0,0,1,6.414,9Z"
						fill="inherit"
						data-original="#000000"
					/>
				</g>
			</svg>
		</components.DropdownIndicator>
	)
}
type TableSelectFieldProps<T extends FieldValues> = {
	options: any[]
	isLoading?: boolean
	placeholder?: string
	opacity?: number
	isMulti?: boolean
	label?: string
	hideMessage?: boolean
	required?: boolean
	onChange?: (value: any) => void
	getOptionValue: (value: any) => any
	getOptionLabel: (value: any) => any
	saveOnBlur?: boolean
	control: Control<T>
	name: Path<T>
}
const customSmallSelectStyles = {
	control: (provided: any, state: any) => ({
		...provided, //#152c8e
		// boxShadow: state.isFocused && 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) #152C8E',
		boxSizing: 'border-box',
		boxShadow: 'none',
		borderWidth: '1px',
		borderColor: state.isFocused ? 'rgba(0,0,0,0.4)' : '#d9d9d9',
		minHeight: '40px',
		minWidth: '78px',
		width: '100%',
		transition: 'borderColor 2s ease-in-out'
	}),
	menu: (provided: any, state: any) => ({
		...provided,
		width: state.selectProps.width,
		color: state.selectProps.menuColor,
		border: 'none',
		zIndex: 1000
	}),
	menuPortal: (provided: any, state: any) => ({
		...provided,

		zIndex: 1000
	}),
	dropdownIndicator: (provided: any, state: any) => ({
		...provided,
		fill: '#D32240',
		marginRight: '8px'

		// marginTop: '8px'
	}),
	indicatorSeparator: (provided: any, state: any) => ({
		...provided,
		display: 'none'
	}),
	option: (provided: any, state: any) => ({
		...provided,
		backgroundColor: state.isSelected && '#38b448',
		'&:hover': {
			backgroundColor: state.isSelected ? '#38b448' : '#eaf0ea'
		}
	}),
	clearIndicator: (provided: any, state: any) => ({
		...provided,
		padding: '8px 0'
	}),
	singleValue: (provided: any, state: any) => ({
		...provided,
		color: '#008d4b'
	}),

	valueContainer: (provided: any, state: any) => ({
		...provided,
		height: '100%',
		padding: '0 8px'
	}),
	placeholder: (provided: any, state: any) => ({
		...provided,
		display: '-webkit-box',
		WebkitLineClamp: 2,
		WebkitBoxOrient: 'vertical',
		overflow: 'hidden'
	})
}
export const TableSelectField = <T extends FieldValues = FieldValues, TFieldDatas extends object = object>({
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
}: Omit<ComponentProps<typeof Select>, keyof TableSelectFieldProps<T>> & TableSelectFieldProps<T>) => {
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
					ref={field.ref}
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
					styles={customSmallSelectStyles}
					// styles={{ ..._format.customStyles }}
					{...rest}
				/>

				{!!fieldState.error && <p className="text-warning text-xs font-medium mt-1">{fieldState.error?.message}</p>}
			</div>
		</div>
	)
}
