import BottomBar from "@/components/shared/BottomBar";
import LeftBar from "@/components/shared/LeftBar";
import TopBar from "@/components/shared/TopBar";
import { Outlet, useLocation, useParams } from "react-router-dom";

function Layout() {
  // get url
		const location = useLocation();
		const { userId } = useParams();

		return (
			<div className="flex w-full md:flex-row flex-col h-screen md:overflow-hidden overflow-y-scroll overflow-x-hidden">
				{!location.pathname.includes(`/inbox/${userId}`) && <TopBar />}
				<LeftBar />
				<section className="flex flex-1 h-[calc(100% - 90px)] overflow-x-hidden">
					<Outlet />
				</section>
				<BottomBar />
			</div>
		);
}

export default Layout;
