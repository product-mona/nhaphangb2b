import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Page } from "~/api";
import configHomeData from "~/api/config-home";
import {
  Empty,
  HomeBreadcrumb,
  HomeLayout,
  HomeSidebar,
  showToast,
} from "~/components";
import ContentItem from "~/components/globals/layout/homeLayouts/Card/ContentItem";
import MetaTags from "~/components/globals/metaTag";
import { SEOConfigs } from "~/configs/SEOConfigs";
import { TNextPageWithLayout } from "~/types/layout";

const Index: TNextPageWithLayout = () => {
  const router = useRouter();
  const [Data, setData] = useState({
    Title: "",
    SideBar: null,
  });

  useEffect(() => {
    const apiCall = async () => {
      return await Page.getByCode(`${router?.query?.code.toString().trim()}`);
    };

    if (router?.query?.code) {
      apiCall()
        .then((res) => setData(res?.Data))
        .catch((error) => {
          showToast({
            title: "Bài viết không tồn tại!",
            message: error?.response?.data?.message,
            type: "error",
          });
        });
    }
  }, [router]);

  const { data: dataConfig } = useQuery({
    queryKey: ["homeConfig"],
    queryFn: () => configHomeData.get().then((res) => res?.Data),
  });

  return (
    <>
      <MetaTags data={Data} dataConfig={dataConfig} />
      <div className="categoryhome">
        <div className="col-span-2">
          <HomeBreadcrumb currentRoute={Data} />
          <div className="container">
            <div className="grid grid-cols-12 gap-8 mb-8">
              {Data?.SideBar && (
                <div className="order-2 col-span-12 md:col-span-3 md:order-1">
                  <HomeSidebar />
                </div>
              )}
              <div
                className={
                  !Data?.SideBar
                    ? "col-span-12"
                    : `order-1 col-span-12 md:col-span-9`
                }
              >
                <ContentItem
                  data={Data}
                  code={`${router?.query?.code}`}
                  Title={""}
                  IMG={""}
                  Description={""}
                  Created={undefined}
                  PageContent={undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Index.displayName = SEOConfigs.homePage;
Index.Layout = HomeLayout;

export default Index;
