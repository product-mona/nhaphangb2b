import { ErrorMessage } from '@hookform/error-message'
import { Input, InputProps } from 'antd'
import clsx from 'clsx'
import _ from 'lodash'
import React, { ComponentProps, ReactNode } from 'react'
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form'
import { _format } from '~/utils'

type SecondFormInputProps<TFieldValues> = {
	required?: boolean
	name: Path<TFieldValues>
	hideError?: boolean
	control: Control<TFieldValues, object>
	label?: string

	//   placeholder: string;
	//   rules?: RegisterOptions;
	//   inputClassName?: string;
	//   inputContainerClassName?: string;
	//   addonBefore?: ReactNode;
	//   disabled?: boolean;
	//   onEnter?: () => void;
	//   prefix?: React.ReactNode;
	//   onBlur?: () => void;
	//   allowClear?: boolean;
	//   homeType?: "login" | "register" | "forgetPass";
	//   autoComplete?: string;
}
const { TextArea } = Input
export const SecondFormTextArea = <TFieldValues extends FieldValues = FieldValues>({
	label,
	name,
	control,

	required = true,
	hideError = false,

	...rest
}: Omit<ComponentProps<typeof Input.TextArea>, keyof SecondFormInputProps<TFieldValues>> & SecondFormInputProps<TFieldValues>) => {
	return (
		<div className={`relative w-full`}>
			{label && (
				<label className="text-[12px] bg-white py-[2px] uppercase font-bold" htmlFor={name}>
					{label} {required === true && <span className="text-red">*</span>}
				</label>
			)}
			<Controller
				control={control}
				name={name}
				render={({ field, fieldState: { error }, formState: { errors } }) => {
					return (
						<div className="w-full">
							<TextArea
								className={clsx('h-10 rounded-xl md:text-sm text-xs', !_.isEmpty(error) && '!border-warning')}
								{...field}
								{...rest}
							/>
							{!hideError && (
								<ErrorMessage
									errors={errors}
									name={name as any}
									render={({ message }) => (
										<p className={`text-warning text-xs font-medium mt-1 absolute top-0 right-0`}>{message}</p>
									)}
								/>
							)}
						</div>
					)
				}}
			/>
		</div>
	)
}
