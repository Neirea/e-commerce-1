import { Navigate, Outlet, useLocation } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";
import { Role } from "../generated/graphql";

const RequireAuth = ({ allowedRoles }: { allowedRoles: Role[] }) => {
    const { user } = useCurrentUser();
    const location = useLocation();

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
