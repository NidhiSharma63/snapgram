import { useToast } from "@/components/ui/use-toast";
import { ICreatePost, IUpdatePost } from "@/constant/interfaces";
import { QueryKeys } from "@/constant/keys";
import { customAxiosRequestForGet, customAxiosRequestForPost } from "@/lib/axiosRequest";
import { queryClient } from "@/main";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
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
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USER_SAVE_POST] });
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_ALL_POSTS] });
      },
    });
  }

  /** update post */

  function useUpdatePost() {
    return useMutation({
      mutationFn: (payload: IUpdatePost) => customAxiosRequestForPost("/post", "put", payload),

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
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USER_SAVE_POST] });
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_ALL_POSTS] });
      },
    });
  }

  /**
   * delete post
   */
  function useDeletePost() {
    return useMutation({
      mutationFn: (payload: { _id: string }) => customAxiosRequestForPost("/post", "delete", payload),

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
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USER_SAVE_POST] });
        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_ALL_POSTS] });
      },
    });
  }

  function useGetAllPost() {
    return useQuery({
      queryKey: [QueryKeys.GET_ALL_POSTS],
      queryFn: () => customAxiosRequestForGet("/posts", null),
    });
  }

  function useGetPostById(id: string) {
    return useQuery({
      queryKey: [QueryKeys.GET_POST_BY_ID, id],
      queryFn: () => customAxiosRequestForGet("/post", id),
    });
  }

  function useGetPostByIds(ids: string[]) {
    const queryResult = useQueries({
      queries: ids
        ? ids?.map((id) => {
            return {
              queryKey: ["post", id],
              queryFn: () => customAxiosRequestForGet("/post", id),
            };
          })
        : [],
    });
    // const data = queryRe
    return {
      data: [queryResult[0]?.data],
      isLoading: queryResult[0]?.isLoading,
      isFetching: queryResult[0]?.isFetching,
    };
  }

  return {
    useCreatePost,
    useGetPostById,
    useGetAllPost,
    useUpdatePost,
    useDeletePost,
    useGetPostByIds,
  };
}

export default usePost;
