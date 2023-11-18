import { useToast } from "@/components/ui/use-toast";
import { QueryKeys } from "@/constant/keys";
import { customAxiosRequestForGet, customAxiosRequestForPost } from "@/lib/axiosRequest";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

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

      onError: (error: AxiosError) => {
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
   * use sign in (login)
   */
  function useSignIn() {
    return useMutation({
      mutationFn: (payload: { email: string; password: string }) =>
        customAxiosRequestForPost("/login", "post", payload),

      onError: (error: AxiosError) => {
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
      mutationFn: (payload: { userId: string; token: string }) => customAxiosRequestForPost("/logout", "post", payload),
      onError: (error: AxiosError) => {
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
      queryKey: [QueryKeys.USER_BY_ID],
      queryFn: () => customAxiosRequestForGet("/user", id),
    });
  }
  return {
    useSignUp,
    useSignIn,
    useLogout,
    useGetUserById,
  };
}

export default useAuth;
