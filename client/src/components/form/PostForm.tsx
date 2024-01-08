import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { postFormSchema } from "@/constant/validation";
// import { useAuthContext } from "@/context/AuthContext";
// import { useCreatePost, useUpdatePost } from "@/lib/react-query/queryAndMutations";
import FileUploader from "@/components/shared/FileUploader";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IPost } from "@/constant/interfaces";
import { useUserDetail } from "@/context/userContext";
import { storage } from "@/firebase/config";
import useLikePost from "@/hooks/query/useLikePost";
import usePost from "@/hooks/query/usePost";
import useSavePost from "@/hooks/query/useSavePost";
import { gql, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import * as z from "zod";

interface IPostFormProps {
	post?: IPost;
	action: "Create" | "Update";
}

const CREATE_POST = gql`
	mutation CreatePost($userInput: CreatePostInput!) {
		createPost(userInput: $userInput) {
			caption
			createdAt
			file
			likes
			location
			tags
			userId
			_id
		}
	}
`;
export default function PostForm({ post, action }: IPostFormProps) {
	//   const { mutateAsync: createPost, isPending: isUploadingPost } = useCreatePost();

	const [createPost, { loading: isCreatingPost }] = useMutation(CREATE_POST);
	const { useCreatePost, useUpdatePost, useDeletePost } = usePost();
	const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost();
	// const { mutateAsync: createPost, isPending: isCreatingPost } = useCreatePost();
	const { mutateAsync: deletePost, isPending: isDeletingPost } = useDeletePost();
	const [isPostUploading, setIsPostUploading] = useState(false);

	// save post
	const { useRemoveSave, useGetAllSavePost } = useSavePost();
	const { mutateAsync: removePostFromSave, isPending: isRemovingPostFromSaveCollection } = useRemoveSave();
	const { data: savePosts } = useGetAllSavePost();

	// like post
	const { useRemoveLike, useGetAllLike } = useLikePost();
	const { mutateAsync: removePostFromLike, isPending: isRemovingPostFromLikeCollection } = useRemoveLike();
	const { data: likePosts } = useGetAllLike();

	const navigate = useNavigate();
	const { userDetails } = useUserDetail();
	const { toast } = useToast();

	const form = useForm<z.infer<typeof postFormSchema>>({
		resolver: zodResolver(postFormSchema),
		defaultValues: {
			caption: post ? post.caption[0] : "",
			file: [],
			location: post ? post.location[0] : "",
			tags: post ? post.tags.join(",") : "",
			userId: userDetails && userDetails._id,
			createdAt: post ? new Date(post.createdAt) : new Date(),
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof postFormSchema>) {
		values;
		if (post && action === "Update") {
			const updatedPost = await updatePost({ ...values, file: post.file, _id: post._id });

			if (!updatedPost) {
				toast({ title: "Please try again" });
			}
			return navigate(`/posts/${post._id}`);
		}
		const { file } = values;
		try {
			console.log("i run");
			setIsPostUploading(true);
			const imageRef = ref(storage, `/images/${file[0]}-${v4()}`);
			const snapshot = await uploadBytes(imageRef, file[0]);
			const url = await getDownloadURL(snapshot.ref);
			const updatedPayload = { ...values, file: url };
			// await createPost({ ...updatedPayload });
			createPost({
				variables: {
					userInput: updatedPayload,
				},
			});
		} catch (error) {
			toast({ title: "Please try again" });
			setIsPostUploading(false);
		}

		navigate("/");
		setIsPostUploading(false);
	}

	const handleDeletePost = async () => {
		if (post && userDetails) {
			const storageRef = ref(storage, post.file);
			try {
				setIsPostUploading(true);
				await deletePost({ _id: post._id });
				await deleteObject(storageRef);
				if (savePosts?.[0]?.postId.includes(post._id)) {
					await removePostFromSave({ postId: post._id, userId: userDetails?._id });
				}
				if (likePosts?.[0]?.postId.includes(post._id)) {
					await removePostFromLike({ postId: post._id, userId: userDetails?._id });
				}
				navigate("/");
			} catch (error) {
				toast({ title: "Please try again" });
				setIsPostUploading(false);
			}
			setIsPostUploading(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-9 w-full max-w-5xl"
			>
				<FormField
					control={form.control}
					name="caption"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Caption</FormLabel>
							<FormControl>
								<Textarea
									className="shad-textarea custom-scrollbar"
									placeholder="Name"
									{...field}
								/>
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="file"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Add Photos</FormLabel>
							<FormControl>
								<FileUploader
									fieldChange={field.onChange}
									mediaUrl={post ? post?.file : ""}
								/>
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="location"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Add Location</FormLabel>
							<FormControl>
								<Input
									type="text"
									className="shad-input"
									{...field}
								/>
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="tags"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Add Tags (separated by comma " , ")</FormLabel>
							<FormControl>
								<Input
									type="text"
									className="shad-input"
									placeholder="Art, Expression, Learn"
									{...field}
								/>
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>
				<div className="flex gap-4 items-center justify-end">
					{action === "Update" ? (
						<Button
							type="button"
							className="shad-btn-delete"
							disabled={
								isCreatingPost ||
								isLoadingUpdate ||
								isDeletingPost ||
								isRemovingPostFromSaveCollection ||
								isRemovingPostFromLikeCollection
							}
							onClick={handleDeletePost}
						>
							Delete
						</Button>
					) : (
						<Button
							type="button"
							className="shad-button_dark_4"
							disabled={isCreatingPost || isLoadingUpdate || isDeletingPost || isPostUploading}
						>
							Cancel
						</Button>
					)}
					{isCreatingPost ||
					isLoadingUpdate ||
					isDeletingPost ||
					isRemovingPostFromSaveCollection ||
					isPostUploading ? (
						<Button className="shad-button_primary whitespace-nowrap">
							<Loader />
						</Button>
					) : (
						<Button
							type="submit"
							className="shad-button_primary whitespace-nowrap"
						>
							{action === "Update" ? "Update" : "Upload"}
						</Button>
					)}
				</div>
			</form>
		</Form>
	);
}
