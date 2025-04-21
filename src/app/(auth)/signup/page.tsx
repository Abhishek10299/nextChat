"use client";
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

import { signUpSchema } from "@/schema/signUpSchema";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

import Link from "next/link";
import { LucideLoader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
    try {
      const responce = await axios.post<ApiResponse>("/api/sign-up", data);
      toast.success(responce.data.message);
      router.replace("/signin");
      setIsLoading(false);
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 border bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join NextChat
          </h1>
          <p className="mb-4">START CHATING</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="elevated" disabled={isLoading}>
              {isLoading ? (
                <>
                  {" "}
                  <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                  wait
                </>
              ) : (
                "Sign up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member?{" "}
            <Link href="/signin" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
