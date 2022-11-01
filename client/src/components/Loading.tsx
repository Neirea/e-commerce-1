const Loading = () => {
    return (
        <div className="loading d-flex flex-column justify-content-center align-items-center">
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default Loading;
