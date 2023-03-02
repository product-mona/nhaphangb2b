import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, FormCard, FormUpload, Modal } from '~/components';

export const InfoUserUpdateAvatar: React.FC<any> = ({
	visible,
	onCancel,
	handleUpdateAvatar,
	isUpdateAva,
	data
}) => {
	const { control, handleSubmit, getValues, setValue, reset } = useForm<any>({
		mode: 'onBlur'
	});

	function _onPress() {
		handleUpdateAvatar({ AvatarIMG: getValues('OGFacebookIMG') });
		// setValue('OGFacebookIMG', "");
		// console.log("OGFacebookIMG: ", getValues('OGFacebookIMG'))
	}

	return (
		<Modal visible={visible} onCancel={onCancel} width={400}>
			<FormCard loading={isUpdateAva}>
				<FormCard.Header onCancel={onCancel}>
					<div className="w-full">
						<p>Cập nhật ảnh đại diện</p>
					</div>
				</FormCard.Header>
				<FormCard.Body>
					<div className="w-full">
						<div className="">
							<FormUpload
								control={control}
								name="OGFacebookIMG"
								label="Cập nhật ảnh đại diện"
								required={false}
							/>
						</div>
					</div>
				</FormCard.Body>
				<FormCard.Footer>
					<Button title="Cập nhật" btnClass="!bg-active" onClick={_onPress} />
					<Button
						title="Hủy"
						btnClass="!bg-pending"
						onClick={() => {
							// setValue('OGFacebookIMG', null);
							onCancel();
						}}
					/>
				</FormCard.Footer>
			</FormCard>
		</Modal>
	);
};
