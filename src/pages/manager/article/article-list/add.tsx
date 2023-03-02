import {Tabs} from "antd";
import Link from "next/link";
import router from "next/router";
import React from "react";
import {Control, useForm} from "react-hook-form";
import {useMutation} from "react-query";
import {Page} from "~/api";
import {ArticleListForm, ArticleSEOForm, IconButton, Layout, toast} from "~/components";
import {breadcrumb} from "~/configs";
import {TNextPageWithLayout} from "~/types/layout";

type TForm = Partial<TArticleList & TArticleSEO>;

const Index: TNextPageWithLayout = () => {
	const {control, handleSubmit} = useForm<TForm>({
		mode: "onBlur",
	});

	const mutationAdd = useMutation((data: any) => Page.create(data), {
		onSuccess: () => toast.success("Tạo bài viết thành công"),
		onError: toast.error,
	});

	const _onPress = async (data: any) => {
		try {
			await mutationAdd.mutateAsync(data);
		} catch (error) {}
	};

	return (
		<div className="tableBox">
			<Tabs
				tabBarExtraContent={
					<div className="mb-4">
						<IconButton
							onClick={handleSubmit(_onPress)}
							icon="far fa-plus"
							title="Tạo mới"
							showLoading
							btnClass="!mr-4"
							toolip=""
						/>
						<IconButton icon="fas fa-undo-alt" title="Trở về" toolip="" onClick={() => router.back()} />
					</div>
				}
			>
				<Tabs.TabPane key={"1"} tab="Nội dung bài viết">
					<ArticleListForm control={control as Control<TArticleList, object>} type="add" />
				</Tabs.TabPane>
				<Tabs.TabPane key={"2"} tab="Cấu hình SEO">
					<ArticleSEOForm control={control as Control<TArticleSEO, object>} />
				</Tabs.TabPane>
			</Tabs>
		</div>
	);
};

Index.breadcrumb = breadcrumb.article.articleList.add;
Index.Layout = Layout;

export default Index;
