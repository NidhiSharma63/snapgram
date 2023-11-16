import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInFormSchema, signUpFormSchema } from "@/constant/validation";
import { useTheme } from "@/context/themeProviders";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

function SignUpForm() {
  const { setTheme, theme } = useTheme();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
  });

  const handleClick = () => {
    setPasswordVisible((prev: boolean) => !prev);
  };

  function onSubmit(values: z.infer<typeof signInFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="w-full h-full border flex justify-between">
      {/* <p onClick={() => setTheme("light")}>chneg to light</p>
      <p onClick={() => setTheme("dark")}>chnage to drak</p> */}
      {/* <div>Text</div> */}

      <div className="flex border flex-1 justify-center items-center flex-col h-screen">
        <img src={theme === "dark" ? "/assets/images/logo.svg" : "/assets/images/logo-light.svg"} />
        <p className="text-3xl font-bold md:h2-bold pt-3 sm:pt-2">Create New Account</p>
        <p className=" text-light-3 font-medium mt-2 mb-2 ">To use snapgram, Please enter your account details</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="form-field">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input className="shad-input" placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="form-field">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input className="shad-input" placeholder="userName" {...field} />
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
                    <Input type="email" className="shad-input" placeholder="Your Email" {...field} />
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
            <Button type="submit" className="form-field">
              Submit
            </Button>
          </form>
        </Form>
        <p className="text-small-regualr text-ligh-2 text-center mt-2">
          Already have Account ?
          <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">
            Sign In
          </Link>
        </p>
      </div>
      <img src="/assets/images/side-img.svg" alt="banner" className="hidden lg:block h-screen w-1/2 object-cover" />
    </div>
  );
}

export default SignUpForm;
