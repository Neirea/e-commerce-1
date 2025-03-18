const LoadingSpinner = ({ size }: { size: number }): JSX.Element => {
    return (
        <div
            style={{ height: size, width: size }}
            className="loading d-flex flex-column justify-content-center align-items-center"
        >
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
