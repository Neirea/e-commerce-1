import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollAndHash() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    //remove facebook trailing hash
    useEffect(() => {
        if (window.location.hash === "#_=_") {
            history.replaceState
                ? history.replaceState(
                      null,
                      "",
                      window.location.href.split("#")[0]
                  )
                : (window.location.hash = "");
        }
    }, [window.location.hash]);

    return null;
}
