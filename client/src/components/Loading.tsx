import React from "react";
const Loading = ({ size = 4 }: { size?: number }) => {
    return (
        <div
            style={{ "--loading-scale": size } as React.CSSProperties}
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

export default Loading;
