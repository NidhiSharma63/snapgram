"use client";

import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { useToast } from "@/src/components/ui/use-toast";
import { signUpFormSchema } from "@/src/constant/validation";
import { registerUser } from "@/src/server/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import type { z } from "zod";

function Page() {
	const { toast } = useToast();
	const router = useRouter();
	const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
	const [isPending, setIsPending] = useState<boolean>(false);
	// const [error, setError] = useState(true);

	const handleClick = () => {
		setPasswordVisible((prev: boolean) => !prev);
	};

	const form = useForm<z.infer<typeof signUpFormSchema>>({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			avatar: null,
			uniqueBrowserId: uuidv4(),
			bio: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
		setIsPending(true);
		const { error } = await registerUser(values);
		if (error) {
			toast({
				title: error,
			});
			setIsPending(false);
			return;
		}
		router.push("/");
		setIsPending(false);
	};

	return (
		<div className="w-full h-full border flex justify-between">
			<div className="flex border flex-1 justify-center items-center flex-col h-screen">
				{/* <img src={theme === "dark" ? "/assets/images/logo.svg" : "/assets/images/logo-light.svg"} /> */}
				<p className="text-3xl font-bold md:h2-bold pt-3 sm:pt-2">
					Create New Account
				</p>
				<p className=" text-light-3 font-medium mt-2 mb-2 text-center">
					Please enter your account details
          <br/>
          <strong>
          Recruiter ho? Login page pe pre-filled creds se login karo!
          </strong>
				</p>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem className="form-field">
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											className="shad-input"
											placeholder="userName"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem className="form-field">
									<FormLabel>Bio</FormLabel>
									<FormControl>
										<Textarea
											className="resize-none"
											placeholder="Bio..."
											{...field}
										></Textarea>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="form-field">
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											className="shad-input"
											placeholder="Your Email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="form-field relative">
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type={passwordVisible ? "text" : "password"}
											className="shad-input"
											placeholder="Your Password"
											{...field}
										/>
									</FormControl>
									<div
										className="absolute top-[35px] right-[7px] cursor-pointer"
										onClick={handleClick}
									>
										{passwordVisible ? (
											<img
												src="/assets/icons/open-eye.svg"
												alt="eye"
												className="w-4 relative"
											/>
										) : (
											<img
												src="/assets/icons/close-eye.svg"
												alt="eye"
												className="w-4 relative"
											/>
										)}
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="form-field">
							{isPending ? (
								<img src="/assets/icons/loader.svg" className="w-6" />
							) : (
								"submit"
							)}
						</Button>
					</form>
				</Form>
				<p className="text-small-regualr text-ligh-2 text-center mt-2">
					Already have Account ?
					<Link
						href="/login"
						className="text-primary-500 text-small-semibold ml-1"
					>
						login
					</Link>
				</p>
			</div>
			<img
				src="/assets/images/side-img.svg"
				alt="banner"
				className="hidden lg:block h-screen w-1/2 object-cover"
			/>
		</div>
	);
}

export default Page;
