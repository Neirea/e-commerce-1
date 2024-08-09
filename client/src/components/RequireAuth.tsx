import { Navigate, Outlet, useLocation } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";
import type { TRole } from "../types/User";
import Container from "react-bootstrap/Container";

const RequireAuth = ({ allowedRoles }: { allowedRoles: TRole[] }) => {
    const { user, isLoading } = useCurrentUser();
    const location = useLocation();

    if (isLoading) {
        return <Container as="main" />;
    }

    if (user) {
        if (allowedRoles.some((role) => user.role.includes(role))) {
            return <Outlet />;
        }
        return (
            <Navigate to="/unauthorized" state={{ from: location }} replace />
        );
    }

    return <Navigate to="/" state={{ from: location }} replace />;
};

export default RequireAuth;
