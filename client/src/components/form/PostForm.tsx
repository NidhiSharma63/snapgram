"use client";

import FileUploader from "@/src/components/shared/fileUploader";
import { Button } from "@/src/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { postFormSchema } from "@/src/constant/validation";
import { PostFormProps } from "@/src/types/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

function PostForm({ post, action, userDetails }: PostFormProps) {
  const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      caption: post ? post.caption[0] : "",
      file: [],
      location: post ? post.location[0] : "",
      tags: post ? post.tags.join(",") : "",
      userId: userDetails && userDetails._id,
      userAvatar: userDetails && userDetails.avatar,
      createdAt: post ? new Date(post.createdAt) : new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof postFormSchema>) {
    values;
    if (post && action === "Update") {
      // const updatedPost = await updatePost({ ...values, file: post.file, _id: post._id });
      // if (!updatedPost) {
      //   ToastError({ msg: "Please try again" });
      // }
      // return navigate(`/posts/${post._id}`);
    }
    // const { file } = values;
    // try {
    //   setIsPostUploading(true);
    //   const imageRef = ref(storage, `/images/${file[0]}-${v4()}`);
    //   const snapshot = await uploadBytes(imageRef, file[0]);
    //   const url = await getDownloadURL(snapshot.ref);
    //   const updatedPayload = { ...values, file: url };
    //   await createPost({ ...updatedPayload });
    // } catch (error) {
    //   toast({ title: "Please try again" });
    //   setIsPostUploading(false);
    // }

    // navigate("/");
    // setIsPostUploading(false);
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
                <FileUploader fieldChange={field.onChange} mediaUrl={post ? post?.file : ""} />
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
          {action === "Update" ? (
            <Button
              type="button"
              className="shad-btn-delete"
              //   disabled={
              //     isCreatingPost ||
              //     isLoadingUpdate ||
              //     isDeletingPost ||
              //     isRemovingPostFromSaveCollection ||
              //     isRemovingPostFromLikeCollection
              //   }
              // onClick={handleDeletePost}
            >
              Delete
            </Button>
          ) : (
            <Button
              type="button"
              className="shad-button_dark_4"
              //   disabled={isCreatingPost || isLoadingUpdate || isDeletingPost || isPostUploading}
            >
              Cancel
            </Button>
          )}
          {/* {isCreatingPost ||
          isLoadingUpdate ||
          isDeletingPost ||
          isRemovingPostFromSaveCollection ||
          isPostUploading ? (
            <Button className="shad-button_primary whitespace-nowrap">
              <Loader />
            </Button>
          ) : (
            <Button type="submit" className="shad-button_primary whitespace-nowrap">
              {action === "Update" ? "Update" : "Upload"}
            </Button>
          )} */}
        </div>
      </form>
    </Form>
  );
}

export default PostForm;
