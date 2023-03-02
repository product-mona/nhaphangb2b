import { Card, Modal, Tooltip } from "antd";
import React from "react";

export const BankCard = ({ item, setSelectedBank, selectedBank }) => {
  return (
    <React.Fragment key={item?.Id}>
      <Card
        className={`md:col-span-2 xl:col-span-1 cursor-pointer transition-all ${
          item?.Id === selectedBank?.Id && "shadow-xl"
        }`}
        title=""
        onClick={() => {
          setSelectedBank(item);
        }}
        style={{
          border:
            item?.Id === selectedBank?.Id
              ? "3px solid #52c41a"
              : "3px solid #ececec",
          transform: item?.Id === selectedBank?.Id && "scale(1.02)",
        }}
        extra={
          <div className="flex justify-between items-center w-full">
            <span className="flex items-center relative">
              <Tooltip title="Click để quét mã QR">
                <i
                  className="fas fa-qrcode mr-4 text-[16px] text-red cursor-pointer"
                  onClick={() => {
                    Modal.info({
                      title: "Vui lòng kiểm tra kỹ thông tin!",
                      content: <img src={item?.IMGQR} />,
                    });
                  }}
                ></i>
              </Tooltip>
              <p className="font-semibold text-[#595857]">{item?.BankName}</p>
            </span>
            <a href="#">
              <img src={item?.IMG} alt="" className="h-[30px]" />
            </a>
          </div>
        }
      >
        <div className="flex justify-between">
          <p className="font-semibold text-[#595857] tracking-wider">
            Chủ tài khoản
          </p>
          <p>{item?.Branch}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold text-[#595857] tracking-wider">
            Số tài khoản
          </p>
          <p>{item?.BankNumber}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold text-[#595857] tracking-wider">
            Chi nhánh
          </p>
          <p>{item?.Name}</p>
        </div>
      </Card>
    </React.Fragment>
  );
};
