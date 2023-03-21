import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { searchAPI, smallPackage } from '~/api'
import { FormInput, FormSelect } from '~/components'
import { dataSearchProduct } from '~/configs'
import styles from './index.module.css'
import { TrackingForm } from './TrackingForm'

type TSearch = {
	Id: number
	SearchItem: string
}

export const HomeBanner = ({ data }) => {
	// const [trackingData, setTrackingData] = useState(null);
	// const { control, handleSubmit, getValues, watch } = useForm<TWarehouseCN>({
	//   mode: "onBlur",
	// });

	// const { control: controlSearch, handleSubmit: handleSubmitSearch } =
	//   useForm<TSearch>({
	//     mode: "onBlur",
	//   });

	// const queryClient = useQueryClient();
	// const [modal, setModal] = useState(false);

	// const handleSearchProduct = async (newData: any) => {
	//   let search = newData?.SearchItem;
	//   let idItem = newData?.Id;

	//   if (!idItem) {
	//     toast.warning("Bạn chưa chọn shop!");
	//     return;
	//   }

	//   if (!search) {
	//     toast.warning("Bạn chưa nhập nội dung tìm kiếm!");
	//     return;
	//   }

	//   try {
	//     queryClient.fetchQuery([], () => {
	//       toast.info("Đang search ...");
	//       return searchAPI
	//         .getSearch({ site: idItem, content: search })
	//         .then((res) => {
	//           window.open(res?.Data);
	//         });
	//     });
	//   } catch (error) {
	//     toast.error;
	//   }
	// };

	// const handleGetCode = async (TransactionCode: string) => {
	//   const id = toast.loading("Đang xử lý ...");

	//   smallPackage
	//     .getByTransactionCode({ TransactionCode })
	//     .then((res) => {
	//       setTrackingData(res?.Data);
	//       toast.update(id, {
	//         render: "Tìm thấy đơn hàng",
	//         type: "success",
	//         isLoading: false,
	//         autoClose: 0,
	//       });
	//       setModal(true);
	//     })
	//     .catch((error) => {
	//       toast.update(id, {
	//         render: (error as any)?.response?.data?.ResultMessage,
	//         isLoading: false,
	//         type: "error",
	//         autoClose: 0,
	//       });
	//     });
	// };

	return (
		<div
			className={styles.banner}
			style={{
				backgroundImage: data?.BannerIMG ? `url("${data?.BannerIMG}")` : '/default_bg.png'
			}}
		>
			<div className={styles.bannerContainer}>
				<div className="container z-2 relative">
					<div className={styles.containerHome}>
						<div className={styles.content}>
							<h1 className="font-bold uppercase">
								<>
									DỊCH VỤ NHẬP HÀNG QUỐC TẾ <br /> CHUYÊN NGHIỆP - TẬN TÂM - UY TÍN
								</>
							</h1>
							<div className={styles.extension}>
								<p className=" text-[20px]">Cài đặt công cụ đặt hàng:</p>
								<div className="mt-3 flex">
									<Link href={data?.CocCocExtensionLink ?? '/'}>
										<a target="_blank" className={styles.btnExt}>
											<img src="/logo-coccoc.png" alt="" width={30} height={30} />
											<span>Cốc Cốc</span>
										</a>
									</Link>
									<Link href={data?.ChromeExtensionLink ?? '/'}>
										<a target="_blank" className={styles.btnExt}>
											<img src="/logo-chrome.png" alt="" width={30} height={30} />
											<span>Chrome</span>
										</a>
									</Link>
								</div>
							</div>
						</div>
					</div>
					{/* <div className={styles.containerBanner}>
          <div className={styles.tabSearch}>
            <div className={styles.tabSearchChild}>
              <div className={styles.tabSearchTitle}>TÌM KIẾM SẢN PHẨM</div>
              <div className="relative flex mt-3 justify-between bg-[#fff] p-1 shadow-lg">
                <div className="w-[30%]">
                  <FormSelect
                    control={controlSearch}
                    name="Id"
                    select={{ label: "name", value: "id" }}
                    defaultValue={{ id: "0", name: "Shop" }}
                    placeholder=""
                    label=""
                    data={dataSearchProduct}
                    required={false}
                    styles={{
                      control: (base) => ({
                        ...base,
                        // width: 135,
                        height: 40,
                        minHeight: 30,
                        // borderRight: 0,
                        // backgroundColor: "#f37021",
                        fontWeight: "bold",
                        textAlign: "center",
                        fontSize: 14,
                        borderRadius: "0",
                        zIndex: 50,
                        "& > div:first-of-type": {
                          padding: "0 8px",
                        },
                        "& > div:last-of-type > div": {
                          padding: "0",
                        },
                      }),
                    }}
                  />
                </div>
                <div className="w-[68%] relative ">
                  <FormInput
                    control={controlSearch}
                    name="SearchItem"
                    type="text"
                    placeholder="Nhập sản phẩm tìm kiếm (Nhấn enter)"
                    allowClear={false}
                    onEnter={handleSubmitSearch(handleSearchProduct)}
                    inputClassName="!border-none"
                  />
                  <button
                    onClick={handleSubmitSearch(handleSearchProduct)}
                    className={`${styles.btnSearch} !absolute top-[50%] right-[10px] translate-y-[-50%]`}
                  >
                    <span>
                      <i className="fas fa-search"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.tabSearchChild}>
              <div className={styles.tabSearchTitle}>TRA CỨU MÃ ĐƠN</div>
              <div className="relative flex mt-3 justify-between bg-[#fff] p-1 shadow-lg">
                <div className="w-[82%]">
                  <FormInput
                    control={control}
                    name="OrderTransactionCode"
                    type="text"
                    placeholder="Tra cứu mã vận đơn"
                    label=""
                    inputClassName="!border-none"
                  />
                </div>
                <div className="w-fit">
                  <button
                    onClick={() => {
                      const TransactionCode = getValues("OrderTransactionCode");
                      if (!TransactionCode) {
                        toast.warn("Vui lòng nhập mã vận đơn!");
                        return;
                      }

                      handleGetCode(TransactionCode.trim());
                    }}
                    className={styles.btnSearch}
                  >
                    <span
                      className={`!absolute top-[50%] right-[10px] translate-y-[-50%]`}
                    >
                      <i className="fas fa-file-search"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div> */}
				</div>
				<div
					style={{
						backgroundImage: 'url(/bg_footer.png)',
						position: 'absolute',
						left: 0,
						bottom: '-16%',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
						width: '100%',
						height: '50%',
						backgroundSize: 'cover',
						zIndex: 1
					}}
				></div>
			</div>
			{/* <TrackingForm
        visible={modal}
        onCancel={() => setModal(false)}
        data={trackingData}
      /> */}
		</div>
	)
}
