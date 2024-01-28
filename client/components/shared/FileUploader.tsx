import { Input } from "@/components/ui/input";
import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

type fileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
  isComponentUserInProfilePage?: boolean;
};

export default function FileUploader({
  fieldChange,
  mediaUrl,
  isComponentUserInProfilePage = false,
}: fileUploaderProps) {
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  // const [file, setFile] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      // setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [fieldChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".svg"],
    },
  });
  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col rounded-xl cursor-pointer dark:bg-dark-3 bg-off-white">
      <Input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img src={fileUrl || mediaUrl} alt="image" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img src="/assets/icons/file-upload.svg" width={96} height={77} alt="file upload" />
          <h3 className="base-medium dark:text-light-2 mb-2 mt-6">
            {isComponentUserInProfilePage ? "Upload Profile photo" : "Drag photo here"}
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>
          <div className="bg-[#0F172A] text-white px-3 py-3 rounded">Select from Compouter</div>
        </div>
      )}
    </div>
  );
}
