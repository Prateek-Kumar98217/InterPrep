"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import FormField from "./FormField";
import { useRouter } from "next/navigation";

const AuthFormSchema = (type: FormType) => {
  return z.object({
    username:
      type === "sign-in" ? z.string().min(3).max(30) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8).max(20),
  });
};

export function AuthForm({ type }: { type: "sign-in" | "sign-up" }) {
  const formSchema = AuthFormSchema(type);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-in") {
        toast.success("Signed in successfully!");
        router.push("/");
      } else {
        toast.success("Account created successfully! Please sign in.");
        router.push("/sign-in");
      }
      console.log(values);
    } catch (error) {
      console.log(error);
      toast.error("There was and error");
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 py-14 px-10 items-center card">
        <div className="flex flex-row items-center justify-center space-x-2 mb-4">
          <Image src="/logo.svg" alt="Logo" width={38} height={32} />
          <h2>InterPrep</h2>
        </div>
        <h3>Practise job interviews with AI</h3>
        {isSignIn ? (
          <h2 className="text-2xl font-bold">Sign In</h2>
        ) : (
          <h2 className="text-2xl font-bold">Sign Up</h2>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 form mt-4 w-full"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="username"
                label="Username"
                placeholder="Enter your username"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Enter your email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Button type="submit" className="btn">
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <p>
          {isSignIn ? "No account yet? " : "Already have an account? "}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-bold text-user-primary ml-1"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;
