import React from 'react'
import { useQuery } from 'react-query'
import { menu } from '~/api'
import configHomeData from '~/api/config-home'
import { ButtonBackTop } from '../../button/ButtonBackTop'
import Footer from './Footer'
import Header from './Header'
import { HomeLayoutProtector } from './HomeLayoutProtector'

export const HomeLayout: React.FC<{}> = ({ children }) => {
	const { data: dataConfig } = useQuery({
		queryKey: ['homeConfig'],
		queryFn: () => configHomeData.get().then((res) => res?.Data)
	})

	const { data: dataMenu } = useQuery({
		queryKey: ['menuData'],
		queryFn: () =>
			menu
				.getList({
					PageIndex: 1,
					PageSize: 99999,
					OrderBy: 'position'
				})
				.then((res) => res?.Data?.Items)
	})

	return (
		<HomeLayoutProtector>
			<Header dataConfig={dataConfig} dataMenu={dataMenu} />
			<main>{children}</main>
			<Footer dataConfig={dataConfig} dataMenu={dataMenu} />
			<ButtonBackTop />
		</HomeLayoutProtector>
	)
}
