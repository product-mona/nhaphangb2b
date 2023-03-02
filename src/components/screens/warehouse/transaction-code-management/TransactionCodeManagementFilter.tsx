import { useRouter } from "next/router";
import React, { useRef } from "react";
import { FilterInput, FilterRangeDate, FilterSelect } from "~/components";
import { IconButton } from "~/components/globals/button/IconButton";
import {
  ESearchSmallPackageStatusData,
  ESmallPackageStatusData,
  searchSmallPackageStatusData,
  smallPackageStatusData,
} from "~/configs/appConfigs";

const inputProps = {
  id: "code",
  name: "code",
  placeholder: "Nhập nội dung ...",
  label: "Nhập mã vận đơn / đơn hàng / ID / Username",
};

type TProps = {
  handleFilter: (newFilter) => void;
  handleExporTExcel: () => void;
};

export const TransactionCodeManagementFilter: React.FC<TProps> = ({
  handleFilter,
  handleExporTExcel,
}) => {
  const router = useRouter();
  const SearchType = useRef<ESearchSmallPackageStatusData>(null);
  const SearchContent = useRef<string>(null);
  const Status = useRef<ESmallPackageStatusData>(null);
  const FromDate = useRef<string>(null);
  const ToDate = useRef<string>(null);

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4 w-full pb-4">
      <div className="col-span-1 xl:mb-0">
        <FilterSelect
          data={
            router.asPath.includes("user")
              ? searchSmallPackageStatusData.slice(0, 3)
              : searchSmallPackageStatusData
          }
          placeholder="Chọn tìm kiếm theo"
          label="Tìm kiếm theo"
          isClearable
          handleSearch={(val: ESearchSmallPackageStatusData) =>
            (SearchType.current = val)
          }
        />
      </div>
      <div className="col-span-1 xl:mb-0">
        <FilterInput
          {...inputProps}
          handleSearch={(val: string) => (SearchContent.current = val.trim())}
        />
      </div>
      <div className="col-span-1 xl:mb-0">
        <FilterSelect
          data={smallPackageStatusData}
          placeholder="Chọn trạng thái"
          label="Trạng thái"
          isClearable
          handleSearch={(val: ESmallPackageStatusData) =>
            (Status.current = val)
          }
          closeMenuOnSelect={false}
        />
      </div>
      <div className="col-span-1 xl:mb-0">
        <FilterRangeDate
          handleDate={(val: string[]) => {
            FromDate.current = val[0];
            ToDate.current = val[1];
          }}
          placeholder="Chọn từ ngày / đến ngày"
          format="DD/MM/YYYY"
        />
      </div>
      <div className="col-span-1 flex xl:justify-end justify-start items-end ">
        <IconButton
          onClick={() =>
            handleFilter({
              SearchType: SearchType.current,
              SearchContent: SearchContent.current,
              Status: Status.current,
              FromDate: FromDate.current,
              ToDate: ToDate.current,
              PageIndex: 1,
            })
          }
          icon="fas fa-filter"
          title="Lọc"
          btnIconClass=""
          btnClass="!mr-2"
          toolip="Lọc"
        />

        <IconButton
          onClick={() => handleExporTExcel()}
          btnClass={""}
          icon="fas fa-file-export"
          btnIconClass=""
          title="Xuất"
          showLoading
          toolip="Xuất Thống Kê"
          green
        />
      </div>
    </div>
  );
};
