import {Swiper, SwiperSlide} from "swiper/react";
import styles from "./index.module.css";

import {Navigation, Pagination} from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {useState} from "react";

export const Choosen = ({data}) => {
	const [cur, setCur] = useState(1);
	return (
		<div className={styles.ChoosenWrapper}>
			<div className="container">
				<div className={styles.ChoosenInner}>
					<div className={styles.left}>
						<h1 className="mainTitle sm:!text-[30px] lg:!text-[36px] xl:!text-[48px]">
							Tại sao bạn nên chọn chúng tôi
						</h1>
						<Swiper
							autoplay
							speed={500}
							slidesPerView={1}
							spaceBetween={30}
							navigation={true}
							modules={[Pagination, Navigation]}
							className={`mySwiper choosenSwiper ${styles.choosenSwiper}`}
							onSlideChange={(val) => setCur(val.activeIndex + 1)}
							breakpoints={{
								520: {
									slidesPerView: 2,
									spaceBetween: 20,
								},
								680: {
									slidesPerView: 2,
									spaceBetween: 60,
								},
								1280: {
									slidesPerView: 4,
									spaceBetween: 10,
								},
							}}
						>
							{data?.map((item, index) => (
								<SwiperSlide key={`${item?.Code}--${index}`}>
									<div className={styles.boxSlider}>
										<div className={styles.logo}>
											<img src={item?.IMG} alt="" />
										</div>
										<div className="flex-1">
											<h3 className="secondTitle my-3 text-center">{item?.Name}</h3>
											<p className="mainDes text-center !text-[14px]">{item?.Description}</p>
										</div>
									</div>
								</SwiperSlide>
							))}
							{data?.length > 4 && <div className={styles.count}>{cur}</div>}
						</Swiper>
					</div>
					{/* <div className={styles.right}>
						<img src="./choosen.png" alt="" />
					</div> */}
				</div>
			</div>
		</div>
	);
};
