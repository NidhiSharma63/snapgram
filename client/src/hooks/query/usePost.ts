import { useToast } from "@/components/ui/use-toast";
import { ICreatePost } from "@/constant/interfaces";
import { QueryKeys } from "@/constant/keys";
import { customAxiosRequestForGet, customAxiosRequestForPost } from "@/lib/axiosRequest";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

function usePost() {
  const { toast } = useToast();
  //create post

  function useCreatePost() {
    return useMutation({
      mutationFn: (payload: ICreatePost) => customAxiosRequestForPost("/post", "post", payload),

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

  function useGetAllPost() {
    return useQuery({
      queryKey: [QueryKeys.GET_ALL_POSTS],
      queryFn: () => customAxiosRequestForGet("/posts", null),
    });
  }

  return {
    useCreatePost,
    useGetAllPost,
  };
}

export default usePost;