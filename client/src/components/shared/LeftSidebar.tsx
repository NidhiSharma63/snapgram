import NavLinks from "@/src/components/shared/links/LeftSideBarNavLinks";
import getActiveUserData from "@/src/server/user/getActiveUserData";
import { User } from "@/src/types/user";

export default async function LeftBar() {
  const { user } = await getActiveUserData();

  return (
    <nav className="leftsidebar">
      <NavLinks userDetails={user as User} />
    </nav>
  );
}
