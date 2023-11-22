import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useToast } from "@/components/ui/use-toast";
import { IUser } from "@/constant/interfaces";
import useAuth from "@/hooks/query/useAuth";

const AllUsers = () => {
  const { toast } = useToast();
  const { useGetAllUser } = useAuth();
  const { data: creators, isError: isErrorCreators, isPending: isLoading } = useGetAllUser();

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });

    return;
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.map((creator: IUser) => (
              <li key={creator?._id} className="flex-1 w-fit ">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
