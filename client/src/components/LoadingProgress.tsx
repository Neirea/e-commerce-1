import { useState, useEffect, type JSX } from "react";
import LoadingBar from "react-top-loading-bar";

const LoadingProgress = ({
    isLoading,
}: {
    isLoading: boolean;
}): JSX.Element => {
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        let timeoutId: number;

        if (isLoading) {
            timeoutId = setTimeout(() => {
                setShowLoading(true);
            }, 250);
        }

        return (): void => {
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
