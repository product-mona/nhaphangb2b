export const ordererRouter = [
  {
    group: "Danh sách đơn hàng",
    icon: "far fa-file-invoice-dollar",
    controllers: [
      {
        path: "javascript:;",
        name: "Đơn hàng",
        icon: "fas fa-cubes",
        childrens: [
          {
            key: "MainOrder",
            path: "/manager/order/order-list",
            name: "Đơn mua hộ",
          },
          {
            key: "MainOrderAnother",
            path: "/manager/order/order-list?q=3",
            name: "Đơn mua hộ khác",
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
        path: "/manager/statistical/sales",
        name: "Doanh thu",
        icon: "fas fa-sack-dollar",
      },
    ],
  },
  {
    group: "Hoa hồng cá nhân",
    icon: "far fa-computer-classic",
    controllers: [
      {
        path: "/manager/employee/bonus-management",
        name: "Quản lý hoa hồng",
        icon: "fas fa-envelope-open-dollar",
      },
    ],
  },
];
