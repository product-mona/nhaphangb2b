export const userRouter = [
	{
		group: 'TỔNG QUAN',
		controllers: [
			{
				path: '/user',
				name: 'TỔNG QUAN ĐƠN HÀNG',
				icon: 'fal fa-home-alt'
			}
		]
	},
	{
		group: 'TỔNG QUAN',
		controllers: [
			{
				path: '/user/cart',
				name: 'Giỏ hàng',
				icon: 'fal fa-shopping-bag'
			}
		]
	},
	{
		group: 'MUA HÀNG',
		controllers: [
			{
				path: 'javascript:;',
				icon: 'fal fa-shopping-basket',
				name: 'DANH SÁCH ĐƠN HÀNG',
				childrens: [
					{
						path: '/user/order-list',
						name: 'Đơn hàng trọn gói'
					},
					{
						path: '/user/order-list?q=3',
						name: 'Đơn hàng dịch vụ'
					},
					{
						path: '/user/create-order',
						name: 'Tạo đơn hàng dịch vụ mới'
					}
				]
			}
		]
	},

	{
		group: 'QUẢN LÝ TÀI CHÍNH',
		controllers: [
			{
				path: 'javascript:;',
				icon: 'far fa-sack-dollar',
				name: 'Quản lý tài chính',
				childrens: [
					{
						path: '/user/history-transaction-vnd',
						name: 'Lịch sử giao dịch'
					},
					{
						path: '/user/recharge-vnd',
						name: 'Tạo yêu cầu nạp tiền'
					},
					{
						path: '/user/withdrawal-vnd',
						name: 'Tạo yêu cầu rút tiền'
					}
				]
			}
		]
	},
	{
		group: 'KIỂM TRA',
		controllers: [
			{
				path: 'javascript:;',
				icon: 'fas fa-edit',
				name: 'TRA CỨU',
				childrens: [
					{
						path: '/user/tracking',
						name: 'Tracking'
					},
					{
						path: '/user/report',
						name: 'Khiếu nại'
					},
					{
						path: '/user/transaction-code-management',
						name: 'Quản lý mã vận đơn'
					}
				]
			}
		]
	}
]
