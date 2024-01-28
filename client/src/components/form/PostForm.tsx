import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { useAuthContext } from "@/context/AuthContext";
// import { useCreatePost, useUpdatePost } from "@/lib/react-query/queryAndMutations";
import FileUploader from "@/components/shared/FileUploader";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface IPostFormProps {
  post?: IPost;
  action: "Create" | "Update";
}

export default function PostForm({ post, action }: IPostFormProps) {
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
              disabled={
                isCreatingPost ||
                isLoadingUpdate ||
                isDeletingPost ||
                isRemovingPostFromSaveCollection ||
                isRemovingPostFromLikeCollection
              }
              onClick={handleDeletePost}>
              Delete
            </Button>
          ) : (
            <Button
              type="button"
              className="shad-button_dark_4"
              disabled={isCreatingPost || isLoadingUpdate || isDeletingPost || isPostUploading}>
              Cancel
            </Button>
          )}
          {isCreatingPost ||
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
          )}
        </div>
      </form>
    </Form>
  );
}
