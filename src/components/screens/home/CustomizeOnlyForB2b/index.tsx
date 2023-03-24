import styles from './CustomizeOnlyForB2b.module.css'
import 'antd/dist/antd.css'

export const CustomizeOnlyForB2b = ({}) => {
	return (
		<div className={styles.BoxCustomize}>
			<div className={styles.BoxCustomizeContent}>
				<div className={styles.BoxTitle}>
					<h1 className={'titleSection text-[#4e8c1c]'}>VÌ SAO NÊN CHỌN NHẬP HÀNG B2B</h1>
				</div>
				<div className={styles.BoxImage}>
					<div
						style={{
							width: '100%',
							height: 'auto',
							backgroundColor: 'red'
						}}
					>
						<img
							alt={'Tai-sao-nen-chon-chung-toi'}
							src={'/four-reason.jpg'}
							style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
