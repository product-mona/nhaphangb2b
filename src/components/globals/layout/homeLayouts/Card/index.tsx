import React, { useState } from 'react'
import { Grid, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import CartItem from './CartItem'

// Import Swiper styles
import router from 'next/router'
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/pagination'
import CardNavForNews from './CardNavForNews'

const count = `z-100 absolute text-[#333] bottom-[10px] right-[42px] text-[16px]`

type TProps = {
	data: _TPageType_Field_Page[]
	code: any
}

export const HomeCard: React.FC<TProps> = ({ data }) => {
	const [cur, setCur] = useState(1)

	return (
		<>
			<Swiper
				navigation={true}
				modules={[Grid, Navigation]}
				className={`mySwiper homeCard`}
				grid={{
					// rows: data?.length > 4 ? 2 : 1,
					rows: 1
				}}
				spaceBetween={30}
				slidesPerView={1}
				breakpoints={{
					520: {
						slidesPerView: 2
					},
					740: {
						slidesPerView: 3
					}
				}}
				onSlideChange={(val) => setCur(val.activeIndex + 1)}
			>
				{data
					?.filter((item) => item.Active === true)
					?.map(
						(item) =>
							item?.Active === true && (
								<SwiperSlide key={item?.Code}>
									<a
										onClick={() =>
											router.push({
												pathname: '/chuyen-muc/detail',
												query: { code: item?.Code }
											})
										}
									>
										<CartItem {...item} />
									</a>
								</SwiperSlide>
							)
					)}
				{data?.filter((item) => item.Active === true)?.length > 3 && <div className={count}>{cur}</div>}
			</Swiper>
			{/* <div className="">
				{data
					?.filter((item) => item.Active === true)
					?.map(
						(item) =>
							item?.Active === true && (
								<div
									key={item?.Code}
									onClick={() =>
										router.push({
											pathname: '/chuyen-muc/detail',
											query: { code: item?.Code }
										})
									}
								>
									
									<CardNavForNews {...item} />
								
								</div>
							)
					)}
			</div> */}
		</>
	)
}
