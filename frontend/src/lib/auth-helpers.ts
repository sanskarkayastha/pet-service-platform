export type AuthUser = {
  id?: string;
  role?: string;
  name?: string;
  email?: string;
};

export function extractAuthUser(sessionResult: unknown): AuthUser | null {
  if (!sessionResult || typeof sessionResult !== "object") {
    return null;
  }

  const candidate = sessionResult as { user?: unknown; data?: unknown };

  if (candidate.user && typeof candidate.user === "object") {
    return candidate.user as AuthUser;
  }

  if (candidate.data && typeof candidate.data === "object") {
    const inner = candidate.data as { user?: unknown };
    if (inner.user && typeof inner.user === "object") {
      return inner.user as AuthUser;
    }
  }

  return null;
}

export function extractAuthToken(result: unknown): string | null {
  if (!result) {
    return null;
  }

  if (typeof result === "string") {
    return result;
  }

  if (typeof result === "object") {
    const obj = result as { token?: unknown; data?: unknown };
    if (typeof obj.token === "string") {
      return obj.token;
    }
    if (obj.data && typeof obj.data === "object") {
      const inner = obj.data as { token?: unknown };
      if (typeof inner.token === "string") {
        return inner.token;
      }
    }
  }

  return null;
}
