import { useToast } from "@/components/ui/use-toast";
import { QueryKeys } from "@/constant/keys";
import { customAxiosRequestForGet, customAxiosRequestForPost } from "@/lib/axiosRequest";
import { queryClient } from "@/main";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface IAddOrRemovePost {
  userId: string;
  postId: string;
}
export default function useSavePost() {
  const { toast } = useToast();

  function useAddSave() {
    return useMutation({
      mutationFn: (payload: IAddOrRemovePost) => customAxiosRequestForPost("/save/add", "put", payload),

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
      },
    });
  }

  /**
   * use remove save
   */

  function useRemoveSave() {
    return useMutation({
      mutationFn: (payload: IAddOrRemovePost) => customAxiosRequestForPost("/save/remove", "delete", payload),

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
      },
    });
  }

  /**
   * use get all save
   */

  function useGetAllSavePost() {
    return useQuery({
      queryKey: [QueryKeys.GET_USER_SAVE_POST],
      queryFn: () => customAxiosRequestForGet("/saves", null),
    });
  }
  return {
    useAddSave,
    useRemoveSave,
    useGetAllSavePost,
  };
}
