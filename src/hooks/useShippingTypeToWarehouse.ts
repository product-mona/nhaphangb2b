import { useQuery } from 'react-query'
import { shipping, warehouseFrom } from '~/api'

export const useShippingTypeToWarehouse = () => {
	return useQuery(
		'useShippingTypeToWarehouse',
		() =>
			shipping
				.getList({
					PageSize: 9999,
					PageIndex: 1
				})
				.then((res) => res.Data.Items),
		{
			staleTime: Infinity,
			refetchOnWindowFocus: false,
			keepPreviousData: true
		}
	)
}

// const { data: shippingTypeToWarehouse } = useQuery(
//     ["shippingType"],
//     () =>
//       shipping
//         .getList({
//           PageSize: 9999,
//           PageIndex: 1,
//         })
//         .then((res) => res.Data.Items),
//     {
//       enabled: !!ids,
//       refetchOnWindowFocus: false,
//     }
//   );
