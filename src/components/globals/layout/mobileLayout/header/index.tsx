import {Drawer} from "antd";
import {useState} from "react";
import {_format} from "~/utils";
import Sidebar from "../sidebar";
import styles from "./index.module.css";

const Header = () => {
	const [menuActive, setMenuActive] = useState(false);

	return (
		<header className={styles.header}>
			<div className={styles.topHeader}>
				<div>
					<div className={styles.sibar} onClick={() => setMenuActive(!menuActive)}>
						<span className={styles.controlIcon}>
							<i className="fas fa-bars"></i>
						</span>
					</div>

					<Drawer
						placement="left"
						maskStyle={{backgroundColor: "#00000080"}}
						onClose={() => setMenuActive(!menuActive)}
						closable={false}
						visible={menuActive}
						width={"70vw"}
						className="mobile-drawer"
					>
						<Sidebar />
					</Drawer>
				</div>
				<ul className={styles.controlList}>
					<li className={styles.controlItem}>
						<span className={styles.controlIcon}>
							<i className="fas fa-yen-sign"></i>
						</span>
						<span className={styles.recharge}>{_format.getVND(3665, "")}</span>
					</li>
					<li className={styles.controlItem}>
						<span className={styles.controlIcon}>
							<i className="fas fa-home"></i>
						</span>
					</li>
					<li className={styles.controlItem}>
						<span className={styles.controlIcon}>
							<i className="fas fa-shopping-cart"></i>
						</span>
					</li>
					<li className={styles.controlItem}>
						<span className={styles.controlIcon}>
							<i className="fas fa-bell"></i>
						</span>
					</li>
				</ul>
			</div>
			<div className={styles.bottomHeader}>
				<ul className={styles.siteList}>
					<li className={`${styles.siteItem} bg-[#fe4e15]`}>
						<img src="/taobao.png" alt="" />
					</li>
					<li className={`${styles.siteItem} bg-[#e9303d]`}>
						<img src="/tmall.png" alt="" />
					</li>
					<li className={`${styles.siteItem} bg-[#ff2a00]`}>
						<img src="/1688.png" alt="" />
					</li>
				</ul>
			</div>
		</header>
	);
};

export default Header;
