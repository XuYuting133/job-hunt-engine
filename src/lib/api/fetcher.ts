import { createClient } from "@/lib/supabase/client";
import { ApiError } from "@/types";

const BASE_URL = "/api";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: "Network error" }));
    throw new ApiError(response.status, body.error || "Request failed");
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
