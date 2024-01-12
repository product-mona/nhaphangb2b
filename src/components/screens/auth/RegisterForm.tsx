import { Modal } from 'antd'
// import {signIn} from "next-auth/react";
import Cookie from 'js-cookie'
import router from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { authenticate } from '~/api'
import { Button, FormCard, FormInput, FormSelect, showToast, TableSelectField, toast } from '~/components'
import { dataGender } from '~/configs'
import { _format } from '~/utils'
import { checkUnique, createComplain, EUnique } from './method'

export const RegisterForm = ({ visible, setOpenModal }) => {
	const { handleSubmit, control, watch, reset } = useForm<TUserRegister>({
		mode: 'onBlur',
		defaultValues: {
			UserName: '',
			Password: '',
			ConfirmPassword: '',
			Email: '',
			Phone: '',
			FullName: '',
			Gender: 0
		}
	})
	const password = watch('Password')
	const [psIcon, setPsIcon] = useState(false)
	const [cpsIcon, setCpsIcon] = useState(false)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		reset({
			UserName: '',
			Password: '',
			ConfirmPassword: '',
			Email: '',
			Phone: '',
			FullName: '',
			Gender: 0
		})
	}, [visible])

	const { mutate, isLoading } = useMutation((data: TUserRegister) => authenticate.register(data), {
		onSuccess: async (data) => {
			toast.success('Đăng ký tài khoản thành công')
			Cookie.set('tokenNHTQ-OTMQ', data?.Data?.token)
			setOpenModal('')
			router.push('/')
		},
		onError: (error) => {
			setLoading(false)
			showToast({
				title: (error as any)?.response?.data?.ResultCode === 401 && 'Lỗi server!',
				message: (error as any)?.response?.data?.ResultMessage,
				type: 'error'
			})
		}
	})

	const _onPress = (data: TUserRegister) => {
		const { FullName, Phone } = data
		const newData = {
			...data,
			FullName: FullName.trim(),
			Phone: Phone.trim()
		}
		mutate(newData)
	}

	return (
		<Modal visible={visible} footer={false} closeIcon={true}>
			<div className="authContainer">
				<FormCard>
					<FormCard.Header onCancel={() => setOpenModal('')}>
						<p className="heading !pb-0">Đăng ký</p>
					</FormCard.Header>
					<FormCard.Body>
						<form onSubmit={handleSubmit(_onPress)}>
							<div className="gridContainer">
								<div className="col-span-2 group">
									<FormInput
										homeType="register"
										label="Tên đăng nhập"
										control={control}
										placeholder="Nhập UserName"
										name="UserName"
										rules={{
											required: 'Vui lòng điền thông tin đăng nhập',
											validate: {
												check: (value) => {
													const specialChar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
													if (value.match(specialChar)) {
														return 'Tên đăng nhập không chưa ký tự đặt biệt!'
													}

													if (value.length !== 8) {
														return 'Tên đăng nhập phải bằng 8 ký tự và có ít nhất 2 chữ số'
													}

													if (value.trim().includes(' ')) {
														return 'Tên đăng nhập chứa khoảng trắng giữa 2 chữ!'
													}

													const userNameSplit = value.split('')
													const numbers = []
													const strings = []

													userNameSplit.forEach((x) => {
														if (isNaN(x)) {
															strings.push(x)
														} else {
															numbers.push(x)
														}
													})
													if (numbers.length < 2) {
														return 'Tên đăng nhập phải có ít nhất 2 chữ số!'
													}

													const check = _format.checkUserNameVNese(value.trim())
													if (check) {
														return 'Tên đăng nhập không được chứa Tiếng Việt'
													}
													return checkUnique(value.trim(), EUnique.username)
												}
											}
										}}
										type={'text'}
										disabled={isLoading}
									/>
								</div>
								<div className="col-span-2 group">
									<FormInput
										control={control}
										homeType="register"
										label="Họ & tên"
										placeholder="Nhập họ & tên"
										name="FullName"
										type={'text'}
										rules={{
											required: 'Vui lòng điền thông tin'
										}}
										disabled={isLoading}
									/>
								</div>
								<div className="col-span-2 group">
									<FormInput
										control={control}
										homeType="register"
										label="Email"
										placeholder="Nhập địa chỉ email"
										name="Email"
										disabled={isLoading}
										type={'email'}
										rules={{
											required: 'Vui lòng điền email..',
											pattern: {
												value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
												message: 'email không đúng định dạng'
											},
											validate: {
												check: (value) => {
													return checkUnique(value.trim(), EUnique.email)
												}
											}
										}}
									/>
								</div>
								<div className="col-span-2 group">
									<FormInput
										control={control}
										homeType="register"
										label="Địa chỉ"
										placeholder="Nhập địa chỉ"
										name="Address"
										type={'text'}
										rules={{}}
										required={false}
										disabled={isLoading}
									/>
								</div>
								<div className="col-span-2 group">
									<FormSelect
										control={control}
										label="Giới Tính"
										placeholder=""
										name="Gender"
										data={dataGender}
										select={{ label: 'Name', value: 'Id' }}
										defaultValue={dataGender?.[0]}
										required={false}
									/>
								</div>
								<div className="col-span-2 group">
									<FormInput
										homeType="register"
										label="Số điện thoại"
										control={control}
										placeholder="Nhập số điện thoại"
										name="Phone"
										disabled={isLoading}
										rules={{
											required: 'Vui lòng điền số điện thoại..',
											minLength: {
												value: 10,
												message: 'Số điện thoại tối thiểu 10 số!'
											},
											pattern: {
												value: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
												message: 'Sđt không đúng định dạng'
											},
											validate: {
												check: (value) => {
													return checkUnique(value.trim(), EUnique.phone)
												}
											}
										}}
									/>
								</div>
								<div className="col-span-2 group">
									<div className="relative">
										<FormInput
											homeType="register"
											label="Mật khẩu"
											control={control}
											placeholder="Nhập mật khẩu"
											name="Password"
											disabled={isLoading}
											type={!psIcon ? 'password' : 'text'}
											rules={{
												minLength: {
													value: 8,
													message: 'Mật khẩu ít nhất 8 kí tự'
												},
												validate: {
													check: (value) => {
														const check = _format.checkUserNameVNese(value.trim())

														if (value.trim() === '') {
															return 'Vui lòng điền mật khẩu'
														}

														if (value.trim().includes(' ')) {
															return 'Mật khẩu không chứa khoảng trắng giữa 2 chữ!'
														}
														if (check) {
															return 'Mật khẩu không được chứa Tiếng Việt'
														}
													}
												}
											}}
										/>
										<div className="show-pass" onClick={() => setPsIcon(!psIcon)}>
											<i className={!psIcon ? 'fas fa-eye' : 'fas fa-eye-slash'}></i>
										</div>
									</div>
								</div>
								<div className="group col-span-2">
									<div className="relative">
										<FormInput
											control={control}
											homeType="register"
											label="Nhập lại mật khẩu"
											placeholder="Nhập lại mật khẩu"
											name="ConfirmPassword"
											disabled={isLoading}
											type={!cpsIcon ? 'password' : 'text'}
											rules={{
												required: 'Vui lòng xác nhận mật khẩu..',
												validate: {
													checkEqualPassword: (value) => {
														const check = _format.checkUserNameVNese(value.trim())

														if (value.trim() === '') {
															return 'Vui lòng điền mật khẩu'
														}

														if (value.trim().includes(' ')) {
															return 'Mật khẩu không chứa khoảng trắng giữa 2 chữ!'
														}
														if (check) {
															return 'Mật khẩu không được chứa Tiếng Việt'
														}
														return password === value.trim() || createComplain()
													}
												}
											}}
										/>
										<div className="show-pass" onClick={() => setCpsIcon(!cpsIcon)}>
											<i className={!cpsIcon ? 'fas fa-eye' : 'fas fa-eye-slash'}></i>
										</div>
									</div>
								</div>
								<div
									className="group col-span-2 !mt-4 uppercase font-bold !mt-8"
									style={{ pointerEvents: loading ? 'none' : 'all' }}
								>
									<button type="submit" className="w-full">
										<Button
											showLoading
											title="Đăng ký"
											btnClass="!bg-[#4A8916] !m-0 !rounded-none shadow-xl hover:shadow-none transition-all duration-300 w-full"
											disabled={isLoading}
										/>
									</button>
								</div>

								<div
									className="link group col-span-2 !pt-4 border-t border-[#c4c4c4]"
									onClick={() => setOpenModal('signIn')}
									style={{ pointerEvents: loading ? 'none' : 'all' }}
								>
									<a className="!mt-0 transition-all ">Đăng nhập</a>
								</div>
							</div>
						</form>
					</FormCard.Body>
				</FormCard>
			</div>
		</Modal>
	)
}
