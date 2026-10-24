"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getErrorMessage, getFieldErrors } from "@/lib/api";
import { registerSchema, type RegisterValues } from "@/lib/validators";
import { useAuthStore } from "@/store/authStore";
import { AuthCard } from "./AuthCard";

const FIELDS = ["name", "email", "password", "confirmPassword"] as const;

export function RegisterForm() {
  const registerUser = useAuthStore((state) => state.register);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: RegisterValues) => {
    try {
      const user = await registerUser(values);
      toast.success(`Welcome, ${user.name.split(" ")[0]}! Your account is ready.`);
    } catch (error) {
      for (const { field, message } of getFieldErrors(error)) {
        if ((FIELDS as readonly string[]).includes(field)) setError(field as (typeof FIELDS)[number], { message });
      }
      toast.error(getErrorMessage(error, "Could not create your account."));
    }
  };

  return (
    <AuthCard
      title="Create your account"
      description="Start building a resume that gets you hired."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input label="Full name" autoComplete="name" placeholder="Jane Doe" error={errors.name?.message} {...register("name")} />
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          hint="Use 8+ characters with at least one letter and one number."
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button type="submit" size="lg" loading={isSubmitting} className="mt-2 w-full">
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
