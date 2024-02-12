import AllUserComponent from "@/src/components/allUsers/allUserComponent";
import Loader from "@/src/components/shared/Loader";
import { getAllUser } from "@/src/server/user";
import { User } from "@/src/types/user";

async function page() {
  try {
    const { users: creators, error: getAllUserError } = await getAllUser();

    if (getAllUserError) {
      return <div>Something went wrong Error: {getAllUserError}</div>;
    }
    return (
      <div className="common-container">
        <div className="user-container">
          <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
          {!creators ? (
            <Loader />
          ) : (
            <ul className="user-grid">
              {creators?.map((creator: User) => (
                <li key={creator?._id} className="flex-1 w-[300px]  ">
                  <AllUserComponent user={creator} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Something went wrong");
    return <div>Something went wrong Error: {e.message}</div>;
  }
}

export default page;
