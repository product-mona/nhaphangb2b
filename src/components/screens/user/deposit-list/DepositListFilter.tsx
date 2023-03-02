import { Collapse } from "antd";
import React, { useRef, useState } from "react";
import { FilterInput, FilterRangeDate, FilterSelect } from "~/components";
import { IconButton } from "~/components/globals/button/IconButton";
import {
  EOrderStatusData,
  ESearchData,
  orderStatusData,
  searchData,
} from "~/configs/appConfigs";

const inputProps = {
  id: "id",
  name: "id",
  placeholder: "Nhập nội dung tìm kiếm",
  label: "Nhập ID / mã vận đơn",
};

const filterBox =
  "py-2 font-bold uppercase text-[14px] flex items-center justify-center border shadow-lg cursor-pointer hover:shadow-sm transition-all duration-500 hover:bg-[#a8d7dd]";

type TProps = {
  handleFilter: (newFilter) => void;
  // handleModalRequestExportPackages: (type: 'all' | 'some') => void;
  isSelectSomeItems: boolean;
  numberOfOrder: any;
};

const CollapsePanelHeader = ({ setActiveKey, activeKey }) => {
  return (
    <div className="flex w-full justify-between">
      <IconButton
        onClick={() => setActiveKey(activeKey === 1 ? null : 1)}
        icon="fas fa-filter"
        title="Bộ lọc nâng cao"
        showLoading
        toolip="Bộ lọc nâng cao"
        btnClass="hover:!bg-[#168f9e]"
      />
    </div>
  );
};

export const UserDepositListFilter: React.FC<TProps> = ({
  handleFilter,
  numberOfOrder,
}) => {
  const TypeSearch = useRef<ESearchData>(ESearchData.All);
  const SearchContent = useRef<string>(null);
  const Status = useRef<EOrderStatusData>(EOrderStatusData.All);
  const FromDate = useRef<string>(null);
  const ToDate = useRef<string>(null);
  const [activeKey, setActiveKey] = useState("1");

  return (
    <Collapse
      className="collapse-order"
      accordion={true}
      expandIcon={() => (
        <CollapsePanelHeader
          setActiveKey={setActiveKey}
          activeKey={activeKey}
        />
      )}
      activeKey={activeKey}
    >
      <Collapse.Panel header={""} key="1">
        <div className="sm:grid sm:grid-cols-4 sm:gap-4 w-full p-4">
          <div className="col-span-1 sm:mb-0 mb-4">
            <FilterSelect
              data={searchData.slice(0, 3)}
              label="Tìm kiếm theo"
              placeholder="Nội dung tìm kiếm"
              handleSearch={(val: ESearchData) => {
                TypeSearch.current = val;
              }}
            />
          </div>
          <div className="col-span-1 sm:mb-0 mb-4">
            <FilterInput
              {...{
                ...inputProps,
                handleSearch: (val: string) =>
                  (SearchContent.current = val.trim()),
              }}
            />
          </div>
          <div className="col-span-1 sm:mb-0 mb-4">
            <FilterSelect
              data={orderStatusData}
              placeholder="Chọn trạng thái"
              label="Trạng thái"
              handleSearch={(val: EOrderStatusData) => {
                Status.current = val;
              }}
            />
          </div>
          <div className="col-span-1 sm:mb-0 mb-4">
            <FilterRangeDate
              placeholder="Từ ngày / đến ngày"
              format="DD/MM/YYYY"
              handleDate={(val: string[]) => {
                FromDate.current = val[0];
                ToDate.current = val[1];
              }}
            />
          </div>
          <div className="col-span-4">
            <div className="sm:flex sm:justify-end">
              <div className="sm:mb-0">
                <IconButton
                  onClick={() =>
                    handleFilter({
                      TypeSearch: TypeSearch.current,
                      SearchContent: SearchContent.current,
                      Status: Status.current,
                      FromDate: FromDate.current,
                      ToDate: ToDate.current,
                      PageIndex: 1,
                    })
                  }
                  icon="far fa-search"
                  title="Tìm kiếm"
                  showLoading
                  toolip=""
                />
              </div>
            </div>
          </div>
        </div>
        <div className="lg:grid lg:grid-cols-3 gap-4 mb-4] px-4 py-6">
          {numberOfOrder?.map((item) => (
            <div
              key={item?.name}
              className={`col-span-${item.col} ${filterBox}`}
              onClick={() => {
                Status.current = item.id;
                handleFilter({
                  TypeSearch: TypeSearch.current,
                  SearchContent: SearchContent.current,
                  Status: Status.current,
                  FromDate: FromDate.current,
                  ToDate: ToDate.current,
                  PageIndex: 1,
                });
              }}
            >
              <div className="mx-1">{item.name}</div>
              <div className="mx-1">({item.value})</div>
            </div>
          ))}
        </div>
      </Collapse.Panel>
    </Collapse>
  );
};
