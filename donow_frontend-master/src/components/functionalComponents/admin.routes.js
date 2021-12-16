import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
const AdminRoute = ({ component: Component, auth, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
            if (auth.loading) {
                return (
                    <div className="container-fluid text-center vh-100">
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                marginTop: "-50px",
                                left: "50%",
                                marginLeft: "-50px",
                            }}
                        >
                            <Loader type="Puff" color="#cd3333" height={100} width={100} />
                        </div>
                    </div>
                );
            } else if (!auth.loggedIn || auth.user_status !== "admin") {
                return <Redirect to="/admin-login" />;
            } else {
                return <Component {...props} />;
            }
        }}
    />
);
const mapStateToProps = (state) => {
    return {
        auth: state.authReducer,
    };
};

export default connect(mapStateToProps, null)(AdminRoute);
