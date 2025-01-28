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

export default function useSavePost() {
	const { toast } = useToast();
	const { setSavePostId } = useUserPostIdForSaveAndLike();

	function useAddSave() {
		return useMutation({
			mutationFn: (payload: { userId: string; postId: string }) =>
				customAxiosRequestForPost("/save/add", "put", payload),

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
				setSavePostId("");
				queryClient.invalidateQueries({
					queryKey: [QueryKeys.GET_USER_SAVE_POST],
				});
			},
		});
	}

	/**
	 * use remove save
	 */

	function useRemoveSave() {
		return useMutation({
			mutationFn: (payload: { userId: string; postId: string }) =>
				customAxiosRequestForPost("/save/remove", "delete", payload),

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
				setSavePostId("");
				queryClient.invalidateQueries({
					queryKey: [QueryKeys.GET_USER_SAVE_POST],
				});
			},
		});
	}

	/**
	 * use get all save
	 */

	function useGetAllSavePost() {
		return useQuery({
			queryKey: [QueryKeys.GET_USER_SAVE_POST],
			queryFn: () => customAxiosRequestForGet("/saves", {}),
		});
	}
	return {
		useAddSave,
		useRemoveSave,
		useGetAllSavePost,
	};
}
