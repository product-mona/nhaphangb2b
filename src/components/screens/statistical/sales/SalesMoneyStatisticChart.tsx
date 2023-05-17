import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const labelsDetailChart = ['Từ đặt cọc đến khi hàng về VN', 'Từ đã thanh toán đến đã hoàn thành']

const labelsSumChart = ['Biểu đồ tổng tiền']

export const SalesMoneyStatisticChart = ({ type, dataChart }) => {
	const labels = type === 'sum' ? labelsSumChart : labelsDetailChart

	if (!dataChart) {
		return <></>
	}

	const datasets =
		type === 'sum'
			? [
					{
						label: 'Đã đặt cọc',
						data: [dataChart[9]?.Total],
						backgroundColor: '#CD6155'
					},
					{
						label: 'Đã mua hàng',
						data: [dataChart[10]?.Total],
						backgroundColor: '#AF7AC5'
					},
					{
						label: 'Đã về kho TQ',
						data: [dataChart[11]?.Total],
						backgroundColor: '#5499C7'
					},
					{
						label: 'Đã về kho VN',
						data: [dataChart[12]?.Total],
						backgroundColor: '#45B39D'
					},
					{
						label: 'Đã hoàn thành',
						data: [dataChart[13]?.Total],
						backgroundColor: '#616A6B'
					}
			  ]
			: [
					{
						label: 'Tiền ship Trung Quốc',
						data: [dataChart[1]?.NotPay, dataChart[1]?.Pay],
						backgroundColor: '#58D68D'
					},
					{
						label: 'Tiền phí mua hàng',
						data: [dataChart[2]?.NotPay, dataChart[2]?.Pay],
						backgroundColor: '#F5B041'
					},
					{
						label: 'Tiền phí cân nặng',
						data: [dataChart[3]?.NotPay, dataChart[3]?.Pay],
						backgroundColor: '#2980B9'
					},
					{
						label: 'Tiền phí kiểm đếm',
						data: [dataChart[4]?.NotPay, dataChart[4]?.Pay],
						backgroundColor: '#CB4335'
					},
					{
						label: 'Tiền phí đóng gói',
						data: [dataChart[5]?.NotPay, dataChart[5]?.Pay],
						backgroundColor: '#F4D03F'
					},
					{
						label: 'Tiền phí giao tận nhà',
						data: [dataChart[7]?.NotPay, dataChart[7]?.Pay],
						backgroundColor: '#333333'
					},
					{
						label: 'Tiền phí bảo hiểm',
						data: [dataChart[6]?.NotPay, dataChart[6]?.Pay],
						backgroundColor: 'blue'
					},
					{
						label: 'Phụ phí',
						data: [dataChart[8]?.NotPay, dataChart[8]?.Pay],
						backgroundColor: 'red'
					}
			  ]

	const data = {
		labels,
		datasets
	}

	return (
		<div className="my-4">
			{/* <div className="lg:flex items-center justify-between mb-8">
				<span className="text-xl mb-2 lg:mb-0">Tổng tiền</span>
				<div className="flex justify-between lg:w-[20%] text-[#fff] px-4 border-r-2 border-r-[#ed5b00]">
					<span className="text-base text-blue">{_format.getVND(974043)}</span>
					<br />
					<span className="text-base text-orange">
						{_format.getVND(974043)}
					</span>
				</div>
			</div> */}
			<Bar height={100} data={data} />
			{/* <Bar height={60} options={options} data={type === 'sum' ? dataSumChart : dataDetailChart} /> */}
		</div>
	)
}
