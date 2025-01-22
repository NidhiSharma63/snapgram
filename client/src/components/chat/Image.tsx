import { Skeleton } from "@/components/ui/skeleton";
import { useCallback, useState } from "react";

export default function ImageComponent({ src }: { src: string }) {
	const [isImageLoaded, setIsImageLoaded] = useState(false);
	const [showBackdrop, setShowBackdrop] = useState(false);
	const handleImageLoad = useCallback(() => {
		setIsImageLoaded(true);
	}, []);

	const handleClickOnBackDrop = useCallback(() => {
		console.log("clicked");
		setShowBackdrop((prev) => !prev);
	}, []);

	return (
		<div className="relative">
			{/* Skeleton jab tak image load nahi hoti */}
			{!isImageLoaded && (
				<Skeleton className="lg:w-[500px] w-[200px] h-[200px] lg:h-[500px] inset-0" />
			)}

			{showBackdrop && (
				<div className="backDrop lg:flex hidden">
					<img
						src={src}
						alt="photo sent by user"
						className="lg:max-w-[600px] max-w-[200px] max-h-[200px] lg:max-h-[600px] object-cover rounded-md m-auto z-10 lg:block hidden"
					/>
					<div
						onClick={handleClickOnBackDrop}
						className="w-full h-full lg:block hidden z-[1] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-950/50"
					/>
				</div>
			)}
			<img
				onLoad={handleImageLoad}
				onError={handleImageLoad}
				onClick={handleClickOnBackDrop}
				data-id={src}
				src={src}
				loading="lazy"
				alt="image sent by user"
				className={`lg:max-w-[500px] max-w-[200px] max-h-[200px] lg:max-h-[500px] object-cover rounded-md transition-opacity duration-300 ${
					isImageLoaded ? "opacity-100" : "opacity-0"
				}`}
			/>
		</div>
	);
}