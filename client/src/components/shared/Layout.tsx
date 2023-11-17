import LeftBar from "@/components/shared/LeftBar";
import TopBar from "@/components/shared/TopBar";

function Layout() {
  return (
    <div className="w-full md:flex border h-screen">
      <TopBar />
      <LeftBar />
      {/* <section className="flex flex-1 h-full">
        <Outlet />
      </section>
      <BottomBar /> */}
    </div>
  );
}

export default Layout;
