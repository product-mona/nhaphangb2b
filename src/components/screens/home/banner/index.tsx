import { Input } from 'antd'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { searchAPI, smallPackage } from '~/api'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FormInput, FormSelect } from '~/components'
import { dataSearchProduct } from '~/configs'
import styles from './index.module.css'
import { TrackingForm } from './TrackingForm'
import { Navigation, Autoplay } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import clsx from 'clsx'
type TSearch = {
	Id: number
	SearchItem: string
}

export const HomeBanner = ({ data }) => {
	return (
		<>
			<div className={styles.banner}>
				<Swiper
					// navigation={true}
					autoplay={{
						delay: 2500,
						disableOnInteraction: false
					}}
					loop={true}
					modules={[Autoplay, Navigation]}
					className={clsx(styles.bannerSwipper, 'swiperBanner')}
				>
					<SwiperSlide>
						<div
							className={clsx(styles.bannerSliderSwipper, 'w-full h-full')}
							style={{
								backgroundImage: data?.ImageBanner1 ? `url("${data?.ImageBanner1}")` : '/default_bg.png'
							}}
						>
							<div
								style={{
									backgroundColor: '#FFFFFF2a',
									width: '100%',
									height: '100%'
								}}
							></div>
						</div>
					</SwiperSlide>
					{data?.ImageBanner2 ? (
						<SwiperSlide>
							<div
								className={clsx(styles.bannerSliderSwipper, 'w-full h-full')}
								style={{
									backgroundImage: data?.ImageBanner2 ? `url("${data?.ImageBanner2}")` : '/default_bg.png'
								}}
							>
								<div
									style={{
										backgroundColor: '#FFFFFF2a',
										width: '100%',
										height: '100%'
									}}
								></div>
							</div>
						</SwiperSlide>
					) : null}
					{data?.ImageBanner3 ? (
						<SwiperSlide>
							<div
								className={clsx(styles.bannerSliderSwipper, 'w-full h-full')}
								style={{
									backgroundImage: data?.ImageBanner3 ? `url("${data?.ImageBanner3}")` : '/default_bg.png'
								}}
							>
								<div
									style={{
										backgroundColor: '#FFFFFF2a',
										width: '100%',
										height: '100%'
									}}
								></div>
							</div>
						</SwiperSlide>
					) : null}
				</Swiper>
				<div
					className={styles.bannerLayout}
					style={
						{
							// position: 'absolute',
							// width: 'calc(100vw - 100px)',
							// maxWidth: '1200px',
							// height: '100%',
							// top: 0,
							// left: '50%',
							// transform: 'translateX(-50%)',
							// zIndex: 2
						}
					}
				>
					<div className={styles.bannerContainer}>
						<div className="w-full mx-auto z-2 relative px-0">
							<div>
								{data?.BannerText ? (
									<div className={clsx(styles.slogan, 'font-bold uppercase')}>
										<Input.TextArea
											style={{
												font: 'inherit',
												padding: 0,
												background: 'transparent',
												border: 'none',
												boxShadow: 'none',
												overflow: 'hidden'
											}}
											defaultValue={data?.BannerText}
											placeholder=""
											autoSize
											readOnly
										/>
									</div>
								) : (
									<h1 className="font-bold uppercase">
										DỊCH VỤ NHẬP HÀNG QUỐC TẾ <br /> CHUYÊN NGHIỆP -TẬN TÂM - UY TÍN
									</h1>
								)}

								<div className={styles.extension}>
									<p className=" text-[20px]">Cài đặt công cụ đặt hàng:</p>
									<div className="mt-3 flex">
										<Link href={data?.CocCocExtensionLink ?? '/'}>
											<a target="_blank" className={styles.btnExt}>
												<img src="/logo-coccoc.png" alt="" width={30} height={30} />
												<span>Cốc Cốc</span>
											</a>
										</Link>
										<Link href={data?.ChromeExtensionLink ?? '/'}>
											<a target="_blank" className={styles.btnExt}>
												<img src="/logo-chrome.png" alt="" width={30} height={30} />
												<span>Chrome</span>
											</a>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
		// 	<div
		// 		className={styles.banner}
		// 		style={{
		// 			backgroundImage: data?.BannerIMG ? `url("${data?.BannerIMG}")` : '/default_bg.png'
		// 		}}
		// 	>
		// 		<div className={styles.bannerContainer}>
		// 			<div className="container z-2 relative">
		// 				<div className={styles.containerHome}>
		// 					<div className={styles.content}>
		// 						{data?.BannerText ? (
		// 							<Input.TextArea
		// 								className="font-bold uppercase"
		// 								style={{
		// 									fontSize: '26px',
		// 									padding: 0,
		// 									background: 'transparent',

		// 									border: 'none',
		// 									boxShadow: 'none'
		// 								}}
		// 								defaultValue={data?.BannerText}
		// 								placeholder=""
		// 								autoSize
		// 							/>
		// 						) : (
		// 							<h1 className="font-bold uppercase">
		// 								DỊCH VỤ NHẬP HÀNG QUỐC TẾ <br /> CHUYÊN NGHIỆP -TẬN TÂM - UY TÍN
		// 							</h1>
		// 						)}

		// 						<div className={styles.extension}>
		// 							<p className=" text-[20px]">Cài đặt công cụ đặt hàng:</p>
		// 							<div className="mt-3 flex">
		// 								<Link href={data?.CocCocExtensionLink ?? '/'}>
		// 									<a target="_blank" className={styles.btnExt}>
		// 										<img src="/logo-coccoc.png" alt="" width={30} height={30} />
		// 										<span>Cốc Cốc</span>
		// 									</a>
		// 								</Link>
		// 								<Link href={data?.ChromeExtensionLink ?? '/'}>
		// 									<a target="_blank" className={styles.btnExt}>
		// 										<img src="/logo-chrome.png" alt="" width={30} height={30} />
		// 										<span>Chrome</span>
		// 									</a>
		// 								</Link>
		// 							</div>
		// 						</div>
		// 					</div>
		// 				</div>
		// 				{/* <div className={styles.containerBanner}>
		// 	  <div className={styles.tabSearch}>
		// 		<div className={styles.tabSearchChild}>
		// 		  <div className={styles.tabSearchTitle}>TÌM KIẾM SẢN PHẨM</div>
		// 		  <div className="relative flex mt-3 justify-between bg-[#fff] p-1 shadow-lg">
		// 			<div className="w-[30%]">
		// 			  <FormSelect
		// 				control={controlSearch}
		// 				name="Id"
		// 				select={{ label: "name", value: "id" }}
		// 				defaultValue={{ id: "0", name: "Shop" }}
		// 				placeholder=""
		// 				label=""
		// 				data={dataSearchProduct}
		// 				required={false}
		// 				styles={{
		// 				  control: (base) => ({
		// 					...base,
		// 					// width: 135,
		// 					height: 40,
		// 					minHeight: 30,
		// 					// borderRight: 0,
		// 					// backgroundColor: "#f37021",
		// 					fontWeight: "bold",
		// 					textAlign: "center",
		// 					fontSize: 14,
		// 					borderRadius: "0",
		// 					zIndex: 50,
		// 					"& > div:first-of-type": {
		// 					  padding: "0 8px",
		// 					},
		// 					"& > div:last-of-type > div": {
		// 					  padding: "0",
		// 					},
		// 				  }),
		// 				}}
		// 			  />
		// 			</div>
		// 			<div className="w-[68%] relative ">
		// 			  <FormInput
		// 				control={controlSearch}
		// 				name="SearchItem"
		// 				type="text"
		// 				placeholder="Nhập sản phẩm tìm kiếm (Nhấn enter)"
		// 				allowClear={false}
		// 				onEnter={handleSubmitSearch(handleSearchProduct)}
		// 				inputClassName="!border-none"
		// 			  />
		// 			  <button
		// 				onClick={handleSubmitSearch(handleSearchProduct)}
		// 				className={`${styles.btnSearch} !absolute top-[50%] right-[10px] translate-y-[-50%]`}
		// 			  >
		// 				<span>
		// 				  <i className="fas fa-search"></i>
		// 				</span>
		// 			  </button>
		// 			</div>
		// 		  </div>
		// 		</div>
		// 		<div className={styles.tabSearchChild}>
		// 		  <div className={styles.tabSearchTitle}>TRA CỨU MÃ ĐƠN</div>
		// 		  <div className="relative flex mt-3 justify-between bg-[#fff] p-1 shadow-lg">
		// 			<div className="w-[82%]">
		// 			  <FormInput
		// 				control={control}
		// 				name="OrderTransactionCode"
		// 				type="text"
		// 				placeholder="Tra cứu mã vận đơn"
		// 				label=""
		// 				inputClassName="!border-none"
		// 			  />
		// 			</div>
		// 			<div className="w-fit">
		// 			  <button
		// 				onClick={() => {
		// 				  const TransactionCode = getValues("OrderTransactionCode");
		// 				  if (!TransactionCode) {
		// 					toast.warn("Vui lòng nhập mã vận đơn!");
		// 					return;
		// 				  }

		// 				  handleGetCode(TransactionCode.trim());
		// 				}}
		// 				className={styles.btnSearch}
		// 			  >
		// 				<span
		// 				  className={`!absolute top-[50%] right-[10px] translate-y-[-50%]`}
		// 				>
		// 				  <i className="fas fa-file-search"></i>
		// 				</span>
		// 			  </button>
		// 			</div>
		// 		  </div>
		// 		</div>
		// 	  </div>
		// 	</div> */}
		// 			</div>
		// 			<div
		// 				style={{
		// 					backgroundImage: 'url(/bg_footer.png)',
		// 					position: 'absolute',
		// 					left: 0,
		// 					bottom: '-16%',
		// 					backgroundPosition: 'center',
		// 					backgroundRepeat: 'no-repeat',
		// 					width: '100%',
		// 					height: '50%',
		// 					backgroundSize: 'cover',
		// 					zIndex: 1
		// 				}}
		// 			></div>
		// 		</div>
		// 		{/* <TrackingForm
		// 	visible={modal}
		// 	onCancel={() => setModal(false)}
		// 	data={trackingData}
		//   /> */}
		// 	</div>
	)
}
