import { Avatar, Tooltip } from "antd";
import React from "react";
import { _format } from "~/utils";

export const InfoUserContact: React.FC<any> = ({ onOpenModal, data }) => {
  return (
    <div className="w-full">
      <div className="w-full ">
        <img
          className="rounded-3xl w-full h-72"
          src="https://ui8-fleet-html.herokuapp.com/img/content/bg-profile.jpg"
        />
      </div>
      <div className="w-full items-center text-center xl:p-8 p-4 rounded-3xl mt-[-106px] z-50 relative">
        <div className="bg-white rounded-3xl p-6 grid grid-cols-2 boxShadow">
          <div className="md:col-span-1 xl:col-span-1 flex">
            <div className="border-2 border-[#0c5963] rounded-full p-2 mr-4 border-unactive h-fit overflow-hidden relative">
              <Avatar
                size={{ xxl: 100 }}
                src={data?.AvatarIMG ? data.AvatarIMG : "/empty_avatar.jpg"}
              />
            </div>
            <div className="text-left">
              <p className="font-medium xl:text-2xl text-xl xl:mt-4">
                {data?.UserName}
              </p>
              <button
                onClick={onOpenModal}
                className="text-blue flex lg:text-sm text-xs xl:mt-2"
              >
                <i className="fas fa-edit mr-2 pt-1"></i>
                <span className="mt-[2px]">Cập nhật ảnh đại diện</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            <ul className="w-[100%] flex">
              <li className="flex text-base py-2">
                <i className="far fa-user mr-3 pt-[2px] text-[#f14f04]"></i>
                <span>{data?.Gender == 0 ? "Nam" : "Nữ"}</span>
              </li>
              <li className="flex text-base py-2 ml-4">
                <i className="far fa-phone-alt mr-3 pt-[2px] text-[#f14f04]"></i>
                <span>{data?.Phone}</span>
              </li>
            </ul>
            <ul className=" ">
              <li className="flex text-base py-2">
                <Tooltip title="Điểm tích luỹ">
                  <i className="fas fa-star-half-alt mr-3 pt-[2px] text-[#f14f04]"></i>
                </Tooltip>
                <Tooltip title="Tổng tiền đã thanh toán">
                  <span>{_format.getVND(data?.TransactionMoney)}</span>
                </Tooltip>
              </li>
            </ul>
            <ul className=" ">
              <li className="flex text-base py-2">
                <i className="far fa-envelope mr-3 pt-[2px] text-[#f14f04]"></i>
                <span>{data?.Email}</span>
              </li>
              <li className="flex text-base py-2">
                <i className="far fa-map-marker-alt mr-3 pt-[2px] text-[#f14f04]"></i>
                <span>{data?.Address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
