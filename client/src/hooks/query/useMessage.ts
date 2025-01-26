import { useToast } from "@/components/ui/use-toast";
import type { ErrorResponse } from "@/constant/interfaces";
import { type IMessage, useSocket } from "@/context/socketProviders";
import {
	customAxiosRequestForGet,
	customAxiosRequestForPost,
} from "@/lib/axiosRequest";
import { queryClient } from "@/main";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export default function useMessage() {
	const { toast } = useToast();
	const { roomId } = useSocket();
	// console.log("roomId",rr)
	// function useGetAllMessages() {
	// 	return useQuery({
	// 		queryKey: [`${QueryKeys.GET_USER_MESSAGES}-${roomId}`],
	// 		queryFn: () => customAxiosRequestForGet("/messages",  {roomId,messageId}),
	//     enabled: !!roomId
	// 	});
	// }

	function useGetAllMessages(roomId:string) {
		return useInfiniteQuery<
		IMessage[], // The type of each page of data
			Error// Error type
		>({
			queryKey: ["messages", roomId], // Cache key
			queryFn: async ({ pageParam = null }) => {
				// Function to fetch data
				const response = await customAxiosRequestForGet("/messages", {
					roomId,
					lastMessageId: pageParam as string,
				});
				// console.log("response",response)
				return response;
			},
			initialPageParam: null, // Start with no last message ID
			getNextPageParam: (lastPage: Message[]) => {
				if (lastPage && lastPage.length > 0) {
					return lastPage[lastPage.length - 1]._id; // Return the last message's ID
				}
				return null; // No more pages
			},
			enabled: roomId != null 
		});
	}
	function useDeleteMessage() {
		return useMutation({
			mutationFn: (payload: {  messageId: string }) =>
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
					queryKey: ["messages", roomId],
				});
			},
		});
	}

	function useMarkMessageAsRead() {
		return useMutation({
			mutationFn: (payload: { roomId: string ,userId:string}) =>
				customAxiosRequestForPost("/message/mark-as-read", "post", payload),
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
					queryKey: ["messages", roomId],
				});
			},
		});
	}

	function useSendMessage() {
		return useMutation({
			mutationFn: (payload: {
				roomId: string;
				message: string;
				senderId: string;
				receiverId: string;
				createdAt: Date;
			}) =>
				customAxiosRequestForPost("/message", "post", payload),
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
		});
	}
	return {
		useGetAllMessages,
		useDeleteMessage,
		useMarkMessageAsRead,
		useSendMessage
	};
}
