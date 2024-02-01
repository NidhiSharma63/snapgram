import PostForm from "@/components/form/PostForm";
import { useTheme } from "@/context/themeProviders";

export default function CreatePost() {
  const { theme } = useTheme();
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src={theme === "dark" ? "/assets/icons/add-post.svg" : "/assets/icons/add-post-light.svg"}
            alt="add"
            height={36}
            width={36}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
        </div>
        <PostForm action="Create" />
      </div>
    </div>
  );
}
