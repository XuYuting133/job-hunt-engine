"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { login, signup, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password, fullName);
      }
      router.push("/");
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
      </div>

      {displayError && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
          {displayError}
        </p>
      )}

      <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {mode === "login" ? "Logging in..." : "Creating account..."}
          </>
        ) : mode === "login" ? (
          "Log In"
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
