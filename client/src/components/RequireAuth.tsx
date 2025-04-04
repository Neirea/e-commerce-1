import type { JSX } from "react";
import Container from "react-bootstrap/Container";
import { Navigate, Outlet, useLocation } from "react-router";
import useCurrentUser from "../hooks/useCurrentUser";
import type { TRole } from "../types/User";

const RequireAuth = ({
    allowedRoles,
}: {
    allowedRoles: TRole[];
}): JSX.Element => {
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
