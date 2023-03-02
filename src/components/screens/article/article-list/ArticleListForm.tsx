import router from "next/router";
import {FormEditor, FormInput, FormSelect, FormSwitch, FormTextarea, FormUpload, IconButton} from "~/components";
import {useCatalogue} from "~/hooks/useCatalogue";
import {TControl} from "~/types/field";

type TProps = TControl<TArticleList> & {
	type: "add" | "edit";
	data?: any;
};

export const ArticleListForm: React.FC<TProps> = ({control, type, data}) => {
	const {pageType} = useCatalogue({pageTypeEnabled: !!data});

	return (
		<>
			<div className="md:grid md:grid-cols-4 md:gap-4 w-full p-4">
				<div className="col-span-2 md:mb-0 mb-4">
					<FormInput
						control={control}
						label="Tiêu đề"
						placeholder=""
						name="Title"
						rules={{
							required: "This field is required",
						}}
					/>
				</div>
				{/* {type === "edit" && (
					<div className="col-span-2 md:mb-0 mb-4">
						<FormInput control={control} label="Link" placeholder="" name="OGUrl" disabled />
					</div>
				)} */}
				<div className="col-span-2 md:mb-0 mb-4">
					<FormSelect
						control={control}
						label="Chuyên mục"
						placeholder="Chọn chuyên mục"
						name="PageTypeId"
						data={pageType}
						select={{label: "Name", value: "Id"}}
						rules={{
							required: "This field is required",
						}}
						defaultValue={
							type === "edit"
								? {
										Name: pageType?.find((item) => item?.Id === data?.PageTypeId)?.Name,
										Id: data?.PageTypeId,
								  }
								: null
						}
					/>
				</div>
				<div className="col-span-1 md:mb-0 mb-4">
					<FormUpload control={control} name="IMG" label="Ảnh đại diện" required={false} />
				</div>
				<div className="col-span-1 md:mb-0 mb-4">
					<FormSwitch control={control} name="Active" label="Trạng thái" required={false} />
				</div>
				{type === "edit" && (
					<div className="col-span-1">
						<FormSwitch control={control} name="sidebar" label="Sidebar" required={false} />
					</div>
				)}
				<div className="col-span-4 md:mb-0 mb-4">
					<FormTextarea
						control={control}
						name="Summary"
						label="Mô tả ngắn"
						required={false}
						placeholder="Mô tả ngắn cho bài viết"
					/>
				</div>
				<div className="col-span-4 md:mb-0 mb-4">
					<FormEditor control={control} label="" name="PageContent" required={false} />
				</div>
			</div>
		</>
	);
};
