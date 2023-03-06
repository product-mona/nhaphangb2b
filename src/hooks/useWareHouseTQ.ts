import { useQuery } from "react-query";
import { warehouseFrom } from "~/api";

export const useWareHouseTQ = () => {
  return useQuery(
    "useWareHouseTQ",
    () => warehouseFrom.getList().then((res) => res.Data.Items),
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
};
