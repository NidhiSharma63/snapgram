import FileUploader from "@/components/shared/FileUploader";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AppConstants } from "@/constant/keys";
import { updateProfileSchema } from "@/constant/validation";
import { useUserDetail } from "@/context/userContext";
import { storage } from "@/firebase/config";
import useAuth from "@/hooks/query/useAuth";
import { setValueToLS } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { v4 } from "uuid";
import * as z from "zod";

function UpdateProfile() {
  const { id } = useParams();
  const { useGetUserById, useUpdateUser } = useAuth();
  const { data: post } = useGetUserById(id || "");
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useUpdateUser();
  const { toast } = useToast();
  const { setUserDetail } = useUserDetail();

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      bio: post ? post.bio : "",
      username: post ? post.username : "",
      file: [],
    },
  });
  async function onSubmit(values: z.infer<typeof updateProfileSchema>) {
    try {
      const { file } = values;
      const imageRef = ref(storage, `/images/${file[0]}-${v4()}`);
      const snapshot = await uploadBytes(imageRef, file[0]);
      const url = await getDownloadURL(snapshot.ref);
      const updatedPayload = { ...values, file: url };
      const updatedUser = await mutateAsync({ ...updatedPayload });
      //   const storageRef = ref(storage, post.avatar.startsWith("/") ? post.file.slice(1) : post.file);
      const storageRefToDelete = ref(storage, post.avatar);
      await deleteObject(storageRefToDelete);
      navigate(`/profile/:${post._id}`);
      setValueToLS(AppConstants.USER_DETAILS, JSON.stringify(updatedUser));
      setUserDetail(updatedUser);
    } catch (error) {
      console.log(error);
      toast({ title: "Please try again" });
    }
    // const newPost = await createPost({ ...updatedPayload });
  }

  const handleCancel = () => {
    navigate("/");
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
                      mediaUrl={post ? post?.avatar : ""}
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
              <Button type="submit" className="shad-button_primary whitespace-nowrap" onClick={handleCancel}>
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
