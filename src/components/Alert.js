import React from "react";

export default function Alert(props) {
    const setWidth = {
        maxWidth: "300px",
        marginTop: "60px",
    };
    return (
        props.alert && (
            <div className="container fixed-top text-center" style={setWidth}>
                <div
                    className={`alert alert-${props.alert.type}  fade show`}
                    role="alert"
                >
                    {props.alert.message}
                </div>
            </div>
        )
    );
}
