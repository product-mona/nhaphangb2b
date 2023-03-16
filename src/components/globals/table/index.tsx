import { Pagination, Table, TablePaginationConfig, TableProps } from 'antd'
import { SorterResult, TableRowSelection } from 'antd/lib/table/interface'
import clsx from 'clsx'
import React from 'react'
import { useMediaQuery } from 'react-responsive'
import { TColumnsType } from '~/types/table'
import styles from './index.module.css'

type TProps<T extends object> = {
	rowKey?: keyof T
	style?: 'main' | 'secondary'
	title?: string
	columns: TColumnsType<T> | any
	data: T[]
	bordered?: boolean
	pagination?: TablePaginationConfig | false
	onChange?: (pagination?: TablePaginationConfig, filter?: any, sorter?: SorterResult<T>) => void
	summary?: (data: readonly T[]) => React.ReactNode | null
	rowSelection?: TableRowSelection<T>
	scroll?: TableProps<T>['scroll']
	loading?: boolean
	expandable?: any
	className?: string
	href?: string
	isExpand?: boolean
	tableId?: string
	expandOnlyOne?: boolean
}

export const DataTable = <T extends object = object>({
	style = 'main',
	title = '',
	columns,
	data,
	bordered = undefined,
	pagination = false,
	onChange,
	rowSelection,
	summary = null,
	scroll = { x: true },
	rowKey = 'Id' as keyof T,
	loading = false,
	expandable,
	className,
	href = '',
	isExpand = false,
	tableId = 'myTable',
	expandOnlyOne = false
}: TProps<T>) => {
	const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1280px)' })
	const [expandedRowKeys, setExpandedRowKeys] = React.useState([])
	return (
		<React.Fragment>
			{!!title.length && (
				<div
					className={clsx('titleTable', style === 'secondary' && '')}
					style={
						href !== ''
							? {
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between'
							  }
							: {}
					}
				>
					{title}
				</div>
			)}
			<Table
				loading={loading}
				rowKey={rowKey as string}
				bordered={bordered}
				columns={columns}
				dataSource={data ?? []}
				className={clsx(style !== 'main' ? styles.table : styles.maintable, className)}
				pagination={false}
				summary={summary}
				id={tableId}
				// onChange={onChange}
				onExpand={(expanded, record) => {
					if (expandOnlyOne) {
						const keys = []
						if (expanded) {
							keys.push(record[rowKey])
						}
						setExpandedRowKeys(keys)
					}
				}}
				expandedRowKeys={expandOnlyOne ? expandedRowKeys : undefined}
				rowSelection={rowSelection}
				scroll={scroll}
				expandable={isExpand ? expandable : isTabletOrMobile && expandable}
			/>
		</React.Fragment>
	)
}
