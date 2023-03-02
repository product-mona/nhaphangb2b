import { Pagination, Table, TablePaginationConfig, TableProps } from "antd";
import { SorterResult, TableRowSelection } from "antd/lib/table/interface";
import clsx from "clsx";
import React from "react";
import { useMediaQuery } from "react-responsive";
import { TColumnsType } from "~/types/table";
import styles from "./index.module.css";

type TProps<T extends object> = {
  rowKey?: keyof T | "Id";
  style?: "main" | "secondary";
  title?: string;
  columns: TColumnsType<T> | any;
  data: T[];
  bordered?: boolean;
  pagination?: TablePaginationConfig | false;
  onChange?: (
    pagination?: TablePaginationConfig,
    filter?: any,
    sorter?: SorterResult<T>
  ) => void;
  summary?: (data: readonly T[]) => React.ReactNode | null;
  rowSelection?: TableRowSelection<T>;
  scroll?: TableProps<T>["scroll"];
  loading?: boolean;
  expandable?: any;
  className?: string;
  href?: string;
  isExpand?: boolean;
};

export const DataTable = <T extends object = object>({
  style = "main",
  title = "",
  columns,
  data,
  bordered = undefined,
  pagination = false,
  onChange,
  rowSelection,
  summary = null,
  scroll = { x: true },
  rowKey = "Id",
  loading = false,
  expandable,
  className,
  href = "",
  isExpand = false,
}: TProps<T>) => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1280px)" });

  return (
    <React.Fragment>
      {!!title.length && (
        <div
          className={clsx("titleTable", style === "secondary" && "")}
          style={
            href !== ""
              ? {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
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
        className={clsx(
          style !== "main" ? styles.table : styles.maintable,
          className
        )}
        pagination={false}
        summary={summary}
        // onChange={onChange}
        rowSelection={rowSelection}
        scroll={scroll}
        expandable={isExpand ? expandable : isTabletOrMobile && expandable}
      />
    </React.Fragment>
  );
};
