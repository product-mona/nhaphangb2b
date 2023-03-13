import { Tooltip } from 'antd'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { ContactUs } from '~/api/contact-us'
import { FormInput, FormTextarea } from '~/components/globals/formBase'
import styles from './index.module.css'

export const HomeInfoContact = ({ data }) => {
	const [showForm, setShowForm] = useState(false)

	const {
		handleSubmit,
		control,
		reset,
		formState: { errors }
	} = useForm({
		mode: 'onBlur',
		defaultValues: {
			FullName: null,
			Phone: null,
			Email: null,
			Content: null
		}
	})

	const _onSubmit = (data) => {
		if (!data.fullName || !data.phone || !data.email || !data.content) {
			toast.error('Vui lòng điền đủ thông tin')
			return
		}
		const id = toast.loading('Đang gửi thông tin ...')
		ContactUs.create(data)
			.then(() => {
				toast.update(id, {
					render: 'Gửi thành công! Cảm ơn bạn đã quan tâm đến chúng tôi!',
					type: 'success',
					isLoading: false,
					autoClose: 1000
				})
				reset()
			})
			.catch(() => {
				toast.update(id, {
					render: 'Gửi thất bại!',
					type: 'error',
					isLoading: false,
					autoClose: 1000
				})
			})
	}

	return (
		<div className={styles.InfoContact}>
			<div className="relative">
				{/* <div className={styles.map}>
          <iframe
            src={data?.GoogleMapLink ?? ""}
            width="100%"
            height="550px"
            title="Order Trung Minh Quang"
            allowFullScreen={true}
            loading="lazy"
          ></iframe>
        </div> */}
				<Tooltip title="Liên hệ với chúng tôi!">
					<div className={styles.showForm} onClick={() => setShowForm(!showForm)}>
						<i className={`fas fa-paper-plane transition-all`}></i>
					</div>
				</Tooltip>
				<div className={`${styles.form} transition-all ${showForm ? '' : 'opacity-0 pointer-events-none'}`}>
					<form onSubmit={handleSubmit(_onSubmit)}>
						<h3 className={styles.h3}>Liên hệ với chúng tôi</h3>
						<div className={styles.innerForm}>
							<div className="col-span-1">
								<FormInput control={control} name="FullName" placeholder="Họ và tên" inputClassName={styles.formBox} />
							</div>
							<div className="col-span-1">
								<FormInput control={control} name="Phone" placeholder="Phone" inputClassName={styles.formBox} />
							</div>
							<div className="col-span-2">
								<FormInput control={control} name="Email" placeholder="Email" inputClassName={`${styles.formBox}`} />
							</div>
							<div className="col-span-2">
								<FormTextarea
									control={control}
									name="Content"
									placeholder="Nội dung"
									inputClassName={`${styles.formBox} !resize-none`}
								/>
							</div>
						</div>
						<div className={styles.boxAction}>
							<button className={styles.smBtn} type="submit">
								Gửi
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
