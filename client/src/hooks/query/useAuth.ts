import { useToast } from "@/components/ui/use-toast";
import { customAxiosRequestForPost } from "@/lib/axiosRequest";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

function useAuth() {
  const { toast } = useToast();
  // sign up

  function useSignUp() {
    return useMutation({
      mutationFn: (payload: {
        username: string;
        name: string;
        email: string;
        password: string;
        avatar: string | null;
      }) => customAxiosRequestForPost("/register", "post", payload),

      onError: (error: AxiosError) => {
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

  function useSignIn() {
    return useMutation({
      mutationFn: (payload: { email: string; password: string }) =>
        customAxiosRequestForPost("/login", "post", payload),

      onError: (error: AxiosError) => {
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
    useSignUp,
    useSignIn,
  };
}

export default useAuth;
