import { Navigate, useLocation } from 'react-router-dom';
import { useRoles } from '@/auth/useRoles';
import type { Role } from '@/auth/roles';

interface RoleProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: Role[];
    redirectTo?: string;
}

/**
 * Route guard that checks Keycloak realm roles in addition to authentication.
 * Must be nested inside ProtectedRoute (which handles the auth check).
 */
export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
    children,
    allowedRoles,
    redirectTo = '/unauthorized',
}) => {
    const { hasAnyRole } = useRoles();
    const location = useLocation();

    if (!hasAnyRole(...allowedRoles)) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
