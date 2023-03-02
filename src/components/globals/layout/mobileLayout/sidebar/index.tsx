import {Menu} from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import router from "next/router";
import styles from "./index.module.css";

const menu = [
	{
		icon: "fas fa-home",
		title: "Trang chủ",
		path: "/mobile",
	},
	{
		icon: "fas fa-search",
		title: "Tracking",
		path: "/mobile/report/tracking",
	},
	{
		icon: "fas fa-shopping-basket",
		title: "Đơn mua hộ",
		children: [
			{
				title: "Đơn mua hộ",
				path: "/mobile/buyOrder/order",
			},
			{
				title: "Đơn mua hộ khác",
				path: "/mobile/buyOrder/anotherOrder",
			},
			{
				title: "Tạo đơn mua hộ",
				path: "/mobile/buyOrder/createOrder",
			},
		],
	},
	{
		icon: "fas fa-dolly",
		title: "Đơn ký gửi",
		children: [
			{
				title: "Danh sách ký gửi",
				path: "/mobile/transport",
			},
			{
				title: "Tạo đơn ký gửi",
				path: "/mobile/transport/createTransport",
			},
		],
	},
	{
		icon: "fas fa-credit-card",
		title: "Thanh toán hộ",
		children: [
			{
				title: "Danh sách thanh toán hộ",
				path: "/mobile/payment",
			},
			{
				title: "Tạo thanh toán hộ",
				path: "/mobile/payment/createPayment",
			},
		],
	},
	{
		icon: "fas fa-money-check-edit-alt",
		title: "Tài chính",
		children: [
			{
				title: "Lịch sử giao dịch",
				path: "/mobile/money",
			},
			{
				title: "Tạo yêu cầu nạp tiền",
				path: "/mobile/money/create-recharge",
			},
			{
				title: "Tạo yêu cầu rút tiền",
				path: "/mobile/money/create-widthdrawal",
			},
		],
	},
	{
		icon: "fas fa-exclamation-square",
		title: "Kiếu nại",
		path: "/mobile/report",
	},
];

const Sidebar = () => {
	return (
		<div className={styles.sibar}>
			<div className={styles.sidebarTop}>
				<a className={styles.aLink} href="#">
					Đăng nhập
				</a>
				<span>hoặc</span>
				<a className={styles.aLink} href="#">
					Đăng ký tài khoản
				</a>
			</div>
			<div className={styles.sidebarBottom}>
				<Menu mode="inline" className="mobile-sidebar-menu" style={{backgroundColor: "unset"}}>
					{menu?.map((m) => {
						return m?.children ? (
							<SubMenu
								key={`${m.path}-${m.title}`}
								className="mobile-sidebar-submenu"
								title={
									<a className="mobile-sidebar-menu-item !p-0">
										<span className={styles.menuSideBarIcon}>
											<i className={m?.icon}></i>
										</span>
										<span className="menu-sideBar-title">{m?.title}</span>
									</a>
								}
							>
								{m?.children.map((c, i) => (
									<Menu.Item
										className="mobile-sidebar-menu-item !p-0"
										key={`${c.path}-i`}
										onClick={() => router.push(c.path)}
									>
										<span className="menu-sideBar-title-submenu">{c?.title}</span>
									</Menu.Item>
								))}
							</SubMenu>
						) : (
							<Menu.Item
								className="mobile-sidebar-menu-item"
								key={`${m.path}-${m.title}`}
								onClick={() => router.push(m.path)}
							>
								<span className={styles.menuSideBarIcon}>
									<i className={m?.icon}></i>
								</span>
								<span className="menu-sideBar-title">{m?.title}</span>
							</Menu.Item>
						);
					})}
				</Menu>
			</div>
		</div>
	);
};

export default Sidebar;
