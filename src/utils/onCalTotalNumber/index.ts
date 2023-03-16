import { checkIsArray } from '../CheckIsArray'

export const onCalTotalNumber = <T extends number | { [key in string]: any }>(arr: T[], key?: keyof T): number => {
	if (!checkIsArray(arr)) return 0
	const rs = key ? (arr.map((p) => (typeof p === 'object' ? p[key] : p)) as number[]) : (arr as number[])
	return rs.reduce((tt: number, n: number) => {
		if (!n) return tt
		return tt + n
	}, 0)
}
