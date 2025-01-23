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

function useAuth() {
	const { toast } = useToast();
	// sign up

	function useSignUp() {
		return useMutation({
			mutationFn: (payload: {
				username: string;
				bio: string;
				email: string;
				password: string;
				avatar: string | null;
			}) => customAxiosRequestForPost("/register", "post", payload),

			onError: (error: AxiosError<ErrorResponse>) => {
				console.log(error);

				if (error?.response?.data.status === 400) {
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

	/**
	 * use sign in (login)
	 */
	function useSignIn() {
		return useMutation({
			mutationFn: (payload: { email: string; password: string }) =>
				customAxiosRequestForPost("/login", "post", payload),

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

	/**
	 * use logout
	 */

	function useLogout() {
		return useMutation({
			mutationFn: (payload: { userId: string; token: string }) =>
				customAxiosRequestForPost("/logout", "post", payload),
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

	/**
	 * use get user by id
	 */

	function useGetUserById(id: string) {
		return useQuery({
			enabled: !!id,
			queryKey: [QueryKeys.USER_BY_ID, id],
			queryFn: () => customAxiosRequestForGet("/user", id),
		});
	}

	/**
	 * use get all user
	 */

	function useGetAllUser() {
		return useQuery({
			queryKey: [QueryKeys.USERS],
			queryFn: () => customAxiosRequestForGet("/users", null),
		});
	}

	/**
	 * update user
	 */

	function useUpdateUser() {
		return useMutation({
			mutationFn: (payload: { bio: string; file: string }) =>
				customAxiosRequestForPost("/user", "put", payload),
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
				queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_BY_ID] });
			},
		});
	}
	return {
		useSignUp,
		useSignIn,
		useLogout,
		useGetUserById,
		useUpdateUser,
		useGetAllUser,
	};
}

export default useAuth;
