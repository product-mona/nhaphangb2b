import { ErrorMessage } from "@hookform/error-message";
import { Input, InputProps } from "antd";
import clsx from "clsx";
import _ from "lodash";
import React, { ReactNode } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { _format } from "~/utils";

type TProps<TFieldValues> = {
  required?: boolean;
  name: Path<TFieldValues>;
  type?: InputProps["type"];
  label?: string;
  placeholder: string;
  rules?: RegisterOptions;
  control: Control<TFieldValues, object>;
  inputClassName?: string;
  inputContainerClassName?: string;
  addonBefore?: ReactNode;
  disabled?: boolean;
  hideError?: boolean;
  onEnter?: () => void;
  prefix?: React.ReactNode;
  onBlur?: () => void;
  allowClear?: boolean;
  homeType?: "login" | "register" | "forgetPass";
  autoComplete?: string;
};

export const FormInput = <TFieldValues extends FieldValues = FieldValues>({
  label,
  name,
  placeholder,
  rules,
  control,
  type = "text",
  disabled,
  required = true,
  inputClassName,
  addonBefore,
  inputContainerClassName,
  hideError = false,
  prefix,
  onEnter,
  onBlur,
  allowClear = false,
  homeType,
  autoComplete = "none",
}: TProps<TFieldValues>) => {
  return (
    <div className={`${inputContainerClassName} relative w-full`}>
      {label && (
        <label
          className="text-[12px] bg-white py-[2px] uppercase font-bold"
          htmlFor={name}
        >
          {label} {required === true && <span className="text-red">*</span>}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({
          field: { onChange, ...newField },
          fieldState: { error },
          formState: { errors },
        }) => {
          return (
            <div className="w-full">
              <Input
                disabled={disabled}
                type={type}
                addonBefore={addonBefore}
                placeholder={placeholder}
                {...newField}
                onKeyPress={(e) => {
                  if (e.code === "Enter") {
                    onEnter?.();
                  }
                }}
                onChange={!disabled && onChange}
                prefix={prefix}
                className={clsx(
                  inputClassName,
                  "h-10 rounded-xl md:text-sm text-xs",
                  !_.isEmpty(error) && "!border-warning"
                )}
                allowClear={allowClear}
                autoComplete={autoComplete}
              />
              {!hideError && (
                <ErrorMessage
                  errors={errors}
                  name={name as any}
                  render={({ message }) => (
                    <p
                      className={`text-warning text-xs font-medium mt-1 absolute top-0 right-0`}
                    >
                      {message}
                    </p>
                  )}
                />
              )}
            </div>
          );
        }}
      />
    </div>
  );
};
