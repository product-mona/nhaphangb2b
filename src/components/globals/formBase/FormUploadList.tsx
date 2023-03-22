import { ErrorMessage } from '@hookform/error-message'
import { Upload, UploadProps, Modal } from 'antd'
import { RcFile } from 'antd/es/upload/interface'
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import clsx from 'clsx'
import React, { useMemo, useState } from 'react'
import { ArrayPath, Control, FieldValues, Path, RegisterOptions, useController, useFieldArray } from 'react-hook-form'
import { useMutation } from 'react-query'
import { baseFile } from '~/api'
import { toast } from '~/components/toast'
import { useDeepEffect } from '~/hooks'
import { _format } from '~/utils'

type TProps<T extends FieldValues> = {
	control: Control<T>
	required?: boolean
	name: ArrayPath<T>
	label?: string

	// rules?: RegisterOptions;
	// maxCount?: number;
	listType?: 'picture' | 'picture-card' | 'text'
	// image?: boolean;
	// fileType?: string | string[];
	// messsageFileType?: string;
	// messsageFileMB?: string;
	megabyte?: number
	disabled?: boolean
	maxLength?: number
}

const getBase64 = (file: RcFile): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => resolve(reader.result as string)
		reader.onerror = (error) => reject(error)
	})

export const FormUploadList = <TFieldValues extends FieldValues = FieldValues>({
	control,
	label,
	name,
	required = false,
	// rules,
	// maxCount = 1,
	maxLength = 3,
	listType = 'picture-card',

	// image = false,

	// fileType = ["image/jpeg", "image/png"],
	// messsageFileMB,
	// messsageFileType,
	megabyte = 2,
	disabled = false
}: TProps<TFieldValues>) => {
	const [previewOpen, setPreviewOpen] = useState(false)
	const [previewImage, setPreviewImage] = useState('')

	// const [fileList, setFileList] = useState<UploadFile[]>([
	// 	{
	// 		uid: '-1',
	// 		name: 'image.png',
	// 		status: 'done',
	// 		url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
	// 	},
	// 	{
	// 		uid: '-2',
	// 		name: 'image.png',
	// 		status: 'done',
	// 		url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
	// 	}
	// 	// {
	// 	// 	uid: '-3',
	// 	// 	name: 'image.png',
	// 	// 	status: 'done',
	// 	// 	url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
	// 	// },
	// 	// {
	// 	// 	uid: '-4',
	// 	// 	name: 'image.png',
	// 	// 	status: 'done',
	// 	// 	url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
	// 	// }
	// ])

	const { fields, append, prepend, remove, swap, move, insert, replace, update } = useFieldArray<any>({
		control,
		name: name
	})
	const filesList: UploadFile[] = useMemo(() => {
		return fields.map((vl: any, idx) => {
			return {
				uid: `-${idx + 1}`,
				name: vl.url,
				status: 'done',
				url: vl.url
			}
		})
	}, [fields])
	const handleCancel = () => setPreviewOpen(false)
	const handlePreview = async (file: UploadFile) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj as RcFile)
		}

		setPreviewImage(file.url || (file.preview as string))
		setPreviewOpen(true)
	}
	// const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
	// 	console.log(newFileList)
	// 	// setFileList(newFileList);
	// }
	const mutationUpload = useMutation(baseFile.uploadFile)
	const handleChange: UploadProps['onChange'] = async (info) => {
		// 	const res = await baseFile.uploadFile(info.file?.originFileObj);
		// if (!res.Success) return;
		// onChange(res.Data);
		// info.file.status = "done";
		if (info.file?.status === 'removed') {
			const indexFound = fields.findIndex((x: any) => x.url === info.file.url)
			remove(indexFound)
		}
		if (info.file?.status === 'uploading') {
			const res = await mutationUpload.mutateAsync(info.file?.originFileObj, {
				onSuccess: (res) => {
					if (!!res.Success) {
						append({
							uid: `-${fields.length + 1}`,
							url: res.Data,
							name: res.Data,
							status: 'done'
						})
						append
					}
				}
			})
		}
		// console.log(e)
		// setFileList(newFileList);
	}
	return (
		<React.Fragment>
			{label && (
				<label className="text-[12px] py-[2px] uppercase font-bold" htmlFor={name}>
					{label} {required === true && <span className="text-red">*</span>}
				</label>
			)}
			<div>
				<Upload
					// {...newField}
					// onChange={(info) => {
					// 	if (info.file.size / 1024 / 1024 < megabyte) {
					// 		handleChange(info);
					// 	}
					// }}
					listType="picture-card"
					onChange={handleChange}
					// onPreview={_format.previewImage}
					onPreview={handlePreview}
					disabled={disabled}
					fileList={filesList}
					// fileList={!image && typeof fileList !== "string" ? fileList : undefined}

					// listType={listType}
					// beforeUpload={(file) => _format.beforeUpload(file, fileType, mb, messsageFileType, messsageFileMB)}
					// className={className}
					// maxCount={maxCount}
					// showUploadList={!image}
				>
					{filesList.length >= maxLength ? null : <i className={clsx('far fa-plus', 'text-xl')}></i>}
				</Upload>
				<Modal visible={previewOpen} footer={null} onCancel={handleCancel}>
					<img alt="example" style={{ width: '100%' }} src={previewImage} />
				</Modal>
			</div>
		</React.Fragment>
	)
}
