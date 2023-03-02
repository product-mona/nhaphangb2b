import {_format} from "~/utils";
import styles from "./index.module.css";

export const Surplus = () => {
	return (
		<div className={styles.surplus}>
			<div className={styles.surplusTop}>
				<span className={styles.surplusIcon}>
					<i className="fas fa-sack-dollar"></i>
				</span>
				<span className={styles.surplusTitle}>Số dư</span>
			</div>
			<div className={styles.surplusBottom}>
				<span className={styles.surplusValue}>{_format.getVND(100000000)}</span>
				<div className={styles.surplusButton}>lịch sử giao dịch</div>
			</div>
		</div>
	);
};
