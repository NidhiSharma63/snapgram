// import GridPostList from "@/components/ui/shared/GridPostList";
// import Loader from "@/components/ui/shared/Loa/der";
import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserDetail } from "@/context/userContext";
import useAuth from "@/hooks/query/useAuth";
import useLikePost from "@/hooks/query/useLikePost";
import usePost from "@/hooks/query/usePost";
import { Link, Outlet, useParams } from "react-router-dom";

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium dark:text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { useGetUserById } = useAuth();
  const { data } = useGetUserById(id?.replace(":", "") || "");
  const { userDetails } = useUserDetail();
  const { useGetUserAllPost, useGetPostByIds } = usePost();
  const { data: allPostOfUser, isPending: isUserPostLoading } = useGetUserAllPost(id?.replace(":", "") || "");
  const { useGetAllLike } = useLikePost();
  const { data: allLikePostIds } = useGetAllLike();
  const { data: likePosts, isFetching: isFecthingLikePost } = useGetPostByIds(allLikePostIds?.[0]?.postId);

  if (!data)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={data?.avatar || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full"> @{data.username}</h1>
              <p className="small-regular md:body-medium dark:text-light-3 text-center xl:text-left">{data.email}</p>
              <p className="small-medium  text-center xl:text-left mt-2 max-w-screen-sm">Bio</p>
              <p className="small-medium md:base-medium text-center xl:text-left mt-1 max-w-screen-sm">{data.bio}</p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              {/* <StatBlock value={currentUser.posts.length} label="Posts" /> */}
              <StatBlock value={20} label="Followers" />
              <StatBlock value={20} label="Following" />
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${userDetails && userDetails._id !== data._id && "hidden"}`}>
              <Link
                to={`/update-profile/${data._id}`}
                className={`h-12 dark:bg-dark-4 px-5 bg-off-white text-light-1 flex-center gap-2 rounded-lg ${
                  userDetails && userDetails._id !== data._id && "hidden"
                }`}>
                <img src={"/assets/icons/edit.svg"} alt="edit" width={20} height={20} />
                <p className="flex whitespace-nowrap small-medium dark:text-white text-black">Edit Profile</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isUserPostLoading || isFecthingLikePost ? (
        <Loader />
      ) : (
        <>
          {userDetails?._id === data?._id ? (
            <Tabs defaultValue="Posts" className="w-full  flex justify-center flex-col">
              <TabsList className="dark:bg-black bg-off-white">
                <TabsTrigger value="Posts">Posts</TabsTrigger>
                <TabsTrigger value="Likes">Likes</TabsTrigger>
              </TabsList>

              <TabsContent value="Posts">
                <GridPostList posts={allPostOfUser} showUser={false} />
              </TabsContent>
              <TabsContent value="Likes">
                <GridPostList posts={likePosts} showUser={false} />
              </TabsContent>
            </Tabs>
          ) : allPostOfUser.length === 0 && userDetails && userDetails._id !== data?._id ? (
            data?.username + " haven't posted anything"
          ) : (
            <GridPostList posts={allPostOfUser} showUser={false} />
          )}
        </>
      )}

      <Outlet />
    </div>
  );
};

export default Profile;
