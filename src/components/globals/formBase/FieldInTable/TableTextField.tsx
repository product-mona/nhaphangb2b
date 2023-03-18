import { ErrorMessage } from '@hookform/error-message'
import { Input } from 'antd'
import clsx from 'clsx'
import _, { round } from 'lodash'
import React, { ComponentProps } from 'react'
import { Control, Controller, FieldValues, Path, RegisterOptions, useController } from 'react-hook-form'
import Select, { components, DropdownIndicatorProps, GroupBase, StylesConfig } from 'react-select'
import { TFieldSelect } from '~/types/field'
import { checkIsArray, _format } from '~/utils'

type TableTextFieldProps<T extends FieldValues> = {
	control: Control<T>
	name: Path<T>
	hideMessage?: boolean
	hideError?: boolean
	min?: number
}

export const TableTextField = <T extends FieldValues = FieldValues, TFieldDatas extends object = object>({
	control,
	name,
	hideMessage,
	hideError,
	// labelSx,
	onChange: onChangeFromOutside,
	min = 0,
	...rest
}: Omit<ComponentProps<typeof Input>, keyof TableTextFieldProps<T>> & TableTextFieldProps<T>) => {
	return (
		<div className={clsx('w-full')}>
			<div>
				<Controller
					control={control}
					name={name}
					render={({ field, fieldState }) => (
						<>
							<Input
								size="large"
								className={clsx(!!fieldState.isDirty && 'ring-1 ring-offset-1 ring-[#40a9ff]')}
								{...field}
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
