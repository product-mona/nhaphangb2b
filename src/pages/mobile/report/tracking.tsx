import { MobileLayout } from "~/components/globals/layout/mobileLayout";

export default function Tracking() {
  return (
    <iframe
      src="https://m.1688.com/?src=desktop"
      style={{
        width: "100%",
        height: "100vh",
      }}
    ></iframe>
  );
}

Tracking.displayName = "Tracking";
Tracking.Layout = MobileLayout;
