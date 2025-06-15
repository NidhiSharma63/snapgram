import { useTheme } from "@/context/themeProviders";
import { ColorRing } from "react-loader-spinner";

export default function Loader() {
  const { theme } = useTheme();
  return (
    <div className="flex-center w-full">
      <ColorRing
        width={24}
        height={24}
        colors={
          theme === "light"
            ? ["#020817", "#020817", "#020817", "#020817", "#020817"]
            : ["#fff", "#fff", "#fff", "#fff", "#fff"]
        }
      />
      {/* <img alt="loadder" width={24} height={24} src="/assets/icons/dark-loader.svg" /> */}
    </div>
  );
}
