"use client";

import Loader from "@/src/components/shared/Loader";
import FileUploader from "@/src/components/shared/fileUploader";
import { Button } from "@/src/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { storage } from "@/src/constant/firebase/config";
import { postFormSchema } from "@/src/constant/validation";
import createPost from "@/src/server/post/createPost";
import { PostFormProps } from "@/src/types/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import * as z from "zod";
import { useToast } from "../ui/use-toast";

function PostForm({ post, action, userDetails }: PostFormProps) {
  const router = useRouter();
  const [isPostUploading, setIsPostUploading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      caption: post ? post.caption[0] : "",
      file: [],
      location: post ? post.location[0] : "",
      tags: post ? post.tags : "",
      userId: userDetails && userDetails._id,
      userAvatar: userDetails && userDetails.avatar,
      createdAt: post ? new Date(post.createdAt) : new Date(),
    },
  });

  const handleClickOnCancelBtn = () => {
    router.push("/");
  };

  async function onSubmit(values: z.infer<typeof postFormSchema>) {
    console.log("statring", action);
    setIsPostUploading(true);
    if (post && action === "Update") {
      // const updatedPost = await updatePost({ ...values, file: post.file, _id: post._id });
      // if (!updatedPost) {
      //   ToastError({ msg: "Please try again" });
      // }
      // return navigate(`/posts/${post._id}`);
    }
    const { file } = values;
    try {
      if (file.length === 0) {
        toast({
          title: "Please add an image",
        });
        setIsPostUploading(false);
        return;
      }
      const imageRef = ref(storage, `/images/${file[0]}-${v4()}`);
      const snapshot = await uploadBytes(imageRef, file[0]);
      const url = await getDownloadURL(snapshot.ref);
      const updatedPayload = { ...values, file: url };
      console.log("outside");

      console.log("running");
      await createPost({ ...updatedPayload });
      router.push("/");
    } catch (error) {
      // ToastError({ msg: "Please try again" });
      console.log({ error });
      // toast({
      //   title: error,
      // });

      setIsPostUploading(false);
    }
    setIsPostUploading(false);
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
              disabled={isPostUploading}
              onClick={handleClickOnCancelBtn}
              //   disabled={isCreatingPost || isLoadingUpdate || isDeletingPost || isPostUploading}
            >
              Cancel
            </Button>
          )}

          {isPostUploading ? (
            <Button className="shad-button_primary whitespace-nowrap">
              <Loader />
            </Button>
          ) : (
            <Button type="submit" className="shad-button_primary whitespace-nowrap">
              {action === "Update" ? "Update" : "Upload"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

export default PostForm;
