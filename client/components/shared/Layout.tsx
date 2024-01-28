import BottomBar from "@/components/shared/BottomBar";
import LeftBar from "@/components/shared/LeftBar";
import TopBar from "@/components/shared/TopBar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="w-full md:flex  h-screen md:overflow-hidden overflow-y-scroll overflow-x-hidden">
      <TopBar />
      <LeftBar />
      <section className="flex flex-1 h-full overflow-x-hidden">
        <Outlet />
      </section>
      <BottomBar />
    </div>
  );
}

export default Layout;
