"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === "sign-in"
        ? z.string().min(1, "Name is required")
        : z.string().optional(),
    email: z.string().email("Email is invalid"),
    password: z.string().min(8, "Password is required"),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-in") {
        toast.success("Sign in successful!");
        router.push("/");
      } else {
        {
          toast.success("Sign up successful! Sign in to continue.");
          router.push("/sign-in");
        }
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Error signing in. Please try again.");
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <h1 className="text-4xl font-bold text-center">Welcome to InterPrep</h1>
        <h3 className="font-medium">
          Practise your interviews right in your browser
        </h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {isSignIn && (
              <FormField
                name="name"
                control={form.control}
                label="Name"
                placeholder="Your Name"
              />
            )}
            <FormField
              name="email"
              control={form.control}
              label="Email"
              placeholder="Your email address"
              type="email"
            />
            <FormField
              name="password"
              control={form.control}
              label="Password"
              placeholder="Your password"
              type="password"
            />
            <Button className="btn" type="submit">
              {isSignIn ? "Sign In" : "Create new account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "No account yet? " : "Alread have an account? "}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="text-primary font-bold ml-1"
          >
            {isSignIn ? "sign-up" : "sign-in"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
