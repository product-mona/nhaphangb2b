import Link from "next/link";
import styles from "./index.module.css";

export const Transport = () => {
	return (
		<div className={styles.collapseMain}>
			<Link href="/mobile/transport">
				<a className={styles.aLink}>Danh sách ký gửi</a>
			</Link>
			<Link href="/mobile/transport/createTransport">
				<a className={styles.aLink}>Tạo đơn ký gửi</a>
			</Link>
		</div>
	);
};
