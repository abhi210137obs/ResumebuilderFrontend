"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getErrorMessage, getFieldErrors } from "@/lib/api";
import { loginSchema, type LoginValues } from "@/lib/validators";
import { useAuthStore } from "@/store/authStore";
import { AuthCard } from "./AuthCard";

export function LoginForm() {
  const login = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  const onSubmit = async (values: LoginValues) => {
    try {
      const user = await login(values);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
    } catch (error) {
      for (const { field, message } of getFieldErrors(error)) {
        if (field === "email" || field === "password") setError(field, { message });
      }
      toast.error(getErrorMessage(error, "Could not log in."));
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Log in to continue building your resume."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" size="lg" loading={isSubmitting} className="mt-2 w-full">
          Log in
        </Button>
      </form>
    </AuthCard>
  );
}
