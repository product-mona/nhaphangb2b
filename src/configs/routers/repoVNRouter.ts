export const repoVNRouter = [
	{
		group: "Kiểm kho Việt Nam",
		controllers: [
			{
				path: "/manager/warehouse/check-warehouse-vietnam",
				name: "Kiểm kho Việt Nam",
				icon: "fas fa-warehouse-alt",
			},
		],
	},
	{
		group: "Xuất kho",
		controllers: [
			{
				path: "/manager/warehouse/out-stock",
				name: "Xuất kho",
				icon: "fas fa-file-export",
			},
		],
	},
	{
		group: "Quản lý bao hàng",
		controllers: [
			{
				path: "/manager/warehouse/package-management",
				name: "Quản lý bao hàng",
				icon: "far fa-box-full",
			},
		],
	},
	{
		group: "Quản lý mã vận đơn",
		controllers: [
			{
				path: "/manager/warehouse/transaction-code-management",
				name: "Quản lý mã vận đơn",
				icon: "fas fa-barcode-scan",
			},
		],
	},
	{
		group: "Quản lý kiện trôi nổi",
		controllers: [
			{
				path: "/manager/warehouse/floating-package",
				name: "Quản lý kiện trôi nổi",
				icon: "fas fa-truck-loading",
			},
		],
	},
];
