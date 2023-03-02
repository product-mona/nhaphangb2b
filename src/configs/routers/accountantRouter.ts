export const accountantRouter = [
	{
		group: "Thanh toán xuất kho",
		controllers: [
			{
				path: "/manager/money/out-stock-payment",
				name: "Thanh toán xuất kho",
				icon: "fad fa-abacus",
			},
		],
	},
	{
		group: "Nạp rút - tiền",
		icon: "far fa-computer-classic",
		controllers: [
			{
				path: "javascript:;",
				name: "Nạp rút - tiền",
				icon: "fas fa-hands-usd",
				childrens: [
					{
						path: "/manager/money/personal-recharge",
						name: "Nạp tiền cá nhân",
					},
					{
						path: "/manager/money/recharge-history",
						name: "Yêu cầu nạp",
					},
					{
						path: "/manager/money/withdrawal-history",
						name: "Yêu cầu rút",
					},
				],
			},
		],
	},
	{
		group: "Thống kê tổng quan",
		icon: "far fa-computer-classic",
		controllers: [
			{
				path: "javascript:;",
				name: "Thống kê tổng quan",
				icon: "fas fa-chart-bar",
				childrens: [
					{
						path: "/manager/statistical/sales",
						name: "Doanh thu",
					},
					{
						path: "/manager/statistical/purchase-profit",
						name: "Lợi nhuận mua hộ",
					},
					{
						path: "/manager/statistical/payment-profit",
						name: "Lợi nhuận thanh toán",
					},
					{
						path: "/manager/statistical/recharge",
						name: "Nạp - rút tiền",
					},
					{
						path: "/manager/statistical/surplus",
						name: "Số dư",
					},
					{
						path: "/manager/statistical/transaction",
						name: "Giao dịch",
					},
					// {
					// 	path: "/statistical/order",
					// 	name: "Đơn hàng",
					// },
				],
			},
		],
	},
];
