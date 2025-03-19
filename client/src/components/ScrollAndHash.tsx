import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export default (): null => {
    const { pathname, search, hash } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    //remove facebook trailing hash
    useEffect(() => {
        if (hash === "#_=_") {
            void navigate(pathname + "?" + search, { replace: true });
        }
    }, [hash]);

    return null;
};
