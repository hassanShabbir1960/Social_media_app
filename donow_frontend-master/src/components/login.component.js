import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../store/actions/auth";
import "../css/pink-checkbox.css";
import HeaderComponent from "./header.component";
import Loader from "react-loader-spinner";

class LoginComponent extends Component {
  state = {
    data: {
      username: "",
      password: "",
      rememberme: false,
    },
    loading: false,
    errors: {},
  };

  onChange = (e) => {
    if (e.target.type === "checkbox") {
      this.setState({
        data: { ...this.state.data, [e.target.name]: e.target.checked },
      });
    } else {
      this.setState({
        data: { ...this.state.data, [e.target.name]: e.target.value },
      });
    }
  };

  onSubmit = (e) => {
    const { data } = this.state;
    e.preventDefault();
    e.stopPropagation();
    for (var field of e.target) {
      field.classList.remove("is-invalid");
    }
    const errors = this.validate(data);
    this.setState({ errors });
    if (Object.keys(errors).length) {
      for (var key in errors) {
        e.target[key].classList.add("is-invalid");
      }
      return;
    }
    this.setState({
      loading: true,
    });
    this.props.onAuth(data.username, data.password);
  };

  validate = (data) => {
    const errors = {};
    if (!data.username) {
      errors.username = "Field cannot be empty!";
    }
    if (!data.password) {
      errors.password = "Field cannot be empty!";
    }
    return errors;
  };

  render() {
    if (this.props.loggedIn && this.props.user_status === "nonadmin") {
      //  redirect if logged in
      return <Redirect to="/home" />;
    } else if (!this.props.loading && this.state.loading) {
      this.setState({
        loading: false,
      });
    }
    const { data, errors } = this.state;
    return (
      <div>
        <HeaderComponent></HeaderComponent>
        <div className="container-fluid row text-center mt-3 mb-3">
          <div className="col-4"></div>
          <div className="col-md-4 col-12">
            <form onSubmit={this.onSubmit} method="post">
              <h2 className="text-default-black mb-4">Login</h2>
              <div className="input-group input-group mb-3">
                <div className="input-group-prepend">
                  <div
                    className="text-pink input-group-icon"
                    id="inputGroup-sizing-sm"
                    style={{ padding: "7px" }}
                  >
                    <i
                      className="fa fa-user-o"
                      style={{ fontSize: "large" }}
                    ></i>
                  </div>
                </div>
                <input
                  type="text"
                  className="form-control rounder"
                  placeholder="Username"
                  name="username"
                  value={data.username}
                  onChange={this.onChange}
                />
                <small className="text-danger w-100">{errors.username}</small>
              </div>
              <div className="input-group input-group mb-3 mt-3">
                <div className="input-group-prepend">
                  <div
                    className="text-pink input-group-icon"
                    id="inputGroup-sizing-sm"
                    style={{ padding: "7px" }}
                  >
                    <i className="fa fa-lock" style={{ fontSize: "large" }}></i>
                  </div>
                </div>
                <input
                  type="password"
                  className="form-control rounder"
                  placeholder="Password"
                  name="password"
                  value={data.password}
                  onChange={this.onChange}
                />
                <small className="text-danger w-100">{errors.password}</small>
              </div>
              <div>
                <small className="mt-2 text-danger w-100">
                  {this.props.error}
                </small>
              </div>
              <button type="submit" className="btn btn-pink rounder px-5 m-1 ">
                <div className="d-flex justify-content-between">
                  <div>Login</div>
                  {this.props.loading && this.state.loading && (
                    <Loader
                      className="ml-3"
                      type="TailSpin"
                      color="#cd9999"
                      height={20}
                      width={20}
                    />
                  )}
                </div>
              </button>

              <div className="row">
                <div className="col-1 text-right">
                  <label className="checkbox-container">
                    <input
                      name="rememberme"
                      type="checkbox"
                      checked={data.rememberme}
                      onChange={this.onChange}
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>
                <div className="col-9 text-left text-pink">
                  <div className=" font-weight-bold">Remember me</div>
                </div>
              </div>
              <strong className="text-default-black mt-0 h3">OR</strong>

              <button
                type="submit"
                className="btn btn-primary btn-block rounder mt-3"
              >
                <i className="fa fa-facebook mr-2"></i>
                Continue with Facebook
              </button>

              <button
                type="submit"
                className="btn btn-secondary btn-block rounder mt-3"
                style={{ paddingInline: "10%" }}
              >
                <i className="fa fa-google mr-2"></i>
                Continue with Google
              </button>
              <p className="small mt-4">
                Not a member yet?{" "}
                <Link to="/sign-up" className="alert-link text-default-black">
                  Signup
                </Link>{" "}
                instead
              </p>
            </form>
          </div>
          <div className="col-4"></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.authReducer.loading,
    error: state.authReducer.error,
    loggedIn: state.authReducer.loggedIn,
    user_status: state.authReducer.user_status
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (username, password) =>
      dispatch(actions.authLogin(username, password, "NONADMIN")),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
