import styles from "./index.module.css";

const BoxExp = ({ data }) => {
  return (
    <div className={styles.boxExp}>
      <span className={styles.value}>{data?.value}</span>
      <span className="text-[#fff] text-center">{data?.title}</span>
    </div>
  );
};

export const Experience = () => {
  const fakeData = [
    {
      title: "Năm kinh nghiệm",
      value: 6,
    },
    {
      title: "Kho hàng Việt - Trung",
      value: 7,
    },
    {
      title: "Đơn hàng mỗi ngày",
      value: 800,
    },
    {
      title: "Khách hàng  sử dụng",
      value: 9101,
    },
  ];

  return (
    <div className={styles.experience}>
      <div className="container">
        <div className={styles.experienceInner}>
          <div className={styles.left}>
            <h1 className={styles.mainTitle}>Chúng tôi có</h1>
          </div>
          <div className={styles.right}>
            <div className={styles.innerRight}>
              {fakeData?.map((item) => (
                <BoxExp key={item.title} data={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
