import UpdateProfile from "@/src/components/profile/updateProfile";
import { getActiveUserData } from "@/src/server/user";
import { User } from "@/src/types/user";
async function page() {
  const { user } = await getActiveUserData();
  return <UpdateProfile user={user as User} />;
}

export default page;
