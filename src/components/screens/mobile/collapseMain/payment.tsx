import Link from "next/link";
import {_format} from "~/utils";
import styles from "./index.module.css";

export const Payment = () => {
	return (
		<div className={styles.collapseMain}>
			<Link href="/mobile/payment">
				<a className={styles.aLink}>Danh sách thanh toán hộ</a>
			</Link>
			<Link href="/mobile/payment/createPayment">
				<a className={styles.aLink}>Tạo thanh toán hộ</a>
			</Link>
		</div>
	);
};
