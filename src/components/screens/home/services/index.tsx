import clsx from "clsx";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Image } from "antd";
import Link from "next/link";

const InnerContent = ({ data }) => {
  const [itemActive, setItemActive] = useState<any>({});

  useEffect(() => {
    if (data) {
      setItemActive(data[0]);
    }
  }, [data]);

  return (
    <div className={styles.innerContent}>
      <div className={styles.boxLeft}>
        {data?.map((item) => (
          <div
            className={styles.boxLeftContent}
            key={item?.Id}
            onClick={() => setItemActive(item)}
          >
            <h3 key={item?.Id}>{item?.Name}</h3>
          </div>
        ))}
      </div>
      <div className={styles.boxRight}>
        <div className={styles.innerBoxRight}>
          <Link href="">
            <>
              <div className={styles.img}>
                <Image
                  src={itemActive?.IMG}
                  preview={false}
                  width="100%"
                  height="100%"
                />
              </div>
              <p>{itemActive?.Description}</p>
              <a target={"_blank"}>
                Xem chi tiết
                <i className="fal fa-arrow-right ml-4"></i>
              </a>
            </>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const HomeServices = ({ data }) => {
  return (
    <div className={clsx(styles.servicesWrap)}>
      <div className="container">
        <div className={clsx(styles.innerServicesWrap)}>
          <h1 className={styles.mainTitle}>dịch vụ của chúng tôi</h1>
          <InnerContent data={data} />
        </div>
      </div>
    </div>
  );
};
