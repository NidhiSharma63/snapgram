import { customAxiosRequestForPost } from "@/lib/axiosRequest";
import { useMutation } from "@tanstack/react-query";

function useAuth() {
  // sign up

  function useSignUp() {
    return useMutation({
      mutationFn: (payload) => customAxiosRequestForPost("/register", "put", payload),
      onSuccess: () => {
        console.log("success");
      },
    });
  }

  return {
    useSignUp,
  };
}

export default useAuth;
