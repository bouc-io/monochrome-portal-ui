import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./authcontext";
import { ROLES, type Role } from "./roles";

interface JwtPayload {
  realm_access?: { roles?: string[] };
  [key: string]: unknown;
}

/**
 * Hook that reads Keycloak realm roles from the access token.
 * Reading directly from authTokens.access is adapter-independent and
 * always up-to-date after a token refresh.
 */
export function useRoles() {
  const { authTokens } = useAuth();

  const roles = useMemo<string[]>(() => {
    if (!authTokens?.access) return [];
    try {
      return jwtDecode<JwtPayload>(authTokens.access).realm_access?.roles ?? [];
    } catch {
      return [];
    }
  }, [authTokens?.access]);

  const hasRole = (role: Role): boolean => roles.includes(role);

  const hasAnyRole = (...allowedRoles: Role[]): boolean =>
    allowedRoles.some((r) => roles.includes(r));

  return { roles, hasRole, hasAnyRole };
}

export { ROLES };
