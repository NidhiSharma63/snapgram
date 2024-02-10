import UpdateProfile from "@/src/components/profile/updateProfile";
import { getActiveUserData } from "@/src/server/user";
import { User } from "@/src/types/user";
async function page() {
  try {
    const { user } = await getActiveUserData();
    return <UpdateProfile user={user as User} />;
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Something went wrong");
    return <div>Something went wrong. Error : {e?.message}</div>;
  }
}

export default page;
