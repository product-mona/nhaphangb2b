import { FC, useState } from 'react'
import styles from './index.module.css'
import { FileUploader } from 'react-drag-drop-files'
import { baseFile } from '~/api'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useMutation } from 'react-query'
import { Button, Spin, Tooltip } from 'antd'
import { toast } from '~/components/toast'
export const BoxGetImageUrl: FC<any> = () => {
	const [files, setFiles] = useState<any[]>([])

	const mutationUploadList = useMutation((FileList: any[]) => Promise.all(FileList.map((file) => baseFile.uploadFile(file))), {
		onSuccess: (res) => {
			setFiles((files) => {
				const newFiles = files.concat(res)
				return newFiles
			})
		},
		onError: (err) => {
			console.log('errUJpl', err)
		}
	})

	const handleChange = (file: any) => {
		baseFile.uploadFile(file)
	}
	const uploadViewBox = () => {
		return (
			<div className={`${styles.UploadBox}`}>
				<div className="flex items-center gap-3">
					<span
						style={{
							fill: '#00a759'
						}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" id="Bold" viewBox="0 0 24 24" width="16" height="16">
							<path d="M19.5,0H4.5A4.505,4.505,0,0,0,0,4.5v15A4.505,4.505,0,0,0,4.5,24h15A4.505,4.505,0,0,0,24,19.5V4.5A4.505,4.505,0,0,0,19.5,0ZM4.5,3h15A1.5,1.5,0,0,1,21,4.5v15a1.492,1.492,0,0,1-.44,1.06l-8.732-8.732a4,4,0,0,0-5.656,0L3,15V4.5A1.5,1.5,0,0,1,4.5,3Z" />
							<circle cx="15.5" cy="7.5" r="2.5" />
						</svg>
					</span>
					<p className="text-[#00a759] font-semibold text-base uppercase">
						Kéo thả hoặc thêm hình để lấy link chèn bài viết tối ưu tốc độ tải trang
					</p>
				</div>
				<p className="text-[#858585] text-sm">Chỉ được upload hình ảnh</p>
			</div>
		)
	}
	return (
		<div className="h-auto bg-wheat">
			<div className="flex justify-between gap-6">
				<div className="w-1/2">
					<FileUploader
						multiple={true}
						handleChange={(files: any) => {
							const updatedFiles = [...files]
							mutationUploadList.mutateAsync(updatedFiles)
						}}
						name="file"
						types={['jpg', 'png', 'gif']}
						// disabled={mutation.isLoading}
					>
						{uploadViewBox()}
					</FileUploader>
				</div>

				<div className={`${styles.RenderBox}`}>
					<p className="font-semibold text-base">Link hình nhận được:</p>
					<Spin spinning={mutationUploadList.isLoading}>
						{!!files.length
							? files.map((vl: any, idx: number) => {
									return (
										<div key={`FileUploader-${idx}`} className="flex justify-between gap-8 mb-1">
											<p className="truncate">
												{idx + 1}. {vl.Data}
											</p>

											<CopyToClipboard
												text={vl.Data}
												onCopy={(text, result) => {
													if (!!result) {
														toast.success('Sao chép link thành công')
													} else {
														toast.error('Sao chép link thất bại')
													}
												}}
											>
												<Tooltip title="Copy link">
													<span className="fill-[#858585] cursor-pointer">
														<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
															<g id="_01_align_center" data-name="01 align center">
																<path d="M22,4.145,17.986,0H10A3,3,0,0,0,7,3V4H5A3,3,0,0,0,2,7V24H18V19h4ZM16,22H4V7A1,1,0,0,1,5,6H7V19h9ZM9,17V3a1,1,0,0,1,1-1h6V6h4V17Z" />
															</g>
														</svg>
													</span>
												</Tooltip>
											</CopyToClipboard>
										</div>
									)
							  })
							: null}
					</Spin>
				</div>
			</div>
		</div>
	)
}
