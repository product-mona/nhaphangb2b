import Link from "next/link";
import styles from "./index.module.css";

export const Report = () => {
	return (
		<div className={styles.collapseMain}>
			<Link href="/mobile/report/tracking">
				<a className={styles.aLink}>Tracking</a>
			</Link>
			<Link href="/mobile/report">
				<a className={styles.aLink}>Danh sách kiếu nại</a>
			</Link>
		</div>
	);
};
