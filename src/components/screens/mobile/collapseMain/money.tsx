import Link from "next/link";
import {_format} from "~/utils";
import styles from "./index.module.css";

export const Money = () => {
	return (
		<div className={styles.collapseMain}>
			<Link href="/mobile/money">
				<a className={styles.aLink}>Lịch sử giao dịch</a>
			</Link>
			<Link href="/mobile/money/create-recharge">
				<a className={styles.aLink}>Tạo yêu cầu nạp tiền</a>
			</Link>
			<Link href="/mobile/money/create-widthdrawal">
				<a className={styles.aLink}>Tạo yêu cầu rút tiền</a>
			</Link>
		</div>
	);
};
