import { useToast } from "@/components/ui/use-toast";
import type { ErrorResponse } from "@/constant/interfaces";
import { QueryKeys } from "@/constant/keys";
import { useUserPostIdForSaveAndLike } from "@/context/userPostIdForSaveAndLike";
import {
  customAxiosRequestForGet,
  customAxiosRequestForPost,
} from "@/lib/axiosRequest";
import { queryClient } from "@/main";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useParams } from "react-router-dom";

export default function useLikePost() {
	const { toast } = useToast();
	const { setLikePostId } = useUserPostIdForSaveAndLike();
  const { id } = useParams();

	function useAddLike() {
		return useMutation({
			mutationFn: (payload: { userId: string; postId: string }) =>
				customAxiosRequestForPost("/like/add", "put", payload),

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
			onSettled: () => {
				setLikePostId("");
				queryClient.invalidateQueries({
					queryKey: [QueryKeys.GET_USER_Like_POST],
				});
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USER_SAVE_POST] });
				queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_ALL_POSTS] });
        queryClient.invalidateQueries({queryKey: [QueryKeys.GET_POST_BY_ID, id]})
			},
		});
	}

	/**
	 * use remove save
	 */

	function useRemoveLike() {
		return useMutation({
			mutationFn: (payload: { userId: string; postId: string }) =>
				customAxiosRequestForPost("/like/remove", "delete", payload),

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
			onSettled: () => {
				setLikePostId("");
				queryClient.invalidateQueries({
					queryKey: [QueryKeys.GET_USER_Like_POST],
				});
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USER_SAVE_POST] });
				queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_ALL_POSTS] });
        queryClient.invalidateQueries({queryKey: [QueryKeys.GET_POST_BY_ID, id]})
			},
		});
	}

	/**
	 * use get all save
	 */

	function useGetAllLike() {
		return useQuery({
			queryKey: [QueryKeys.GET_USER_Like_POST],
			queryFn: () => customAxiosRequestForGet("/likes", null),
		});
	}
	return {
		useAddLike,
		useRemoveLike,
		useGetAllLike,
	};
}
