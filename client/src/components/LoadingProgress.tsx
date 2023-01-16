import LoadingBar from "react-top-loading-bar";

const LoadingProgress = ({ isLoading }: { isLoading: boolean }) => {
    return (
        <LoadingBar
            color={"#7da740"}
            progress={isLoading ? 80 : 100}
            transitionTime={250}
            waitingTime={250}
        />
    );
};

export default LoadingProgress;
