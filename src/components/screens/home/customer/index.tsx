import styles from "./index.module.css";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import { useQuery } from "react-query";
import { customerTalk } from "~/api";

const SwiperCus = () => {
  const [newData, setNewData] = useState([]);

  useQuery(["customer-talk"], () => customerTalk.getList(), {
    onSuccess: (res) => {
      setNewData(res?.Data?.Items);
    },
    refetchOnWindowFocus: false,
  });
  return (
    <Swiper
      autoplay
      speed={500}
      slidesPerView={1}
      spaceBetween={10}
      navigation={true}
      pagination={{
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
      }}
      modules={[Pagination, Navigation]}
      className="mySwiper"
      breakpoints={{
        680: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        860: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        1200: {
          slidesPerView: 5,
          spaceBetween: 30,
        },
      }}
    >
      {newData?.map((item, index) => (
        <SwiperSlide key={`${index}`}>
          <div className={styles.boxSlider}>
            <div className={styles.innerBoxSlider}>
              <div>
                <div className={styles.boxSliderImg}>
                  <img src={item?.IMG} alt="" />
                </div>
                <h3 className="secondTitle mt-4 !text-[18px]">{item?.Name}</h3>
              </div>
              <div className={styles.boxSliderContent}>
                <p className="mainDes text-center !text-sm">
                  {item?.Description}
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export const Customer = () => {
  return (
    <div className={styles.customerWrapper}>
      <div className="container">
        <h1>Kh??ch h??ng n??i v??? ch??ng t??i</h1>
        <p className={styles.mainDes}>
          Lu??n l?? ????n v??? nh???p kh???u c?? uy t??n h??ng ?????u, ??em l???i s??? h??i l??ng v???
          d???ch v??? nh??? v??o nh???ng gi???i ph??p v???n chuy???n xuy??n bi??n gi???i
        </p>
      </div>
      <div className="">
        <div className="customerSwiper">
          <SwiperCus />
        </div>
      </div>
    </div>
  );
};
