import { useToast } from "@/components/ui/use-toast";
import type { ErrorResponse } from "@/constant/interfaces";
import {
	customAxiosRequestForGet,
	customAxiosRequestForPost,
} from "@/lib/axiosRequest";
import { queryClient } from "@/main";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export default function useMessage(roomId:string,messageId:string) {
	const { toast } = useToast();
	// console.log("roomId",rr)
	// function useGetAllMessages() {
	// 	return useQuery({
	// 		queryKey: [`${QueryKeys.GET_USER_MESSAGES}-${roomId}`],
	// 		queryFn: () => customAxiosRequestForGet("/messages",  {roomId,messageId}),
  //     enabled: !!roomId
	// 	});
	// }

	function useGetAllMessages() {
		return useInfiniteQuery({
			queryKey: ["messages", roomId], // Cache key
			queryFn: async ({ pageParam = null }) => {
				// Function to fetch data
				const response = await customAxiosRequestForGet("/messages", {
					roomId,
					lastMessageId: pageParam,
				});
				// console.log("response",response)
				return response;
			},
			getNextPageParam: (lastPage) => {
				
				if (lastPage && lastPage.length > 0) {
					return lastPage[lastPage.length - 1]._id; // Return the last message's ID
				}
				return null; // No more pages
			},
			enabled: !!roomId, // Only run if roomId is present
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
					queryKey: ['messages', roomId],
				});
			},
		});
	}

	return {
		useGetAllMessages,
		useDeleteMessage,
		// useGetAllMessages2
	};
}
