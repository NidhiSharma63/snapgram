"use client";

import Loader from "@/src/components/shared/Loader";
import FileUploader from "@/src/components/shared/fileUploader";
import { Button } from "@/src/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { storage } from "@/src/constant/firebase/config";
import { postFormSchema } from "@/src/constant/validation";
import { createPost, deletePost, updatePost } from "@/src/server/post";
import { PostFormProps } from "@/src/types/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import * as z from "zod";
import { useToast } from "../ui/use-toast";

function PostForm({ post, action, userDetails }: PostFormProps) {
  const router = useRouter();
  const [isPostUploading, setIsPostUploading] = useState(false);
  const [isPostDeleting, setIsPostDeleting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      caption: post ? post?.caption[0] : "",
      file: [],
      location: post ? post?.location[0] : "",
      tags: post ? post?.tags[0] : "",
      userId: userDetails && userDetails._id,
      userAvatar: userDetails && userDetails.avatar,
      createdAt: post ? new Date(post.createdAt) : new Date(),
    },
  });

  const handleClickOnCancelBtn = () => {
    router.push("/");
  };

  async function onSubmit(values: z.infer<typeof postFormSchema>) {
    setIsPostUploading(true);

    const { file } = values;
    try {
      if (action === "Update") {
        if (post?._id) {
          const { tags, location, caption } = values;
          const { post: updatedPost } = await updatePost({ _id: post?._id, tags, location, caption });
          if (updatedPost) {
            router.push("/");
          }
        }
      } else {
        if (file.length === 0) {
          toast({
            title: "Please add an image",
          });
          setIsPostUploading(false);
          return;
        }
        const imageRef = ref(storage, `/images/${file[0]?.name}-${v4()}`);
        const snapshot = await uploadBytes(imageRef, file[0]);
        const url = await getDownloadURL(snapshot.ref);
        const updatedPayload = { ...values, file: url };
        const { post } = await createPost({ ...updatedPayload });
        if (post) {
          router.push("/");
        }
      }
    } catch (error) {
      toast({
        title: error.message,
      });
      setIsPostUploading(false);
    }
    setIsPostUploading(false);
  }

  const handleDeletePost = async () => {
    if (post && post?._id) {
      const storageRef = ref(storage, post.file);
      try {
        setIsPostDeleting(true);
        await deleteObject(storageRef);
        await deletePost({ _id: post._id });
        // if (savePosts?.[0]?.postId.includes(post._id)) {
        //   await removePostFromSave({ postId: post._id, userId: userDetails?._id });
        // }
        // if (likePosts?.[0]?.postId.includes(post._id)) {
        //   await removePostFromLike({ postId: post._id, userId: userDetails?._id });
        // }
        // navigate("/");
        router.push("/");
      } catch (error) {
        toast({ title: error.message });
        setIsPostDeleting(false);
      }
      setIsPostDeleting(false);
    }
  };
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
        {action === "Update" ? (
          <Image
            width={500}
            height={500}
            src={post?.file || ""}
            alt="Image"
            className="post-card_img bg-off-white py-5"
          />
        ) : (
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Add Photos</FormLabel>
                <FormControl>
                  <FileUploader fieldChange={field.onChange} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
        )}
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
            <Button type="button" className="shad-btn-delete" disabled={isPostDeleting} onClick={handleDeletePost}>
              {isPostDeleting ? <Loader /> : "Delete"}
            </Button>
          ) : (
            <Button
              type="button"
              className="shad-button_dark_4"
              disabled={isPostUploading || isPostDeleting}
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
            <Button type="submit" disabled={isPostDeleting} className="shad-button_primary whitespace-nowrap">
              {action === "Update" ? "Update" : "Upload"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

export default PostForm;

// if (error) {
//   toast({
//     title: error,
//   });
// }
// console.log({ error }, "upper wala part");
