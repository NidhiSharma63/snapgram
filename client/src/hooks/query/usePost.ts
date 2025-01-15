import { useToast } from "@/components/ui/use-toast";
import type { ErrorResponse, IPost } from "@/constant/interfaces";
import { QueryKeys } from "@/constant/keys";
import {
  customAxiosRequestForGet,
  customAxiosRequestForPost,
} from "@/lib/axiosRequest";
import { queryClient } from "@/main";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

function usePost() {
	const queriesToInavlidate = () => {
		queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USER_SAVE_POST] });
		queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_ALL_POSTS] });
		queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USER_ALL_POSTS] });
	};
	const { toast } = useToast();
	//create post

	function useCreatePost() {
		return useMutation({
			mutationFn: (payload: {
				caption: string;
				file: string;
				location: string;
				tags: string;
				userId: string | null;
				userAvatar: string | null;
				createdAt: Date;
			}) => customAxiosRequestForPost("/post", "post", payload),

			onError: (error: AxiosError<ErrorResponse>) => {
				console.log(error);

				if (error.response?.data.status === 400) {
					toast({
						title: error.response.data.error,
					});
				} else {
					toast({
						title: "Something went wrong",
					});
				}
			},
			onSuccess: () => {
				queriesToInavlidate();
			},
		});
	}

	/** update post */

	function useUpdatePost() {
		return useMutation({
			mutationFn: (payload: {
				caption: string;
				file: string;
				location: string;
				tags: string;
				userId: string | null;
				userAvatar: string | null;
				createdAt: Date;
				_id: string;
			}) => customAxiosRequestForPost("/post", "put", payload),

			onError: (error: AxiosError<ErrorResponse>) => {
				console.log(error);

				if (error.response?.data.status === 400) {
					toast({
						title: error.response.data.error,
					});
				} else {
					toast({
						title: "Something went wrong",
					});
				}
			},
			onSuccess: () => {
				queriesToInavlidate();
			},
		});
	}

	/**
	 * delete post
	 */
	function useDeletePost() {
		return useMutation({
			mutationFn: (payload: { _id: string }) =>
				customAxiosRequestForPost("/post", "delete", payload),

			onError: (error: AxiosError<ErrorResponse>) => {
				console.log(error);

				if (error.response?.data.status === 400) {
					toast({
						title: error.response.data.error,
					});
				} else {
					toast({
						title: "Something went wrong",
					});
				}
			},
			onSuccess: () => {
				queriesToInavlidate();
			},
		});
	}

	function useGetAllPost() {
		return useQuery({
			queryKey: [QueryKeys.GET_ALL_POSTS],
			queryFn: () => customAxiosRequestForGet("/posts", null),
		});
	}

	function useGetPostById(id: string) {
		return useQuery({
			queryKey: [QueryKeys.GET_POST_BY_ID, id],
			queryFn: () => customAxiosRequestForGet("/post", id),
		});
	}

	function useGetUserAllPost(id: string) {
		return useQuery({
			queryKey: [QueryKeys.GET_USER_ALL_POSTS, id],
			queryFn: () => customAxiosRequestForGet("/user/posts", id),
		});
	}

	function useGetPostByIds(ids: string[]) {
		const queryResult = useQueries({
			queries: ids
				? ids?.map((id) => {
						return {
							queryKey: ["post", id],
							queryFn: () => customAxiosRequestForGet("/post", id),
						};
					})
				: [],
		});

		let isLoading;
		let isFetching;
		const allPosts = queryResult?.map((item) => {
			isLoading = item.isLoading;
			isFetching = item.isFetching;
			return item?.data;
		});

		// Filter out null values if any post id is saved in saved collection but post
		// was deleted by user:(second layer)
		const filteredData = allPosts?.filter(
			(item: IPost | null) => item !== null,
		);

		return {
			data: filteredData,
			isLoading,
			isFetching,
		};
	}

	return {
		useCreatePost,
		useGetPostById,
		useGetAllPost,
		useUpdatePost,
		useDeletePost,
		useGetPostByIds,
		useGetUserAllPost,
	};
}

export default usePost;
