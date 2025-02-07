import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AppConstants } from "@/constant/keys";
import { signInFormSchema } from "@/constant/validation";
import { useTheme } from "@/context/themeProviders";
import { useUserDetail } from "@/context/userContext";
import useAuth from "@/hooks/query/useAuth";
import { getValueFromLS, setValueToLS } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import type { z } from "zod";

function SignInForm() {
	const { theme } = useTheme();
	const { setUserDetail } = useUserDetail();
	const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
	const { useSignIn } = useAuth();
	const { mutate, isSuccess, data, isPending } = useSignIn();
	const navigate = useNavigate();
	const form = useForm<z.infer<typeof signInFormSchema>>({
		resolver: zodResolver(signInFormSchema),
		defaultValues: {
			email: "",
			password: "",
			uniqueBrowserId: uuidv4(),
		},
	});

	const handleClick = () => {
		setPasswordVisible((prev: boolean) => !prev);
	};

	function onSubmit(values: z.infer<typeof signInFormSchema>) {
		mutate(values);
	}

	const handleGetCreds = () => {
		form.setValue("email", "john@gmail.com");
		form.setValue("password", "john@123");
	};

	/**
	 * redirect the user to home page after successfull login
	 */
	useEffect(() => {
		if (!isSuccess) {
			return;
		}
		setValueToLS(AppConstants.USER_DETAILS, JSON.stringify(data));
		setUserDetail(data);
		// console.log(data, "data");
		navigate("/", { replace: true });
	}, [isSuccess, navigate, data, setUserDetail]);

	/**
	 * if already token present then move user to home page
	 */
	useEffect(() => {
		const storedValue = getValueFromLS(AppConstants.USER_DETAILS);
		if (!storedValue) {
			return;
		}
		const parsedValue = JSON.parse(storedValue);
		const isAuthenticated = parsedValue?.tokens?.[0].token;
		if (isAuthenticated) {
			navigate("/", { replace: true });
		}
	}, [navigate]);

	return (
		<div className="w-full h-full border flex justify-between">
			<div className="flex border flex-1 justify-center items-center flex-col h-screen">
				<img
					src={
						theme === "dark"
							? "/assets/images/logo.svg"
							: "/assets/images/logo-light.svg"
					}
				/>
				<p className="text-3xl font-bold md:h2-bold pt-3 sm:pt-8">
					Login to your Account
				</p>
				<p className=" text-light-3 font-medium mt-2 mb-7 text-center">
					Please enter your account details
				</p>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="Enter your email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="relative">
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type={passwordVisible ? "text" : "password"}
											placeholder="Enter your password"
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
						<Button type="submit">
							{isPending ? (
								<img
									alt="loader"
									src="/assets/icons/loader.svg"
									className="w-6"
								/>
							) : (
								"submit"
							)}
						</Button>
						{!isPending && (
							<Button className="ml-3" type="button" onClick={handleGetCreds}>
								Get Creds
							</Button>
						)}
					</form>
				</Form>
				<p className="text-small-regualr text-ligh-2 text-center mt-8">
					Don't have Account ?
					<Link
						to="/sign-up"
						className="text-primary-500 text-small-semibold ml-1"
					>
						Sign up
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

export default SignInForm;
