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
        <h1>Khách hàng nói về chúng tôi</h1>
        <p className={styles.mainDes}>
          Luôn là đơn vị nhập khẩu có uy tín hàng đầu, đem lại sự hài lòng về
          dịch vụ nhờ vào những giải pháp vận chuyển xuyên biên giới
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
