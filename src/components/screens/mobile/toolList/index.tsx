import Link from "next/link";
import styles from "./index.module.css";

export const ToolList = () => {
	return (
		<ul className={styles.toolList}>
			<Link href="/mobile/report/tracking">
				<li className={styles.toolItem}>
					<span className={styles.toolIcon}>
						<i className="fas fa-search"></i>
					</span>
					<span className={styles.toolTitle}>Tracking</span>
				</li>
			</Link>
			<Link href="/mobile/buyOrder/order">
				<li className={styles.toolItem}>
					<span className={styles.toolIcon}>
						<i className="fas fa-shopping-basket"></i>
					</span>
					<span className={styles.toolTitle}>Mua hàng hộ</span>
				</li>
			</Link>
			<Link href="/mobile/transport">
				<li className={styles.toolItem}>
					<span className={styles.toolIcon}>
						<i className="fas fa-dolly"></i>
					</span>
					<span className={styles.toolTitle}>Vận chuyện hộ</span>
				</li>
			</Link>
			<Link href="/mobile/payment">
				<li className={styles.toolItem}>
					<span className={styles.toolIcon}>
						<i className="fas fa-credit-card"></i>
					</span>
					<span className={styles.toolTitle}>Thanh toán hộ</span>
				</li>
			</Link>
		</ul>
	);
};
