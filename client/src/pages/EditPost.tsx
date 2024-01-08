import PostForm from "@/components/form/PostForm";
import Loader from "@/components/shared/Loader";
import usePost from "@/hooks/query/usePost";
import { GET_POST_BY_ID } from "@/queries/postQueries";
import { useQuery } from "@apollo/client";
// import { useGetPostById } from "@/lib/react-query/queryAndMutations";
import { useParams } from "react-router-dom";

export default function EditPost() {
	const { id } = useParams();
	const { data, loading } = useQuery(GET_POST_BY_ID, { variables: { _id: id } });
	console.log({ data }, "From edit post");
	const { useGetPostById } = usePost();
	// const { data: post, isPending } = useGetPostById(id || "");
	if (loading) return <Loader />;

	return (
		<div className="flex flex-1">
			<div className="common-container">
				<div className="max-w-5xl flex-start gap-3 justify-start w-full">
					<img
						src="/assets/icons/add-post.svg"
						alt="add"
						height={36}
						width={36}
					/>
					<h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
				</div>
				<PostForm
					action="Update"
					post={data?.getPostById}
				/>
			</div>
		</div>
	);
}
