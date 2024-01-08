import * as z from "zod";
import { passwordRegex } from "./regex";

export const signInFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1, { message: "Password require" }),
	uniqueBrowserId: z.string(),
});

export const signUpFormSchema = z.object({
	username: z
		.string()
		.min(2, { message: "Username must be 2 character long" })
		.max(20, { message: "Username should not be 20 character long" }),
	email: z.string().email(),
	password: z
		.string()
		.min(8, { message: "Password must be 8 character long" })
		.regex(passwordRegex, "Pasword must contains special characters"),
	avatar: z.string(),
	uniqueBrowserId: z.string(),
	bio: z.string(),
});

export const postFormSchema = z.object({
	caption: z.string().min(5, { message: "Caption is too short" }).max(2100, { message: "Caption is too long" }),
	tags: z.string(),
	file: z.custom<File[]>(),
	location: z.string().min(0).max(100),
	userId: z.string().nullable(),
	createdAt: z.date(),
});

export const updateProfileSchema = z.object({
	bio: z.string(),
	username: z.string(),
	file: z.custom<File[]>(),
});
