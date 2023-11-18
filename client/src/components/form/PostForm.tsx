import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { postFormSchema } from "@/constant/validation";
// import { useAuthContext } from "@/context/AuthContext";
// import { useCreatePost, useUpdatePost } from "@/lib/react-query/queryAndMutations";
import FileUploader from "@/components/shared/FileUploader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUserDetail } from "@/context/userContext";
import { storage } from "@/firebase/config";
import usePost from "@/hooks/query/usePost";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import * as z from "zod";

interface IPostFormProps {
  post?: [];
  action: "Create" | "Update";
}

export default function PostForm({ post, action }: IPostFormProps) {
  //   const { mutateAsync: createPost, isPending: isUploadingPost } = useCreatePost();
  //   const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost();

  const { useCreatePost } = usePost();
  const { mutateAsync: createPost, isPending: isCreatingPost } = useCreatePost();
  const navigate = useNavigate();
  const { userDetails } = useUserDetail();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      caption: "",
      file: [],
      location: "",
      tags: "",
      userId: userDetails && userDetails._id,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof postFormSchema>) {
    values;
    // if (post && action === "Update") {
    //   //   const updatedPost = await updatePost({
    //   //     ...values,
    //   //     postId: post.$id,
    //   //     imageUrl: post?.imageUrl,
    //   //     imageId: post?.imageId,
    //   //   });

    //   if (!updatedPost) {
    //     toast({ title: "Please try again" });
    //   }
    //   return navigate(`/posts/${post.$id}`);
    // }
    const { file } = values;
    const imageRef = ref(storage, `/images/${file[0]}-${v4()}`);
    const snapshot = await uploadBytes(imageRef, file[0]);
    const url = await getDownloadURL(snapshot.ref);
    const updatedPayload = { ...values, file: url };
    const newPost = await createPost({ ...updatedPayload });

    if (!newPost) {
      toast({ title: "Please try again" });
    }
    navigate("/");
    console.log({ values });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar" placeholder="Name" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader fieldChange={field.onChange} mediaUrl={post?.file} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags (separated by comma " , ")</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" placeholder="Art, Expression, Learn" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          {/* <Button type="button" className="shad-button_dark_4" disabled={isLoadingUpdate || isUploadingPost}> */}
          {/* Cancel
          </Button> */}

          {/* {isLoadingUpdate || isUploadingPost ? (
            <Button className="shad-button_primary whitespace-nowrap">
              <Loader />
            </Button>
          ) : ( */}
          <Button type="submit" className="shad-button_primary whitespace-nowrap">
            {action === "Update" ? "Update" : "Upload"}
          </Button>
          {/* )} */}
        </div>
      </form>
    </Form>
  );
}
