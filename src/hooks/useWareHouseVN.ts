import { useQuery } from "react-query";
import { warehouseTo } from "~/api";

export const useWareHouseVN = () => {
  return useQuery(
    "useWareHouseVN",
    () => warehouseTo.getList().then((res) => res.Data.Items),
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
};
