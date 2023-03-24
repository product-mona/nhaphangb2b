import { Tabs } from 'antd'
import router, { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Control, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { pageType } from '~/api'
import { ArticleSEOForm, EditArticleCategoryForm, IconButton, Layout, toast } from '~/components'
import { breadcrumb } from '~/configs'
import { SEOConfigs } from '~/configs/SEOConfigs'
import { TNextPageWithLayout } from '~/types/layout'

type TForm = Partial<TArticleCategory & TArticleSEO>

const Index: TNextPageWithLayout = () => {
	const { query } = useRouter()
	const { control, handleSubmit, reset } = useForm<TForm>({
		mode: 'onBlur'
	})

	const { data, isFetching, isError, refetch } = useQuery(['articleCategoryData', +query?.id], () => pageType.getByID(+query?.id), {
		onSuccess: (data) => {},
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: false,
		enabled: !!query?.id
	})
	useEffect(() => {
		if (!!data.Data) {
			reset(data.Data)
		}
	}, [data])
	const mutationUpdate = useMutation((data: TForm) => pageType.update(data), {
		onSuccess: () => {
			toast.success('Cập nhật thành công')
			refetch()
		},
		onError: toast.error
	})

	const _onPress = async (data: TForm) => {
		try {
			await mutationUpdate.mutateAsync(data)
		} catch (error) {}
	}

	return (
		<div className="tableBox">
			<Tabs
				tabBarExtraContent={
					<div className="mb-4">
						<IconButton
							onClick={handleSubmit(_onPress)}
							title="Cập nhật"
							icon="fas fa-pencil"
							showLoading
							btnClass="!mr-4"
							toolip=""
						/>
						<IconButton title="Trở về" icon="fas fa-undo-alt" toolip="" onClick={() => router.back()} />
					</div>
				}
			>
				<Tabs.TabPane key={'1'} tab={'Nội dung chuyên mục'}>
					<EditArticleCategoryForm control={control as Control<TArticleCategory, object>} />
				</Tabs.TabPane>
				<Tabs.TabPane key={'2'} tab={'Cấu hình SEO'}>
					<ArticleSEOForm control={control as Control<TArticleSEO, object>} />
				</Tabs.TabPane>
			</Tabs>
		</div>
	)
}

Index.displayName = SEOConfigs.post.editCategories
Index.breadcrumb = breadcrumb.article.articleCategory.detail
Index.Layout = Layout

export default Index
