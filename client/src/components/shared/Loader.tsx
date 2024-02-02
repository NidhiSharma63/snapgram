// import { useTheme } from "@/context/themeProviders";
import { ColorRing } from "react-loader-spinner";

export default function Loader() {
  //   const { theme } = useTheme();
  return (
    <div className="flex-center w-full">
      <ColorRing
        width={24}
        height={24}
        // colors={
        //   theme === "dark"
        //     ? ["#fff", "#fff", "#fff", "#fff", "#fff"]
        //     : ["#020817", "#020817", "#020817", "#020817", "#020817"]
        // }
        colors={["#020817", "#020817", "#020817", "#020817", "#020817"]}
      />
      {/* <img alt="loadder" width={24} height={24} src="/assets/icons/dark-loader.svg" /> */}
    </div>
  );
}
