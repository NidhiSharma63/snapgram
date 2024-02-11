"use client";

import { Button } from "@/src/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { useToast } from "@/src/components/ui/use-toast";
import { signInFormSchema } from "@/src/constant/validation";
import { login } from "@/src/server/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

function Page() {
  const { toast } = useToast();
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  // const [error, setError] = useState(true);

  const handleClick = () => {
    setPasswordVisible((prev: boolean) => !prev);
  };
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
      uniqueBrowserId: uuidv4(),
    },
  });

  const onSubmit = async (values: z.infer<typeof signInFormSchema>) => {
    setIsPending(true);
    const { error } = await login(values);
    if (error) {
      toast({
        title: error,
      });
    }
    setIsPending(false);
  };

  return (
    <div className="w-full h-full border flex justify-between">
      <div className="flex border flex-1 justify-center items-center flex-col h-screen">
        {/* <img src={theme === "dark" ? "/assets/images/logo.svg" : "/assets/images/logo-light.svg"} /> */}
        <p className="text-3xl font-bold md:h2-bold pt-3 sm:pt-8">Login to your Account</p>
        <p className=" text-light-3 font-medium mt-2 mb-7 text-center">
          Welcome back, Please enter your account details
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
                    <Input type={passwordVisible ? "text" : "password"} placeholder="Enter your password" {...field} />
                  </FormControl>
                  <div className="absolute top-[35px] right-[7px] cursor-pointer" onClick={handleClick}>
                    {passwordVisible ? (
                      <img src="/assets/icons/open-eye.svg" alt="eye" className="w-4 relative" />
                    ) : (
                      <img src="/assets/icons/close-eye.svg" alt="eye" className="w-4 relative" />
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {isPending ? <img src="/assets/icons/loader.svg" className="w-6" /> : "submit"}
            </Button>
          </form>
        </Form>
        <p className="text-small-regualr text-ligh-2 text-center mt-8">
          Don't have Account ?
          <Link href="/sign-up" className="text-primary-500 text-small-semibold ml-1">
            Sign up
          </Link>
        </p>
      </div>
      <img src="/assets/images/side-img.svg" alt="banner" className="hidden lg:block h-screen w-1/2 object-cover" />
    </div>
  );
}

export default Page;
