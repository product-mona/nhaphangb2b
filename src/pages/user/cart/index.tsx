import { LoadingOutlined } from '@ant-design/icons'
import { Empty, Spin } from 'antd'
import React, { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { orderShopTemp, searchAPI } from '~/api'
import { CardAmount, CartOrder, CartSteps, FormInput, FormSelect, showToast, toast, UserLayout } from '~/components'
import { SEOHomeConfigs } from '~/configs/SEOConfigs'
import { TNextPageWithLayout } from '~/types/layout'
import router from 'next/router'
import { useForm } from 'react-hook-form'
import { dataSearchProduct } from '~/configs'
import { selectUser, setSelectedShopIds, useAppDispatch, useAppSelector } from '~/store'
type TSearch = {
	Id: number
	SearchItem: string
}

const Index: TNextPageWithLayout = () => {
	const { user } = useAppSelector(selectUser)
	const [currentCart, setCurrentCart] = useState([])
	const queryClient = useQueryClient()
	const {
		control: controlSearch,
		handleSubmit: handleSubmitSearch,
		watch
	} = useForm<TSearch>({
		mode: 'onBlur',
		defaultValues: {
			Id: 1
		}
	})
	const [note, setNote] = useState<{ [key: number]: string }>()
	const [totalSelectPrice, setTotalSelectPrice] = useState(0)
	const [chosenShopIds, setChosenShopIds] = useState<number[]>([])

	const UserId = user?.UserId
	const dispatch = useAppDispatch()

	const handleSearchProduct = async (newData: any) => {
		let search = newData?.SearchItem
		let idItem = newData?.Id

		if (!idItem) {
			toast.warning('Bạn chưa chọn shop!')
			return
		}

		if (!search) {
			toast.warning('Bạn chưa nhập nội dung tìm kiếm!')
			return
		}

		try {
			queryClient.fetchQuery([], () => {
				toast.info('Đang search ...')
				return searchAPI.getSearch({ site: idItem, content: search }).then((res) => {
					window.open(res?.Data)
				})
			})
		} catch (error) {
			toast.error
		}
	}

	const {
		refetch: refetchCart,
		isLoading,
		isFetching
	} = useQuery(['user-cart', UserId], () => orderShopTemp.getList({ UID: UserId }), {
		onSuccess: (data) => {
			const newCart = data?.Data?.Items.map((item) => {
				const parseOrderTemps = JSON.parse(item?.OrderTempsJson)
				return {
					...item,
					OrderTemps: parseOrderTemps
				}
			})
			setCurrentCart(newCart)
		},
		onError: (error) => {
			showToast({
				title: (error as any)?.response?.data?.ResultCode,
				message: (error as any)?.response?.data?.ResultMessage,
				type: 'error'
			})
		},
		enabled: !!UserId,
		retry: false
		// refetchOnWindowFocus: false
	})

	const toggleAllShopId = () => {
		setChosenShopIds(chosenShopIds.length <= 0 ? currentCart?.map((item) => item?.Id) : [])
		setTotalSelectPrice(
			chosenShopIds.length <= 0
				? () =>
						currentCart.reduce((acc, cur) => {
							return (acc = acc + cur?.PriceVND)
						}, 0)
				: 0
		)
	}

	const toggleShopId = (shopId: number) => {
		setChosenShopIds((oldState) => {
			const shopIdIndex = oldState.indexOf(shopId)
			let newState = []
			if (shopIdIndex === -1) {
				newState = [...oldState, shopId]
			} else {
				newState = oldState.filter((id) => id !== shopId)
			}
			// const totalPrice = handleCalTotalPriceSelect(newState);
			// setTotalSelectPrice(totalPrice.reduce((a, b) => a + b, 0));
			return newState
		})
	}

	const onPress = async () => {
		dispatch(setSelectedShopIds(chosenShopIds))
		router.push('/user/cart/payment')
	}

	return (
		<React.Fragment>
			<div className="titlePageUser px-4">Giỏ hàng</div>
			<div className="tableBox !w-full xl:!w-[70%] bg-[#fff] !mb-[20px] !h-fit m-auto">
				<span className="titlePageUser text-[18px]">Tìm kiếm sản phẩm</span>
				<div className="flex justify-between mt-4">
					<div className="w-[30%] flex items-center">
						<div className="mr-4">
							<img src={dataSearchProduct.find((x) => x.id === String(watch().Id))?.image} className="w-[100px]" alt="" />
						</div>
						<FormSelect
							control={controlSearch}
							name="Id"
							select={{ label: 'name', value: 'id' }}
							defaultValue={dataSearchProduct[0]}
							placeholder=""
							label=""
							data={dataSearchProduct}
							required={false}
							styles={{
								control: (base) => ({
									...base,
									// width: 135,
									width: '100%',
									height: 40,
									minHeight: 30,
									// borderRight: 0,
									// backgroundColor: "#f37021",
									fontWeight: 'bold',
									textAlign: 'center',
									fontSize: 14,
									borderRadius: '0',
									zIndex: 50,
									'& > div:first-of-type': {
										padding: '0 8px'
									},
									'& > div:last-of-type > div': {
										padding: '0'
									}
								})
							}}
						/>
					</div>

					<div className="w-[68%] relative">
						<FormInput
							control={controlSearch}
							name="SearchItem"
							type="text"
							placeholder="Nhập sản phẩm tìm kiếm (Nhấn enter)"
							allowClear={false}
							onEnter={handleSubmitSearch(handleSearchProduct)}
							inputClassName=""
						/>
						<span
							className="absolute top-[50%] right-[10px] translate-y-[-50%] cursor-pointer hover:scale-[1.1]"
							onClick={handleSubmitSearch(handleSearchProduct)}
						>
							<i className="far fa-search"></i>
						</span>
					</div>
				</div>
			</div>
			<div className="px-4">
				<CartSteps current={1} />
				{isFetching && isLoading ? (
					<span className="bg-[#fff] flex w-full h-[300px] items-center justify-center">
						<Spin indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />} />
					</span>
				) : (
					<>
						{currentCart.length <= 0 && (
							<Empty
								description="Không tìm thấy sản phẩm nào trong giỏ hàng"
								className="bg-[#fff] h-[300px] flex flex-col items-center justify-center"
							/>
						)}
						{currentCart?.length > 0 && (
							<div className="grid grid-cols-12 gap-4">
								<div className="xs:order-2 xl:order-1 xs:col-span-12 xl:col-span-9">
									<CartOrder
										currentCart={currentCart}
										note={note}
										setNote={setNote}
										toggleShopId={toggleShopId}
										chosenShopIds={chosenShopIds}
										refetchCart={refetchCart}
									/>
								</div>
								<div className="xs:order-1 xl:order-2 xs:col-span-12 xl:col-span-3">
									<CardAmount
										currentCart={currentCart}
										allShopIds={chosenShopIds}
										chosenShopIds={chosenShopIds}
										toggleAllShopId={toggleAllShopId}
										// totalSelectPrice={totalSelectPrice}
										onPress={onPress}
										refetchCart={refetchCart}
									/>
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</React.Fragment>
	)
}

Index.displayName = SEOHomeConfigs.shopping.shopingBag
Index.Layout = UserLayout

export default Index
