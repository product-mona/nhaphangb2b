import Link from 'next/link'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Page } from '~/api'
import { socialList } from '~/configs'
import styles from './index.module.css'
import { Image } from 'antd'

const blogList = [
	{
		id: 1,
		title: 'Nhập hàng Trung Quốc',
		code: ''
	},
	{
		id: 2,
		title: 'Đặt hàng 1688',
		code: ''
	},
	{
		id: 3,
		title: 'Đặt hàng Tmall',
		code: ''
	},
	{
		id: 4,
		title: 'Đặt hàng Taobao',
		code: ''
	}
]

const handleSetMenu = (dataConfig) => {
	const socialListRender = socialList?.map((social) => {
		return {
			...social,
			link: dataConfig[social.title]
		}
	})
	return socialListRender
}

const Footer = ({ dataConfig, dataMenu }) => {
	if (!dataConfig || !dataMenu) return null
	const [socialListRender, setSocialListRender] = useState(handleSetMenu(dataConfig))
	useEffect(() => setSocialListRender(handleSetMenu(dataConfig)), [dataConfig, dataMenu])

	// const { data: articalList } = useQuery(["articalList"], () =>
	//   Page.getList({
	//     Active: true,
	//     PageIndex: 1,
	//     PageSize: 6,
	//     OrderBy: "Id desc",
	//   }).then((res) => res?.Data?.Items)
	// );

	return (
		<footer className="border border-t border-[#46464652] fontFamilyRoboto">
			<div className={styles.footerTop}>
				<div className="container">
					<div className={styles.inner}>
						<div className="col-span-4">
							<Link href="/">
								<div className={styles.logo}>
									<a className="flex items-center w-fit">
										<Image
											src={`${dataConfig?.LogoIMG}` ?? '/main-logo.png'}
											// src="/main-logo.png"
											alt=""
											width={'100%'}
											height={'auto'}
											preview={false}
										/>
										<h1 className={styles.branchName}>NHAPHANGB2B</h1>
									</a>
								</div>
							</Link>
						</div>
						<div className="col-span-4 md:col-span-4 lg:col-span-2 xl:col-span-1">
							<div className={styles.socialFoot}>
								{socialListRender.map((item, index) => {
									return (
										<React.Fragment key={index}>
											<Link href={item?.link ?? '/'}>
												<a style={{ display: !item?.link && 'none' }}>
													{item.icon ? (
														<i className={item.icon}></i>
													) : (
														<div
															style={{
																backgroundImage: `url(${item.imgSrc})`,
																width: '100%',
																height: '100%',
																backgroundSize: 'cover',
																backgroundPosition: 'center'
															}}
														></div>
													)}
												</a>
											</Link>
										</React.Fragment>
									)
								})}
							</div>
							<p className="mt-3">
								Chúng tôi chuyên nhận order và vận chuyển hộ hàng hóa từ Trung Quốc về Việt Nam, với chi phí ưu đãi thấp
								nhất có thể. Hàng về nhanh chóng đúng thời gian cam kết.
							</p>
						</div>
						<div className="col-span-4 md:col-span-4 lg:col-span-2 xl:col-span-1 pl-0 xl:pl-6">
							<div className={styles.title}>
								<p className="uppercase font-bold text-lg !mb-4"> Liên hệ </p>
							</div>
							<div className={styles.contentFoot}>
								<div className={styles.contactBox}>
									<img src="./location.png" alt="" />
									<span className={styles.colorD} dangerouslySetInnerHTML={{ __html: dataConfig?.Address }}></span>
								</div>
								<div className={styles.contactBox}>
									<a href={`mailto:${dataConfig?.EmailContact}`} className={`${styles.contactLink}`}>
										<img src="./envelope.png" alt="" />
										<span className={styles.colorD}>{dataConfig?.EmailContact}</span>
									</a>
								</div>
								<div className={styles.contactBox}>
									<a href={`tel:${dataConfig?.Hotline}`} className={`${styles.contactLink}`}>
										<img src="./phone.png" alt="" />
										<span className="flex flex-col">
											<span>
												Hotline: <span className={`${styles.colorD} ml-2`}>{dataConfig?.Hotline}</span>
											</span>
											<span>
												Tư vấn: <span className={`${styles.colorD} ml-2`}>{dataConfig?.HotlineSupport}</span>
											</span>
										</span>
									</a>
								</div>
							</div>
						</div>
						<div className="col-span-4 md:col-span-4 lg:col-span-2 xl:col-span-1">
							<div className={styles.title}>
								<p className="uppercase font-bold text-lg !mb-4"> Menu </p>
							</div>
							<div className={styles.contentFoot}>
								{dataMenu?.map((item) => (
									<div key={item.Name} className={styles.menuItem}>
										<a
											className={styles.colorD}
											onClick={() =>
												router.push({
													pathname: '/chuyen-muc',
													query: { code: item?.Code }
												})
											}
										>
											{item?.Name}
										</a>
									</div>
								))}
							</div>
						</div>
						<div className="col-span-4 md:col-span-4 lg:col-span-2 xl:col-span-1">
							<div className={styles.title}>
								<p className="uppercase font-bold text-lg !mb-4 mb-5">Blog</p>
							</div>
							{blogList.map((blog) => (
								<div className={`${styles.menuItem} !w-fit`} key={blog?.id}>
									<Link href={`/chuyen-muc/detail/?code=${blog.code}`}>
										<a target={'_blank'} className={styles.colorD}>
											{blog?.title}
										</a>
									</Link>
								</div>
							))}
							{/* {dataConfig?.FacebookFanpage && (
								<div className="mt-4">
									<iframe
										src={dataConfig?.FacebookFanpage}
										width="100%"
										height="300"
										allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
									/>
								</div>
							)} */}
						</div>
					</div>
				</div>
			</div>
			<p className={styles.cRight}>Website thuộc quyền sở hữu NHAPHANGB2B</p>
		</footer>
	)
}

export default Footer
