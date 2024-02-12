import NavLinks from "@/src/components/shared/links/LeftSideBarNavLinks";
import { getActiveUserData } from "@/src/server/user";
import { User } from "@/src/types/user";

export default async function LeftBar() {
  const { user, error: getActiveUserError } = await getActiveUserData();

  if (getActiveUserError) {
    return <div className="text-center">something went wrong {getActiveUserError}</div>;
  }
  return (
    <nav className="leftsidebar">
      <NavLinks userDetails={user as User} />
    </nav>
  );
}
