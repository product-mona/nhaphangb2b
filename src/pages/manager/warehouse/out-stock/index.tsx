import React from 'react';
import { Layout, OutStockForm } from '~/components';
import { breadcrumb } from '~/configs';
import { SEOConfigs } from '~/configs/SEOConfigs';
import { TNextPageWithLayout } from '~/types/layout';

const Index: TNextPageWithLayout = () => {
	return (
		<div className="tableBox p-4">
			<OutStockForm />
		</div>
	);
};

Index.displayName = SEOConfigs.export;
Index.breadcrumb = breadcrumb.warehouse.outstock.main;
Index.Layout = Layout;
export default Index;
