import {Steps} from "antd";

const {Step} = Steps;

const progessDot = (icon: string) => {
	return <i className={icon}></i>;
};

export const CartSteps = ({current = 1}: {current?: number}) => {
	return (
		<div className="cartStepsContainer">
			<Steps current={current} labelPlacement="vertical" status="wait" responsive={false}>
				<Step title="Giỏ hàng" progressDot={() => progessDot("fas fa-shopping-cart")} />
				<Step title="Chọn địa chỉ nhận hàng" progressDot={() => progessDot("fas fa-map-marked-alt")} />
				<Step title="Đặt cọc và kết đơn" progressDot={() => progessDot("fas fa-box-check")} />
			</Steps>
		</div>
	);
};
