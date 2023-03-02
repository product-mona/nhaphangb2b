import React from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import configHomeData from "~/api/config-home";

export const RechargeContent = ({ newUser }) => {
  const { data } = useQuery(["homeConfig"], () => configHomeData.get(), {
    onSuccess: (res) => {
      return res?.Data;
    },
    onError: toast.error,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <React.Fragment>
      <div>
        <h2 className="text-xl font-bold uppercase text-[#595857]">
          QUY ĐỊNH HÌNH THỨC THANH TOÁN
        </h2>
        <p>
          Để kết thúc quá trình đặt hàng, quý khách thanh toán một khoản tiền
          đặt cọc trước cho{" "}
          <span className="font-bold uppercase">
            {data?.Data?.CompanyLongName}{" "}
          </span>{" "}
          để chúng tôi thực hiện giao dịch mua hàng theo yêu cầu trên đơn hàng.
        </p>
        <p>- Số tiền đặt cọc trước bao gồm:</p>
        <ul className="list-disc ml-4">
          <li>
            Tiền hàng: giá sản phẩm trên website đặt hàng Trung Quốc, số tiền
            này thu hộ cho nhà cung cấp.
          </li>
          <li>
            Phí dịch vụ: là phí khách hàng trả cho{" "}
            <span className="font-bold uppercase">
              {data?.Data?.CompanyLongName}{" "}
            </span>{" "}
            để tiến hành thu mua theo đơn hàng đã đặt.
          </li>
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-bold uppercase text-[#595857]">
          CÓ 2 HÌNH THỨC THANH TOÁN:
        </h2>
        <ul className="list-decimal ml-4">
          <li>
            Thanh toán trực tiếp.
            <ul>
              <p>- Khách hàng có thể đặt cọc trực tiếp tại địa chỉ:</p>
              {[
                data?.Data.Address,
                data?.Data.Address2,
                data?.Data.Address3,
              ].map((address, index) => {
                return address ? (
                  <li
                    key={`${index}-${address}`}
                    className="border inline-block p-2 border-dotted mr-4 my-4"
                  >
                    <p dangerouslySetInnerHTML={{ __html: address }}></p>
                  </li>
                ) : (
                  <span key={`${index}-${address}`}></span>
                );
              })}
            </ul>
          </li>
          <li>
            Chuyển khoản trực tiếp
            <p>- Nội dung chuyển khoản theo cú pháp:</p>
            <p className="border inline-block p-2 border-dotted my-4">
              NAP {newUser?.UserName} sodienthoai
            </p>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
};
