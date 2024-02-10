import PostForm from "@/src/components/form/PostForm";
import { getActiveUserData } from "@/src/server/user";
import { User } from "@/src/types/user";

async function Page() {
  try {
    const { user } = await getActiveUserData();
    return (
      <div className="flex flex-1">
        <div className="common-container">
          <div className="max-w-5xl flex-start gap-3 justify-start w-full">
            <img
              // src={theme === "dark" ? "/assets/icons/add-post.svg" : "/assets/icons/add-post-light.svg"}
              alt="add"
              src="/assets/icons/add-post-light.svg"
              height={36}
              width={36}
            />
            <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
          </div>
          <PostForm action="Create" userDetails={user as User} />
        </div>
      </div>
    );
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Something went wrong");
    return <div>Something went wrong. Error : {e?.message}</div>;
  }
}

export default Page;
