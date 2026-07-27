"use client";

import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { Briefcase } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
            <Briefcase className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Job Hunt Engine
          </h1>
          <p className="text-sm text-muted-foreground">
            Log in to manage your career and job hunt
          </p>
        </div>

        <AuthForm mode="login" />

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
