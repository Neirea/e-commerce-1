import { useState, useEffect } from "react";
import LoadingBar from "react-top-loading-bar";

const LoadingProgress = ({ isLoading }: { isLoading: boolean }) => {
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        let timeoutId: number;

        if (isLoading) {
            timeoutId = setTimeout(() => {
                setShowLoading(true);
            }, 250);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [isLoading]);

    return (
        <div>
            {showLoading && (
                <LoadingBar
                    color={"#7da740"}
                    progress={isLoading ? 80 : 100}
                    transitionTime={250}
                    waitingTime={250}
                />
            )}
        </div>
    );
};

export default LoadingProgress;
