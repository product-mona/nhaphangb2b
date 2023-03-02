import Link from "next/link";
import styles from "./index.module.css";

export const Order = () => {
	return (
		<div className={styles.collapseMain}>
			<Link href="/mobile/buyOrder/order">
				<a className={styles.aLink}>Đơn mua hộ</a>
			</Link>
			<Link href="/mobile/buyOrder/anotherOrder">
				<a className={styles.aLink}>Đơn mua hộ khác</a>
			</Link>
			<Link href="/mobile/buyOrder/createOrder">
				<a className={styles.aLink}>Tạo đơn mua hộ khác</a>
			</Link>
		</div>
	);
};
