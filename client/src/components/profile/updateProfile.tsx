"use client";

import Loader from "@/src/components/shared/Loader";
import FileUploader from "@/src/components/shared/fileUploader";
import { Button } from "@/src/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { storage } from "@/src/constant/firebase/config";
import { updateProfileSchema } from "@/src/constant/validation";
import { updateProfile } from "@/src/server/user";
import { User } from "@/src/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import * as z from "zod";
import { useToast } from "../ui/use-toast";

function UpdateProfile({ user }: { user: User }) {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      bio: user ? user.bio : "",
      username: user ? user.username : "",
      file: [],
    },
  });

  const handleCancel = () => {
    router.back();
  };

  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    try {
      setIsPending(true);
      const { file } = values;
      const imageRef = ref(storage, `/images/${file[0].name}-${v4()}`);
      const snapshot = await uploadBytes(imageRef, file[0]);
      const url = await getDownloadURL(snapshot.ref);
      const updatedPayload = { ...values, file: url, userId: user._id };
      //   const storageRef = ref(storage, post.avatar.startsWith("/") ? post.file.slice(1) : post.file);
      if (user.avatar) {
        const storageRefToDelete = ref(storage, user.avatar);
        await deleteObject(storageRefToDelete);
      }
      await updateProfile(updatedPayload);
      setIsPending(false);
      router.push(`/profile/${user._id}`);
    } catch (error) {
      setIsPending(false);
      const e = error instanceof Error ? error : new Error("Something went wrong");
      toast({
        title: e.message,
      });
    }
  };
  return (
    <div className="flex flex-1 ">
      <div className="common-container">
        <h2 className="h3-bold md:h2-bold text-left w-full dark:text-white">Update Profile</h2>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Prevent default form submission
              form.handleSubmit(onSubmit)(e); // Manually trigger your custom onSubmit
            }}
            className="flex flex-col gap-9 w-full max-w-5xl">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Upload profile photo</FormLabel>
                  <FormControl>
                    <FileUploader
                      fieldChange={field.onChange}
                      mediaUrl={user ? user?.avatar : ""}
                      isComponentUserInProfilePage={true}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">UserName</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Bio</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <div className="flex gap-4 items-center justify-end">
              <Button
                disabled={isPending}
                type="submit"
                className="shad-button_primary whitespace-nowrap"
                onClick={handleCancel}>
                Cancel
              </Button>
              {isPending ? (
                <Button className="shad-button_primary whitespace-nowrap">
                  <Loader />
                </Button>
              ) : (
                <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isPending}>
                  Update
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default UpdateProfile;
