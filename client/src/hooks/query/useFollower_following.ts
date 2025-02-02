import { toast } from "@/components/ui/use-toast";
import type { ErrorResponse } from "@/constant/interfaces";
import { QueryKeys } from "@/constant/keys";
import { customAxiosRequestForPost } from "@/lib/axiosRequest";
import { queryClient } from "@/main";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export default function useFollowerFollowing() {
	function addFollower() {
		return useMutation({
			mutationFn: (payload: { followerId: string;}) =>
				customAxiosRequestForPost("/followers", "post", payload),

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
				queryClient.invalidateQueries({
					queryKey: [QueryKeys.USER_BY_ID],
				});
				queryClient.invalidateQueries({
					queryKey: [QueryKeys.USERS],
				});
			},
		});
	}

  // remove follower
  function removeFollower(){
    return useMutation({
			mutationFn: (payload: { followerId: string;}) =>
				customAxiosRequestForPost("/followers", "delete", payload),

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
				queryClient.invalidateQueries({
					queryKey: [QueryKeys.USER_BY_ID],
				});
				queryClient.invalidateQueries({
					queryKey: [QueryKeys.USERS],
				});
			},
		});
  }
	return { addFollower,removeFollower };
}
