import { useToast } from "@/components/ui/use-toast";
import type { ErrorResponse } from "@/constant/interfaces";
import { QueryKeys } from "@/constant/keys";
import {
	customAxiosRequestForGet,
	customAxiosRequestForPost,
} from "@/lib/axiosRequest";
import { queryClient } from "@/main";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export default function useMessage(roomId:string,messageId:string) {
	const { toast } = useToast();
	function useGetAllMessages() {
		return useQuery({
			queryKey: [`${QueryKeys.GET_USER_MESSAGES}-${roomId}`],
			queryFn: () => customAxiosRequestForGet("/messages",  {roomId,messageId}),
      enabled: !!roomId
		});
	}

	function useDeleteMessage() {
		return useMutation({
			mutationFn: (payload: { userId: string; messageId: string }) =>
				customAxiosRequestForPost("/message/delete", "delete", payload),

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
				queryClient.invalidateQueries({
					queryKey: [`${QueryKeys.GET_USER_MESSAGES}-${roomId}`],
				});
			},
		});
	}

	return {
		useGetAllMessages,
		useDeleteMessage,
	};
}
