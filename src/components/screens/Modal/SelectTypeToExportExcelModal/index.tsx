import { Card, Divider, Modal, Radio, RadioChangeEvent } from 'antd'
import { FC, useState } from 'react'
import { IconButton } from '~/components/globals/button/IconButton'
import styles from './index.module.css'

type FCProps = {
	isOpen: boolean
	onClose: () => void
	onExport: (storeIndex: 0 | 1, isCNY: boolean) => void
}
export const SelectTypeToExportExcelModal: FC<FCProps> = ({ isOpen, onClose, onExport }) => {
	const [storeIndex, setStoreIndex] = useState<1 | 0>(0)
	const [isCurrencyCNY, setIsCurrencyCNY] = useState(0)
	const onChangeStoreIndex = (e: RadioChangeEvent) => {
		setStoreIndex(e.target.value)
	}
	const onChangeCNY = (e: RadioChangeEvent) => {
		setIsCurrencyCNY(e.target.value)
	}
	return (
		<Modal
			visible={isOpen}
			title={<p className="text-[18px]">Chọn cấu hình file excel xuất thông kê</p>}
			onOk={() => {
				alert(`Bạn vừa chọn in Đơn: ${storeIndex}, CNY ${!!isCurrencyCNY}`)
			}}
			footer={false}
			onCancel={onClose}
		>
			<div className="p-6">
				<div className={`${styles.boxRadio} mb-4`}>
					<div className={`${styles.boxRadioTitle}`}>
						<p>Loại đơn</p>
					</div>
					<div className="p-4">
						<Radio.Group onChange={onChangeStoreIndex} value={storeIndex}>
							<Radio value={0}>Đơn lớn</Radio>
							<Radio value={1}>Đơn nhỏ</Radio>
						</Radio.Group>
					</div>
				</div>
				<div className={`${styles.boxRadio}`}>
					<div className={`${styles.boxRadioTitle}`}>
						<p>Tiền tệ</p>
					</div>
					<div className="p-4">
						<Radio.Group onChange={onChangeCNY} value={isCurrencyCNY}>
							<Radio value={0}>Việt nam đồng</Radio>
							<Radio value={1}>Nhân dân tệ</Radio>
						</Radio.Group>
					</div>
				</div>
			</div>
			<Divider className="!m-0" />
			<div className="py-4 flex justify-end">
				<IconButton
					title="Đóng"
					onClick={() => {
						onClose()
					}}
					btnClass={'lg:mx-4 bg-[transparent] !text-black hover:bg-[transparent]'}
					icon=""
					btnIconClass=""
					showLoading
				/>
				<IconButton
					title="Xuất Thống Kê"
					onClick={() => {
						// exportExcel()
						onExport(storeIndex, !!isCurrencyCNY)
					}}
					btnClass={'lg:mx-4'}
					icon="fas fa-file-export"
					btnIconClass=""
					showLoading
				/>
			</div>
		</Modal>
	)
}
