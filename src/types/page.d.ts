type TPage = Omit<TBaseReponseParams, 'Name' | 'Description'> & {
	PageTypeId: number
	Title: string
	Summary: string
	PageContent: string
	IsHidden: boolean
	SideBar: boolean
	IMG: string
	OGUrl: string
	OGTitle: string
	OGDescription: string
	OGImage: string
	MetaTitle: string
	MetaDescription: string
	MetaKeyword: string
	OGFacebookTitle: string
	OGFacebookDescription: string
	OGFacebookIMG: string
	OGTwitterTitle: string
	OGTwitterDescription: string
	OGTwitterIMG: string
	OrderNumber: number // vij tri
}
