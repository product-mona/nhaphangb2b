import {Breadcrumb} from "antd";
import Link from "next/link";
import React from "react";

export const HomeBreadcrumb: React.FC<{currentRoute: any}> = React.memo(({currentRoute}) => {
	return (
		<div className="py-4 bg-[#464646] mb-10">
			<div className="container">
				<Breadcrumb className="breadcrumb uppercase">
					<Breadcrumb.Item className="text-white">
						<Link href="/">
							<a className="!text-white">Trang chủ</a>
						</Link>
					</Breadcrumb.Item>
					<Breadcrumb.Item className="text-white">
						<Link href="#">
							<a className="!text-white uppercase">{currentRoute?.Title ?? currentRoute?.Name}</a>
						</Link>
					</Breadcrumb.Item>
				</Breadcrumb>
			</div>
		</div>
	);
});
