import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInFormSchema } from "@/constant/validation";
import { useTheme } from "@/context/themeProviders";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

function SignInForm() {
  const { setTheme } = useTheme();

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof signInFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="w-full h-full border border-cyan-600 flex justify-between">
      {/* <p onClick={() => setTheme("light")}>chneg to light</p>
      <p onClick={() => setTheme("dark")}>chnage to drak</p> */}
      {/* <div>Text</div> */}

      <div className="flex border flex-1 justify-center items-center flex-col">
        <img src="/assets/images/logo.svg" />
        <p className="prose-xl bold md:h2-bold pt-3 sm:pt-8">Login to your Account</p>
        <p className="text-light-3 small-medium md:base-regular mt-2">
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
                    <Input placeholder="Enter you email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter you password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
      <img src="/assets/images/side-img.svg" alt="banner" className="hidden lg:block h-screen w-1/2 object-cover" />
    </div>
  );
}

export default SignInForm;
