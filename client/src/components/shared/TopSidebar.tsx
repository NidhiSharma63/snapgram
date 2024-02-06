import TopSidebarNavlinks from "@/src/components/shared/links/TopSidebarNavlinks";
import { getActiveUserData } from "@/src/server/user";
import { User } from "@/src/types/user";

export default async function TopBar() {
  const { user } = await getActiveUserData();
  return (
    <section className="topbar">
      <TopSidebarNavlinks userDetails={user as User} />
    </section>
  );
}
