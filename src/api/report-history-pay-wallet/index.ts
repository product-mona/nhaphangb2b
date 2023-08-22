import BaseAPI from '../methods';

type TFilterParams = {
	FromDate: string;
	ToDate: string;
};

const { globalReport, post } = new BaseAPI<TReportHistoryPayWallet, TFilterParams>(
	'report-history-pay-wallet'
);

export const reportHistoryPayWallet = {
	...globalReport,

	exportExcel: (params: Partial<TPaginationParams & TFilterParams>) =>
		post('/export', undefined, { params })
};
